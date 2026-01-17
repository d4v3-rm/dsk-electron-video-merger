import type { JobLogEntry, JobLogLevel, JobLogStage, ResolvedEncoderBackend } from '@shared/types';
import type { PublishJobEventOptions, QueueJob } from '@main/services/job.types';

export interface JobRunnerContext {
  job: QueueJob;
  outputDir: string;
  resolvedEncoderBackend: ResolvedEncoderBackend;
  publishJobEvent: (job: QueueJob, options: PublishJobEventOptions) => void;
  createLogEntry: (stage: JobLogStage, level: JobLogLevel, message: string, progress?: number) => JobLogEntry;
}

export interface MergeJobRunnerOptions extends JobRunnerContext {
  tempDir: string;
}

export type CompressionJobRunnerOptions = JobRunnerContext;
