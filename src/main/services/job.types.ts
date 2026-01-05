import type { Job, JobLogEntry, JobTelemetry, ResolvedEncoderBackend } from '@shared/types';

export interface QueueJob extends Job {
  sourcePaths: string[];
}

export interface PublishJobEventOptions {
  progress: number;
  message: string;
  outputPath?: string;
  telemetry?: JobTelemetry;
  logEntry?: JobLogEntry;
  error?: string;
  resolvedEncoderBackend?: ResolvedEncoderBackend;
}
