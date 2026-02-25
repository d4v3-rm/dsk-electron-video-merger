import type { JobLogEntry, JobLogLevel, JobLogStage, ResolvedEncoderBackend } from '@shared/types';
import type { FfmpegService } from '@main/services/ffmpeg.service';
import {
  buildCompletionMessage,
  buildStartMessage,
  buildSuccessLogMessage,
} from '@main/services/job/job-message.utils';
import { runCompressionJob } from '@main/services/job/compression-job-runner.service';
import { runMergeJob } from '@main/services/job/merge-job-runner.service';
import type { PublishJobEventOptions, QueueJob } from '@main/services/job.types';
import type { StorageService } from '@main/services/storage.service';

interface CreateJobQueueProcessorOptions {
  jobs: Map<string, QueueJob>;
  queue: string[];
  storageService: StorageService;
  ffmpegService: FfmpegService;
  publishJobEvent: (job: QueueJob, options: PublishJobEventOptions) => void;
  updateStatus: (
    job: QueueJob,
    status: QueueJob['status'],
    progress: number,
    message: string,
    outputPaths?: string[],
    error?: string,
    resolvedEncoderBackend?: ResolvedEncoderBackend,
    telemetry?: QueueJob['telemetry'],
    logEntry?: JobLogEntry,
  ) => Promise<void>;
  createLogEntry: (stage: JobLogStage, level: JobLogLevel, message: string, progress?: number) => JobLogEntry;
}

const processSingleQueuedJob = async (
  job: QueueJob,
  {
    storageService,
    ffmpegService,
    publishJobEvent,
    updateStatus,
    createLogEntry,
  }: Omit<CreateJobQueueProcessorOptions, 'jobs' | 'queue'>,
): Promise<void> => {
  let resolvedEncoderBackend: ResolvedEncoderBackend | undefined;

  try {
    const hardwareProfile = await ffmpegService.getHardwareAccelerationProfile();
    resolvedEncoderBackend = ffmpegService.resolveEncoderBackend(
      job.settings.encoderBackend,
      job.settings.outputFormat,
      hardwareProfile,
    );

    const startMessage = buildStartMessage(job.mode, job.settings, resolvedEncoderBackend);

    await updateStatus(
      job,
      'running',
      5,
      startMessage,
      job.outputPaths,
      undefined,
      resolvedEncoderBackend,
      undefined,
      createLogEntry('prepare', 'info', startMessage, 5),
    );

    const { outputDir } = await storageService.buildJobFolders(job.id, job.outputDirectory);
    const runnerOptions = {
      job,
      outputDir,
      resolvedEncoderBackend,
      ffmpegService,
      publishJobEvent,
      createLogEntry,
    };
    const outputPaths =
      job.mode === 'compress' ? await runCompressionJob(runnerOptions) : await runMergeJob(runnerOptions);

    await updateStatus(
      job,
      'completed',
      100,
      buildCompletionMessage(job.mode, outputPaths.length),
      outputPaths,
      undefined,
      resolvedEncoderBackend,
      job.telemetry,
      createLogEntry('finalize', 'info', buildSuccessLogMessage(job.mode, outputPaths.length), 100),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    await updateStatus(
      job,
      'error',
      job.progress,
      message,
      job.outputPaths,
      message,
      resolvedEncoderBackend,
      job.telemetry,
      createLogEntry('system', 'error', message, job.progress),
    );
  }
};

export const createJobQueueProcessor = ({
  jobs,
  queue,
  storageService,
  ffmpegService,
  publishJobEvent,
  updateStatus,
  createLogEntry,
}: CreateJobQueueProcessorOptions): (() => Promise<void>) => {
  let running = false;

  const processQueue = async (): Promise<void> => {
    if (running) {
      return;
    }

    const nextId = queue.shift();
    if (!nextId) {
      return;
    }

    const job = jobs.get(nextId);
    if (!job) {
      await processQueue();
      return;
    }

    running = true;

    try {
      await processSingleQueuedJob(job, {
        storageService,
        ffmpegService,
        publishJobEvent,
        updateStatus,
        createLogEntry,
      });
    } finally {
      running = false;
      await processQueue();
    }
  };

  return processQueue;
};
