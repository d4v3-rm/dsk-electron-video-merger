import type { ConversionSettings, InputFileDTO, ResolvedEncoderBackend } from './video.types';

export type JobStatus = 'queued' | 'running' | 'completed' | 'error';
export type JobLogLevel = 'info' | 'warning' | 'error';
export type JobLogStage = 'queue' | 'prepare' | 'encode' | 'finalize' | 'system';

export interface JobTelemetry {
  totalDurationMs?: number;
  processedDurationMs?: number;
  fps?: number;
  speed?: number;
  bitrate?: string;
}

export interface JobLogEntry {
  id: string;
  timestamp: number;
  level: JobLogLevel;
  stage: JobLogStage;
  message: string;
  progress?: number;
}

export interface Job {
  id: string;
  status: JobStatus;
  files: InputFileDTO[];
  settings: ConversionSettings;
  outputPaths: string[];
  progress: number;
  message: string;
  createdAt: number;
  updatedAt: number;
  logs: JobLogEntry[];
  telemetry?: JobTelemetry;
  resolvedEncoderBackend?: ResolvedEncoderBackend;
  error?: string;
}

export interface JobListPayload {
  jobs: Job[];
}

export interface JobCreationPayload {
  filePaths: string[];
  settings: ConversionSettings;
}

export interface JobProgressPayload {
  jobId: string;
  status: JobStatus;
  progress: number;
  message: string;
  outputPath?: string;
  telemetry?: JobTelemetry;
  logEntry?: JobLogEntry;
  resolvedEncoderBackend?: ResolvedEncoderBackend;
  error?: string;
}
