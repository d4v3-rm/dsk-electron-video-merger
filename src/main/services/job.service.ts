import type { BrowserWindow } from 'electron';
import { randomUUID } from 'node:crypto';
import { IPC_CHANNELS } from '../../shared/ipc';
import type { Job, JobCreationPayload, JobProgressPayload, JobStatus } from '../../shared/types';
import { FfmpegService } from './ffmpeg.service';
import { StorageService } from './storage.service';
import path from 'node:path';

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

  async createJob(type: 'single' | 'bulk', payload: JobCreationPayload): Promise<Job> {
    const now = Date.now();
    const files = payload.filePaths.map((filePath) => ({
      id: filePath,
      name: path.basename(filePath),
      path: filePath,
      size: 0,
    }));

    const job: QueueJob = {
      id: randomUUID(),
      type,
      status: 'queued',
      files,
      settings: payload.settings,
      outputPaths: [],
      progress: 0,
      message: 'In coda',
      createdAt: now,
      updatedAt: now,
      sourcePaths: [...payload.filePaths],
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
    await this.updateStatus(job, 'running', 5, 'Avvio elaborazione');

    try {
      const { outputDir, tempDir } = await this.storageService.buildJobFolders(job.id);
      const { settings } = job;

      if (job.type === 'single') {
        const outputPath = path.join(outputDir, `merged-${Date.now()}.${settings.outputFormat}`);
        const output = await this.ffmpegService.processSingleMerge({
          inputPaths: job.sourcePaths,
          outputPath,
          format: settings.outputFormat,
          compression: settings.compression,
          tempDir,
          onProgress: (progress, message) => this.emitProgress(job, progress, message, outputPath),
        });
        await this.updateStatus(job, 'completed', 100, 'Completato', [output]);
      } else {
        const outputs = await this.ffmpegService.processBulk({
          inputPaths: job.sourcePaths,
          format: settings.outputFormat,
          compression: settings.compression,
          outputDir,
          onProgress: (progress, message, outputPath) =>
            this.emitProgress(job, progress, message, outputPath),
        });
        await this.updateStatus(job, 'completed', 100, 'Completato', outputs);
      }

      await this.storageService.cleanTempFolder(tempDir);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore imprevisto';
      await this.updateStatus(job, 'error', job.progress, message, job.outputPaths, message);
    }

    this.running = false;
    await this.processQueue();
  }

  private async updateStatus(
    job: QueueJob,
    status: JobStatus,
    progress: number,
    message: string,
    outputPaths: string[] = job.outputPaths,
    error?: string,
  ): Promise<void> {
    job.status = status;
    job.progress = progress;
    job.message = message;
    job.outputPaths = outputPaths;
    job.error = error;
    job.updatedAt = Date.now();
    this.emitProgress(job, progress, message, outputPaths.at(-1), error);
    this.jobs.set(job.id, job);
  }

  private emitProgress(
    job: QueueJob,
    progress: number,
    message: string,
    outputPath?: string,
    error?: string,
  ): void {
    const payload: JobProgressPayload = {
      jobId: job.id,
      status: job.status,
      progress,
      message,
      outputPath,
      error,
    };

    job.progress = progress;
    job.message = message;
    job.updatedAt = Date.now();
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
      type: job.type,
      status: job.status,
      files: job.files,
      settings: job.settings,
      outputPaths: job.outputPaths,
      progress: job.progress,
      message: job.message,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      error: job.error,
    };
  }
}
