import type { BrowserWindow } from 'electron';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { IPC_CHANNELS } from '@shared/ipc';
import type {
  HardwareAccelerationProfile,
  Job,
  JobCreationPayload,
  JobLogEntry,
  JobLogLevel,
  JobLogStage,
  JobProgressPayload,
  JobStatus,
  JobTelemetry,
  ResolvedEncoderBackend,
} from '@shared/types';
import type { JobProgressUpdate } from '@main/services/ffmpeg.service';
import { FfmpegService } from '@main/services/ffmpeg.service';
import { StorageService } from '@main/services/storage.service';

interface QueueJob extends Job {
  sourcePaths: string[];
}

interface PublishJobEventOptions {
  progress: number;
  message: string;
  outputPath?: string;
  telemetry?: JobTelemetry;
  logEntry?: JobLogEntry;
  error?: string;
  resolvedEncoderBackend?: ResolvedEncoderBackend;
}

const MAX_JOB_LOG_ENTRIES = 160;

export class JobService {
  private jobs = new Map<string, QueueJob>();
  private queue: string[] = [];
  private running = false;
  private mainWindow: BrowserWindow | null = null;

  constructor(
    private readonly storageService: StorageService,
    private readonly ffmpegService: FfmpegService,
  ) {}

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
      throw new Error('Select at least one video before starting a merge.');
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
      status: 'queued',
      files,
      settings: payload.settings,
      outputPaths: [],
      progress: 0,
      message: 'Queued',
      createdAt: now,
      updatedAt: now,
      logs: [
        this.createLogEntry(
          'queue',
          'info',
          `Queued ${files.length} clip${files.length === 1 ? '' : 's'} for merge.`,
          0,
        ),
      ],
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

      await this.updateStatus(
        job,
        'running',
        5,
        this.buildStartMessage(job.settings.encoderBackend, resolvedEncoderBackend),
        job.outputPaths,
        undefined,
        resolvedEncoderBackend,
        undefined,
        this.createLogEntry(
          'prepare',
          'info',
          this.buildStartMessage(job.settings.encoderBackend, resolvedEncoderBackend),
          5,
        ),
      );

      const { outputDir, tempDir: nextTempDir } = await this.storageService.buildJobFolders(job.id);
      tempDir = nextTempDir;
      const outputPath = path.join(outputDir, `merged-${Date.now()}.${job.settings.outputFormat}`);

      this.publishJobEvent(job, {
        progress: job.progress,
        message: job.message,
        outputPath,
        resolvedEncoderBackend,
        telemetry: job.telemetry,
        logEntry: this.createLogEntry('prepare', 'info', `Output target resolved: ${outputPath}`),
      });

      const output = await this.ffmpegService.processSingleMerge({
        inputPaths: job.sourcePaths,
        outputPath,
        format: job.settings.outputFormat,
        compression: job.settings.compression,
        resolvedEncoderBackend,
        tempDir,
        onProgress: (update: JobProgressUpdate) =>
          this.publishJobEvent(job, {
            progress: update.progress,
            message: update.message,
            outputPath,
            telemetry: update.telemetry,
            resolvedEncoderBackend,
            logEntry: update.logMessage
              ? this.createLogEntry(update.stage, 'info', update.logMessage, update.progress)
              : undefined,
          }),
      });

      await this.updateStatus(
        job,
        'completed',
        100,
        'Completed',
        [output],
        undefined,
        resolvedEncoderBackend,
        {
          ...job.telemetry,
          processedDurationMs: job.telemetry?.totalDurationMs ?? job.telemetry?.processedDurationMs,
        },
        this.createLogEntry('finalize', 'info', 'Merge completed successfully.', 100),
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
        this.createLogEntry('system', 'error', message, job.progress),
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
    logEntry?: JobLogEntry,
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
      job.logs = this.appendLog(job.logs, options.logEntry);
    }

    if (this.mainWindow) {
      this.mainWindow.webContents.send(IPC_CHANNELS.jobsProgress, payload);
    }
  }

  private stripInternal(job: QueueJob): Job {
    return {
      id: job.id,
      status: job.status,
      files: job.files,
      settings: job.settings,
      outputPaths: job.outputPaths,
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

  private buildStartMessage(
    requestedBackend: JobCreationPayload['settings']['encoderBackend'],
    resolvedBackend: ResolvedEncoderBackend,
  ): string {
    if (requestedBackend === 'nvidia' && resolvedBackend === 'cpu') {
      return 'NVIDIA NVENC is unavailable. Falling back to CPU encoding.';
    }

    if (resolvedBackend === 'nvidia') {
      return requestedBackend === 'auto'
        ? 'Starting merge with automatic NVIDIA NVENC selection.'
        : 'Starting merge with NVIDIA NVENC.';
    }

    return 'Starting merge with CPU encoding.';
  }

  private createLogEntry(
    stage: JobLogStage,
    level: JobLogLevel,
    message: string,
    progress?: number,
  ): JobLogEntry {
    return {
      id: randomUUID(),
      timestamp: Date.now(),
      stage,
      level,
      message,
      progress,
    };
  }

  private appendLog(logs: JobLogEntry[], nextLog: JobLogEntry): JobLogEntry[] {
    if (logs.some((entry) => entry.id === nextLog.id)) {
      return logs;
    }

    return [...logs, nextLog].slice(-MAX_JOB_LOG_ENTRIES);
  }
}
