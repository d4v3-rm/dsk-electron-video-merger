import type { BrowserWindow } from 'electron';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { IPC_CHANNELS } from '@shared/ipc';
import type {
  HardwareAccelerationProfile,
  Job,
  JobCreationPayload,
  JobProgressPayload,
  JobStatus,
  JobTelemetry,
  ResolvedEncoderBackend,
} from '@shared/types';
import { FfmpegService } from '@main/services/ffmpeg.service';
import { StorageService } from '@main/services/storage.service';
import { appendJobLog, createJobLogEntry } from '@main/services/job/job-log.utils';
import {
  buildCompletionMessage,
  buildQueuedMessage,
  buildStartMessage,
  buildSuccessLogMessage,
} from '@main/services/job/job-message.utils';
import { CompressionJobRunnerService } from '@main/services/job/compression-job-runner.service';
import { JobOutputPathService } from '@main/services/job/job-output-path.service';
import { MergeJobRunnerService } from '@main/services/job/merge-job-runner.service';
import type { PublishJobEventOptions, QueueJob } from '@main/services/job.types';

const MAX_JOB_LOG_ENTRIES = 160;

export class JobService {
  private jobs = new Map<string, QueueJob>();
  private queue: string[] = [];
  private running = false;
  private mainWindow: BrowserWindow | null = null;
  private readonly mergeJobRunner: MergeJobRunnerService;
  private readonly compressionJobRunner: CompressionJobRunnerService;

  constructor(
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
  ) {
    const outputPathService = new JobOutputPathService();
    this.mergeJobRunner = new MergeJobRunnerService(ffmpegService, outputPathService);
    this.compressionJobRunner = new CompressionJobRunnerService(ffmpegService, outputPathService);
  }

  setWindow(window: BrowserWindow | null): void {
    this.mainWindow = window;
  }

