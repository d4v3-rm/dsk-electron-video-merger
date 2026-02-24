import type { BrowserWindow } from 'electron';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { IPC_CHANNELS } from '@shared/ipc';
import type {
  Job,
  JobCreationPayload,
  JobProgressPayload,
  JobStatus,
  JobTelemetry,
  ResolvedEncoderBackend,
} from '@shared/types';
import { appendJobLog } from '@main/services/job/job-log.utils';
import { buildQueuedMessage } from '@main/services/job/job-message.utils';
import type { PublishJobEventOptions, QueueJob } from '@main/services/job.types';

export const MAX_JOB_LOG_ENTRIES = 160;

export const stripInternalJob = (job: QueueJob): Job => ({
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
});

export const createQueuedJob = (
  payload: JobCreationPayload,
  createLogEntry: (stage: QueueJob['logs'][number]['stage'], level: QueueJob['logs'][number]['level'], message: string, progress?: number) => QueueJob['logs'][number],
): QueueJob => {
  const sourcePaths = [...new Set(payload.filePaths)];
  const now = Date.now();
  const files = sourcePaths.map((filePath) => ({
    id: filePath,
    name: path.basename(filePath),
    path: filePath,
    size: 0,
  }));

  return {
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
    logs: [createLogEntry('queue', 'info', buildQueuedMessage(payload.mode, files.length), 0)],
    sourcePaths,
  };
};

export const createJobPublisher = (
  getMainWindow: () => BrowserWindow | null,
) => (job: QueueJob, options: PublishJobEventOptions): void => {
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

  getMainWindow()?.webContents.send(IPC_CHANNELS.jobsProgress, payload);
};

export const createJobStatusUpdater = (
  jobs: Map<string, QueueJob>,
  publishJobEvent: (job: QueueJob, options: PublishJobEventOptions) => void,
) => async (
  job: QueueJob,
  status: JobStatus,
  progress: number,
  message: string,
  outputPaths: string[] = job.outputPaths,
  error?: string,
  resolvedEncoderBackend: ResolvedEncoderBackend | undefined = job.resolvedEncoderBackend,
  telemetry: JobTelemetry | undefined = job.telemetry,
  logEntry?: QueueJob['logs'][number],
): Promise<void> => {
  job.status = status;
  job.progress = progress;
  job.message = message;
  job.outputPaths = outputPaths;
  job.error = error;
  job.telemetry = telemetry;
  job.resolvedEncoderBackend = resolvedEncoderBackend;
  job.updatedAt = Date.now();

  publishJobEvent(job, {
    progress,
    message,
    outputPath: outputPaths.at(-1),
    telemetry,
    error,
    resolvedEncoderBackend,
    logEntry,
  });

  jobs.set(job.id, job);
};
