import type { JobLogEntry, JobLogLevel, JobLogStage, ResolvedEncoderBackend } from '@shared/types';
import type { FfmpegService } from '@main/services/ffmpeg.service';
import type { PublishJobEventOptions, QueueJob } from '@main/services/job.types';

export interface JobRunnerContext {
  job: QueueJob;
  outputDir: string;
  resolvedEncoderBackend: ResolvedEncoderBackend;
  ffmpegService: FfmpegService;
  publishJobEvent: (job: QueueJob, options: PublishJobEventOptions) => void;
  createLogEntry: (stage: JobLogStage, level: JobLogLevel, message: string, progress?: number) => JobLogEntry;
}

export type MergeJobRunnerOptions = JobRunnerContext;
export type CompressionJobRunnerOptions = JobRunnerContext;
