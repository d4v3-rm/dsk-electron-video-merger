import type {
  CompressionPreset,
  ConversionSettings,
  EncoderBackend,
  HardwareAccelerationProfile,
  InputFileDTO,
  Job,
  JobProgressPayload,
  OutputFormat,
} from '@shared/types';

export type SelectedFileMoveDirection = 'up' | 'down';

export interface AppStoreState {
  selectedFiles: InputFileDTO[];
  jobs: Job[];
  hardwareAccelerationProfile: HardwareAccelerationProfile;
  hardwareAccelerationLoaded: boolean;
  outputDirectory: string | null;
  settings: ConversionSettings;
  loading: boolean;
  loaded: boolean;
  refreshJobs: () => Promise<void>;
  refreshHardwareAccelerationProfile: () => Promise<void>;
  selectVideoFiles: () => Promise<void>;
  selectOutputDirectory: () => Promise<void>;
  clearOutputDirectory: () => void;
  setOutputFormat: (outputFormat: OutputFormat) => void;
  setCompression: (compression: CompressionPreset) => void;
  setEncoderBackend: (encoderBackend: EncoderBackend) => void;
  clearSelectedFiles: () => void;
  removeSelectedFile: (id: string) => void;
  moveSelectedFile: (id: string, direction: SelectedFileMoveDirection) => void;
  createJob: () => Promise<void>;
  upsertJobProgress: (payload: JobProgressPayload) => void;
}
