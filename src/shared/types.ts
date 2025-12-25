export type JobStatus = 'queued' | 'running' | 'completed' | 'error';
export type OutputFormat = 'mp4' | 'mov' | 'webm';
export type CompressionPreset = 'light' | 'balanced' | 'strong';
export type EncoderBackend = 'auto' | 'cpu' | 'nvidia';
export type ResolvedEncoderBackend = 'cpu' | 'nvidia';

export interface InputFileDTO {
  id: string;
  name: string;
  path: string;
  size: number;
}

export interface ConversionSettings {
  outputFormat: OutputFormat;
  compression: CompressionPreset;
  encoderBackend: EncoderBackend;
}

export interface HardwareAccelerationSupport {
  available: boolean;
  encoder: string | null;
  hardwareAccel: string | null;
  supportedOutputFormats: OutputFormat[];
  reason: string;
}

export interface HardwareAccelerationProfile {
  nvidia: HardwareAccelerationSupport;
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
  resolvedEncoderBackend?: ResolvedEncoderBackend;
  error?: string;
}
