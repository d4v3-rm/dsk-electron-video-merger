import type { HardwareAccelerationProfile, InputFileDTO, ConversionSettings } from '@shared/types';

export interface JobComposerModeCopy {
  cardTitle: string;
  queueTag: string;
  title: string;
  subtitle: string;
  orderInfo: string;
  orderAlertType: 'info' | 'warning';
  statsLabel: string;
  addButtonLabel: string;
  clearButtonLabel: string;
  startButtonLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export interface JobComposerHeaderProps {
  queueTag: string;
  nvidiaAvailable: boolean;
  nvidiaAvailableLabel: string;
  cpuOnlyLabel: string;
}

export interface JobComposerAlertsProps {
  orderInfo: string;
  orderAlertType: 'info' | 'warning';
  hardwareAccelerationLoaded: boolean;
  hardwareAccelerationProfile: HardwareAccelerationProfile;
  hardwareAlertType: 'success' | 'info' | 'warning';
  hardwareDetectingLabel: string;
  encoderModeDescription: string;
}

export interface JobComposerStatsProps {
  statsLabel: string;
  selectedFiles: InputFileDTO[];
  stagingSizeLabel: string;
}

export interface JobComposerSettingsFormProps {
  outputDirectory: string | null;
  settings: ConversionSettings;
  nvidiaAvailable: boolean;
  nvidiaSupportedForFormat: boolean;
  destinationDefaultLabel: string;
  autoPrefersNvidiaLabel: string;
  autoStaysCpuLabel: string;
  outputFormatLabel: string;
  compressionLabel: string;
  backendLabel: string;
  destinationFolderLabel: string;
  selectDestinationLabel: string;
  useDefaultDestinationLabel: string;
  setOutputFormat: (outputFormat: ConversionSettings['outputFormat']) => void;
  setCompression: (compression: ConversionSettings['compression']) => void;
  setEncoderBackend: (encoderBackend: ConversionSettings['encoderBackend']) => void;
  selectOutputDirectory: () => Promise<void>;
  clearOutputDirectory: () => void;
}

export interface JobComposerActionBarProps {
  selectedFilesCount: number;
  loading: boolean;
  addButtonLabel: string;
  clearButtonLabel: string;
  startButtonLabel: string;
  selectVideoFiles: () => Promise<void>;
  clearSelectedFiles: () => void;
  createJob: () => Promise<void>;
}

export interface FileSelectionListSharedProps {
  selectedFiles: InputFileDTO[];
  removeSelectedFile: (id: string) => void;
  removeTooltipLabel: string;
}

export interface MergeSelectionListProps extends FileSelectionListSharedProps {
  moveSelectedFile: (id: string, direction: 'up' | 'down') => void;
  moveUpTooltipLabel: string;
  moveDownTooltipLabel: string;
  startTagLabel: string;
  endTagLabel: string;
  startRoleLabel: string;
  endRoleLabel: string;
  middleRoleLabel: string;
}

export interface CompressionSelectionListProps extends FileSelectionListSharedProps {
  sourceRoleLabel: string;
}

export interface JobComposerEmptyStateProps {
  title: string;
  description: string;
}
