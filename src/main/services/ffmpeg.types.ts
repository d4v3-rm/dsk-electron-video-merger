import type {
  CompressionPreset,
  JobLogStage,
  JobTelemetry,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';

export interface JobProgressUpdate {
  progress: number;
  message: string;
  stage: JobLogStage;
  telemetry?: JobTelemetry;
  logMessage?: string;
}

export type JobProgressCallback = (update: JobProgressUpdate) => void;

export interface EncoderArgs {
  args: string[];
}

export interface ProgressState {
  bitrate?: string;
  fps?: number;
  outTime?: string;
  speed?: number;
}

export interface ProcessSingleMergeOptions {
  inputPaths: string[];
  outputPath: string;
  format: OutputFormat;
  compression: CompressionPreset;
  resolvedEncoderBackend: ResolvedEncoderBackend;
  tempDir: string;
  onProgress: JobProgressCallback;
}

export interface ProcessSingleCompressionOptions {
  inputPath: string;
  outputPath: string;
  format: OutputFormat;
  compression: CompressionPreset;
  resolvedEncoderBackend: ResolvedEncoderBackend;
  onProgress: JobProgressCallback;
}
