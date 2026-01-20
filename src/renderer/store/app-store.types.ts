import type { StateCreator } from 'zustand';
import type {
  CompressionPreset,
  ConversionSettings,
  EncoderBackend,
  HardwareAccelerationProfile,
  InputFileDTO,
  Job,
  JobMode,
  JobProgressPayload,
  OutputFormat,
} from '@shared/types';

export type SelectedFileMoveDirection = 'up' | 'down';

export interface WorkspaceSlice {
  jobMode: JobMode;
  selectedFiles: InputFileDTO[];
  outputDirectory: string | null;
  selectVideoFiles: () => Promise<void>;
  selectOutputDirectory: () => Promise<void>;
  clearOutputDirectory: () => void;
  setJobMode: (jobMode: JobMode) => void;
  clearSelectedFiles: () => void;
  removeSelectedFile: (id: string) => void;
  moveSelectedFile: (id: string, direction: SelectedFileMoveDirection) => void;
}

export interface SettingsSlice {
  settings: ConversionSettings;
  setOutputFormat: (outputFormat: OutputFormat) => void;
  setCompression: (compression: CompressionPreset) => void;
  setEncoderBackend: (encoderBackend: EncoderBackend) => void;
}

export interface HardwareSlice {
  hardwareAccelerationProfile: HardwareAccelerationProfile;
  hardwareAccelerationLoaded: boolean;
  refreshHardwareAccelerationProfile: () => Promise<void>;
}

export interface JobsSlice {
  jobs: Job[];
  loading: boolean;
  loaded: boolean;
  refreshJobs: () => Promise<void>;
  createJob: () => Promise<void>;
  upsertJobProgress: (payload: JobProgressPayload) => void;
}

export type AppStoreState = WorkspaceSlice & SettingsSlice & HardwareSlice & JobsSlice;

export type AppStoreSlice<TSlice> = StateCreator<AppStoreState, [], [], TSlice>;
