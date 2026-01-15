import fs from 'node:fs/promises';
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
  JobMode,
  JobProgressPayload,
  JobStatus,
  JobTelemetry,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';
import type { JobProgressUpdate } from '@main/services/ffmpeg.types';
import { FfmpegService } from '@main/services/ffmpeg.service';
import { StorageService } from '@main/services/storage.service';
import type { PublishJobEventOptions, QueueJob } from '@main/services/job.types';

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
      logs: [this.createLogEntry('queue', 'info', this.buildQueuedMessage(payload.mode, files.length), 0)],
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
        this.buildStartMessage(job.mode, job.settings.encoderBackend, resolvedEncoderBackend),
        job.outputPaths,
        undefined,
        resolvedEncoderBackend,
        undefined,
        this.createLogEntry(
          'prepare',
          'info',
          this.buildStartMessage(job.mode, job.settings.encoderBackend, resolvedEncoderBackend),
          5,
        ),
      );

      const { outputDir, tempDir: nextTempDir } = await this.storageService.buildJobFolders(
        job.id,
        job.outputDirectory,
      );
      tempDir = nextTempDir;

      const outputPaths =
        job.mode === 'compress'
          ? await this.runCompressionJob(job, outputDir, resolvedEncoderBackend)
          : await this.runMergeJob(job, outputDir, tempDir, resolvedEncoderBackend);

      await this.updateStatus(
        job,
        'completed',
        100,
        this.buildCompletionMessage(job.mode, outputPaths.length),
        outputPaths,
        undefined,
        resolvedEncoderBackend,
        job.telemetry,
        this.createLogEntry(
          'finalize',
          'info',
          this.buildSuccessLogMessage(job.mode, outputPaths.length),
          100,
        ),
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

  private async runMergeJob(
    job: QueueJob,
    outputDir: string,
    tempDir: string,
    resolvedEncoderBackend: ResolvedEncoderBackend,
  ): Promise<string[]> {
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

    return [output];
  }

  private async runCompressionJob(
    job: QueueJob,
    outputDir: string,
    resolvedEncoderBackend: ResolvedEncoderBackend,
  ): Promise<string[]> {
    const outputs: string[] = [];
    const reservedOutputPaths = new Set<string>();
    const totalFiles = job.sourcePaths.length;

    for (const [index, inputPath] of job.sourcePaths.entries()) {
      const inputFileName = path.basename(inputPath);
      const outputPath = await this.resolveCompressionOutputPath(
        outputDir,
        inputPath,
        job.settings.outputFormat,
        reservedOutputPaths,
      );
      const preparationProgress = this.mapBatchProgress(index, totalFiles, 4);
      const scopeLabel = `${inputFileName} (${index + 1}/${totalFiles})`;

      this.publishJobEvent(job, {
        progress: Math.max(job.progress, preparationProgress),
        message: `Preparing compression for ${scopeLabel}`,
        outputPath,
        resolvedEncoderBackend,
        telemetry: job.telemetry,
        logEntry: this.createLogEntry(
          'prepare',
          'info',
          `Compression target resolved for ${scopeLabel}: ${outputPath}`,
          preparationProgress,
        ),
      });

      const output = await this.ffmpegService.processSingleCompression({
        inputPath,
        outputPath,
        format: job.settings.outputFormat,
        compression: job.settings.compression,
        resolvedEncoderBackend,
        onProgress: (update: JobProgressUpdate) => {
          const progress = this.mapBatchProgress(index, totalFiles, update.progress);
          const message = `${scopeLabel} | ${update.message}`;

          this.publishJobEvent(job, {
            progress,
            message,
            outputPath,
            telemetry: update.telemetry,
            resolvedEncoderBackend,
            logEntry: update.logMessage
              ? this.createLogEntry(update.stage, 'info', `${scopeLabel} | ${update.logMessage}`, progress)
              : undefined,
          });
        },
      });

      outputs.push(output);

      if (index < totalFiles - 1) {
        const completionProgress = this.mapBatchProgress(index + 1, totalFiles, 0);
        this.publishJobEvent(job, {
          progress: Math.max(job.progress, completionProgress),
          message: `Completed ${index + 1} of ${totalFiles} compression tasks.`,
          outputPath: output,
          telemetry: job.telemetry,
          resolvedEncoderBackend,
          logEntry: this.createLogEntry(
            'finalize',
            'info',
            `Completed compression for ${inputFileName}.`,
            completionProgress,
          ),
        });
      }
    }

    return outputs;
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

  private buildQueuedMessage(mode: JobMode, filesCount: number): string {
    if (mode === 'compress') {
      return `Queued ${filesCount} video${filesCount === 1 ? '' : 's'} for compression.`;
    }

    return `Queued ${filesCount} clip${filesCount === 1 ? '' : 's'} for merge.`;
  }

  private buildStartMessage(
    mode: JobMode,
    requestedBackend: JobCreationPayload['settings']['encoderBackend'],
    resolvedBackend: ResolvedEncoderBackend,
  ): string {
    const operationLabel = mode === 'merge' ? 'merge' : 'compression';

    if (requestedBackend === 'nvidia' && resolvedBackend === 'cpu') {
      return `NVIDIA NVENC is unavailable. Falling back to CPU ${operationLabel}.`;
    }

    if (resolvedBackend === 'nvidia') {
      return requestedBackend === 'auto'
        ? `Starting ${operationLabel} with automatic NVIDIA NVENC selection.`
        : `Starting ${operationLabel} with NVIDIA NVENC.`;
    }

    return `Starting ${operationLabel} with CPU encoding.`;
  }

  private buildCompletionMessage(mode: JobMode, outputCount: number): string {
    if (mode === 'compress') {
      return outputCount === 1
        ? 'Compression completed.'
        : `Compression completed. Generated ${outputCount} files.`;
    }

    return 'Merge completed.';
  }

  private buildSuccessLogMessage(mode: JobMode, outputCount: number): string {
    if (mode === 'compress') {
      return outputCount === 1
        ? 'Compression completed successfully.'
        : `Compression completed successfully. Generated ${outputCount} files.`;
    }

    return 'Merge completed successfully.';
  }

  private mapBatchProgress(itemIndex: number, totalItems: number, itemProgress: number): number {
    if (totalItems <= 1) {
      return itemProgress;
    }

    const normalizedItemProgress = Math.max(0, Math.min(99, itemProgress));
    return Math.max(1, Math.min(99, Math.round((itemIndex * 100 + normalizedItemProgress) / totalItems)));
  }

  private async resolveCompressionOutputPath(
    outputDir: string,
    sourcePath: string,
    outputFormat: OutputFormat,
    reservedOutputPaths: Set<string>,
  ): Promise<string> {
    const baseName = `${path.parse(sourcePath).name}-compressed`;
    let suffix = 0;

    while (true) {
      const candidate = path.join(
        outputDir,
        `${baseName}${suffix === 0 ? '' : `-${suffix + 1}`}.${outputFormat}`,
      );

      if (reservedOutputPaths.has(candidate)) {
        suffix += 1;
        continue;
      }

      try {
        await fs.access(candidate);
        suffix += 1;
      } catch {
        reservedOutputPaths.add(candidate);
        return candidate;
      }
    }
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
