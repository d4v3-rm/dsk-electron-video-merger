export type JobType = 'single' | 'bulk';
export type JobStatus = 'queued' | 'running' | 'completed' | 'error';
export type OutputFormat = 'mp4' | 'mov' | 'webm';
export type CompressionPreset = 'light' | 'balanced' | 'strong';

export interface InputFileDTO {
  id: string;
  name: string;
  path: string;
  size: number;
}

export interface ConversionSettings {
  outputFormat: OutputFormat;
  compression: CompressionPreset;
}

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  files: InputFileDTO[];
  settings: ConversionSettings;
  outputPaths: string[];
  progress: number;
  message: string;
  createdAt: number;
  updatedAt: number;
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
  error?: string;
}
