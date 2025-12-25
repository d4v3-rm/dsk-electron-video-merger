import type { BrowserWindow } from 'electron';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { IPC_CHANNELS } from '../../shared/ipc';
import type {
  HardwareAccelerationProfile,
  Job,
  JobCreationPayload,
  JobProgressPayload,
  JobStatus,
  ResolvedEncoderBackend,
} from '../../shared/types';
import { FfmpegService } from './ffmpeg.service';
import { StorageService } from './storage.service';

interface QueueJob extends Job {
  sourcePaths: string[];
}

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
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  async getHardwareAccelerationProfile(): Promise<HardwareAccelerationProfile> {
    return this.ffmpegService.getHardwareAccelerationProfile();
  }

  async createJob(payload: JobCreationPayload): Promise<Job> {
    const sourcePaths = [...new Set(payload.filePaths)];
    if (sourcePaths.length === 0) {
      throw new Error('Seleziona almeno un file video prima di avviare il merge.');
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
      message: 'In coda',
      createdAt: now,
      updatedAt: now,
      sourcePaths,
    };

    this.jobs.set(job.id, job);
    this.queue.push(job.id);
    this.emitProgress(job, job.progress, job.message);
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
      );

      const { outputDir, tempDir: nextTempDir } = await this.storageService.buildJobFolders(job.id);
      tempDir = nextTempDir;
      const outputPath = path.join(outputDir, `merged-${Date.now()}.${job.settings.outputFormat}`);
      const output = await this.ffmpegService.processSingleMerge({
        inputPaths: job.sourcePaths,
        outputPath,
        format: job.settings.outputFormat,
        compression: job.settings.compression,
        resolvedEncoderBackend,
        tempDir,
        onProgress: (progress, message) =>
          this.emitProgress(job, progress, message, outputPath, undefined, resolvedEncoderBackend),
      });

      await this.updateStatus(
        job,
        'completed',
        100,
        'Completato',
        [output],
        undefined,
        resolvedEncoderBackend,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore imprevisto';
      await this.updateStatus(
        job,
        'error',
        job.progress,
        message,
        job.outputPaths,
        message,
        resolvedEncoderBackend,
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
  ): Promise<void> {
    job.status = status;
    job.progress = progress;
    job.message = message;
    job.outputPaths = outputPaths;
    job.error = error;
    job.resolvedEncoderBackend = resolvedEncoderBackend;
    job.updatedAt = Date.now();
    this.emitProgress(job, progress, message, outputPaths.at(-1), error, resolvedEncoderBackend);
    this.jobs.set(job.id, job);
  }

  private emitProgress(
    job: QueueJob,
    progress: number,
    message: string,
    outputPath?: string,
    error?: string,
    resolvedEncoderBackend: ResolvedEncoderBackend | undefined = job.resolvedEncoderBackend,
  ): void {
    const payload: JobProgressPayload = {
      jobId: job.id,
      status: job.status,
      progress,
      message,
      outputPath,
      resolvedEncoderBackend,
      error,
    };

    job.progress = progress;
    job.message = message;
    job.updatedAt = Date.now();
    job.resolvedEncoderBackend = resolvedEncoderBackend;
    if (error) {
      job.error = error;
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
      resolvedEncoderBackend: job.resolvedEncoderBackend,
      error: job.error,
    };
  }

  private buildStartMessage(
    requestedBackend: JobCreationPayload['settings']['encoderBackend'],
    resolvedBackend: ResolvedEncoderBackend,
  ): string {
    if (requestedBackend === 'nvidia' && resolvedBackend === 'cpu') {
      return 'NVENC non disponibile, fallback CPU';
    }

    if (resolvedBackend === 'nvidia') {
      return requestedBackend === 'auto' ? 'Avvio transcodifica NVIDIA (Auto)' : 'Avvio transcodifica NVIDIA';
    }

    return 'Avvio transcodifica CPU';
  }
}