  getJobs(): Job[] {
    return Array.from(this.jobs.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((job) => this.stripInternal(job));
  }

  async getHardwareAccelerationProfile(): Promise<HardwareAccelerationProfile> {
    return this.ffmpegService.getHardwareAccelerationProfile();
  }

  async createJob(payload: JobCreationPayload): Promise<Job> {
    const sourcePaths = [...new Set(payload.filePaths)];
    if (sourcePaths.length === 0) {
      throw new Error(
        `Select at least one video before starting ${payload.mode === 'merge' ? 'a merge' : 'compression'}.`,
      );
    }

    const now = Date.now();
    const files = sourcePaths.map((filePath) => ({
      id: filePath,
      name: path.basename(filePath),
      path: filePath,
      size: 0,
    }));

    const job: QueueJob = {
      id: randomUUID(),
      mode: payload.mode,
      status: 'queued',
      files,
      settings: payload.settings,
      outputPaths: [],
      outputDirectory: payload.outputDirectory,
      progress: 0,
      message: 'Queued',
      createdAt: now,
      updatedAt: now,
      logs: [createJobLogEntry('queue', 'info', buildQueuedMessage(payload.mode, files.length), 0)],
      sourcePaths,
    };

    this.jobs.set(job.id, job);
    this.queue.push(job.id);
    void this.processQueue();
    return this.stripInternal(job);
  }

  private async processQueue(): Promise<void> {
    if (this.running) {
      return;
    }

    const nextId = this.queue.shift();
    if (!nextId) {
      return;
    }

    const job = this.jobs.get(nextId);
    if (!job) {
      return;
    }

    this.running = true;
    let tempDir: string | null = null;
    let resolvedEncoderBackend: ResolvedEncoderBackend | undefined;

    try {
      const hardwareProfile = await this.ffmpegService.getHardwareAccelerationProfile();
      resolvedEncoderBackend = this.ffmpegService.resolveEncoderBackend(
        job.settings.encoderBackend,
        job.settings.outputFormat,
        hardwareProfile,
      );

      const startMessage = buildStartMessage(job.mode, job.settings.encoderBackend, resolvedEncoderBackend);

      await this.updateStatus(
        job,
        'running',
        5,
        startMessage,
        job.outputPaths,
        undefined,
        resolvedEncoderBackend,
        undefined,
        createJobLogEntry('prepare', 'info', startMessage, 5),
      );

      const { outputDir, tempDir: nextTempDir } = await this.storageService.buildJobFolders(
        job.id,
        job.outputDirectory,
      );
      tempDir = nextTempDir;

      const outputPaths =
        job.mode === 'compress'
          ? await this.compressionJobRunner.run({
              job,
              outputDir,
              resolvedEncoderBackend,
              publishJobEvent: (nextJob, options) => this.publishJobEvent(nextJob, options),
              createLogEntry: createJobLogEntry,
            })
          : await this.mergeJobRunner.run({
              job,
              outputDir,
              tempDir,
              resolvedEncoderBackend,
              publishJobEvent: (nextJob, options) => this.publishJobEvent(nextJob, options),
              createLogEntry: createJobLogEntry,
            });

      await this.updateStatus(
        job,
        'completed',
        100,
        buildCompletionMessage(job.mode, outputPaths.length),
        outputPaths,
        undefined,
        resolvedEncoderBackend,
        job.telemetry,
        createJobLogEntry('finalize', 'info', buildSuccessLogMessage(job.mode, outputPaths.length), 100),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      await this.updateStatus(
        job,
        'error',
        job.progress,
        message,
        job.outputPaths,
        message,
        resolvedEncoderBackend,
        job.telemetry,
        createJobLogEntry('system', 'error', message, job.progress),
      );
    } finally {
      this.running = false;

      if (tempDir) {
        await this.storageService.cleanTempFolder(tempDir);
      }

      await this.processQueue();
    }
  }

  private async updateStatus(
    job: QueueJob,
    status: JobStatus,
    progress: number,
    message: string,
    outputPaths: string[] = job.outputPaths,
    error?: string,
    resolvedEncoderBackend: ResolvedEncoderBackend | undefined = job.resolvedEncoderBackend,
    telemetry: JobTelemetry | undefined = job.telemetry,
    logEntry?: QueueJob['logs'][number],
  ): Promise<void> {
    job.status = status;
    job.progress = progress;
    job.message = message;
    job.outputPaths = outputPaths;
    job.error = error;
    job.telemetry = telemetry;
    job.resolvedEncoderBackend = resolvedEncoderBackend;
    job.updatedAt = Date.now();

    this.publishJobEvent(job, {
      progress,
      message,
      outputPath: outputPaths.at(-1),
      telemetry,
      error,
      resolvedEncoderBackend,
      logEntry,
    });

    this.jobs.set(job.id, job);
  }

  private publishJobEvent(job: QueueJob, options: PublishJobEventOptions): void {
    const payload: JobProgressPayload = {
      jobId: job.id,
      status: job.status,
      progress: options.progress,
      message: options.message,
      outputPath: options.outputPath,
      telemetry: options.telemetry,
      logEntry: options.logEntry,
      resolvedEncoderBackend: options.resolvedEncoderBackend,
      error: options.error,
    };

    job.progress = options.progress;
    job.message = options.message;
    job.updatedAt = Date.now();
    job.telemetry = options.telemetry;
    job.resolvedEncoderBackend = options.resolvedEncoderBackend;

    if (options.outputPath && !job.outputPaths.includes(options.outputPath)) {
      job.outputPaths = [...job.outputPaths, options.outputPath];
    }

    if (options.error) {
      job.error = options.error;
    }

    if (options.logEntry) {
      job.logs = appendJobLog(job.logs, options.logEntry, MAX_JOB_LOG_ENTRIES);
    }

    if (this.mainWindow) {
      this.mainWindow.webContents.send(IPC_CHANNELS.jobsProgress, payload);
    }
  }

  private stripInternal(job: QueueJob): Job {
    return {
      id: job.id,
      mode: job.mode,
      status: job.status,
      files: job.files,
      settings: job.settings,
      outputPaths: job.outputPaths,
      outputDirectory: job.outputDirectory,
      progress: job.progress,
      message: job.message,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      logs: job.logs,
      telemetry: job.telemetry,
      resolvedEncoderBackend: job.resolvedEncoderBackend,
      error: job.error,
    };
  }
}
