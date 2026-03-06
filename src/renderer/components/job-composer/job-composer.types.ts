import type {
  ConversionSettings,
  HardwareAccelerationProfile,
  InputFileDTO,
  OutputFormat,
  OutputResolution,
  TargetFrameRate,
  VideoTimingMode,
} from '@shared/types';
import type { ReactNode } from 'react';

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
  queueTitle: string;
  queueHint: string;
  deliveryValue: string;
}

export interface JobComposerSummaryItem {
  key: string;
  label: string;
  children: ReactNode;
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
  timingModeDescription: string;
}

export interface JobComposerStatsProps {
  statsLabel: string;
  selectedFiles: InputFileDTO[];
  stagingSizeLabel: string;
  deliveryLabel: string;
  deliveryValue: string;
}

export interface JobComposerSettingsFormProps {
  outputDirectory: string | null;
  settings: ConversionSettings;
  nvidiaAvailable: boolean;
  nvidiaSupportedForFormat: boolean;
  setOutputFormat: (outputFormat: ConversionSettings['outputFormat']) => void;
  setOutputResolution: (outputResolution: OutputResolution) => void;
  setCompression: (compression: ConversionSettings['compression']) => void;
  setEncoderBackend: (encoderBackend: ConversionSettings['encoderBackend']) => void;
  setVideoTimingMode: (videoTimingMode: VideoTimingMode) => void;
  setTargetFrameRate: (targetFrameRate: TargetFrameRate) => void;
  selectOutputDirectory: () => Promise<void>;
  clearOutputDirectory: () => void;
}

export interface JobComposerSelectableOption<TValue extends string | number> {
  value: TValue;
  title: string;
  description: string;
  badges: string[];
  meta?: string;
  disabled?: boolean;
}

export interface JobComposerOptionCardProps {
  title: string;
  description: string;
  badges: string[];
  selected: boolean;
  onClick: () => void;
  meta?: string;
  disabled?: boolean;
}

export interface BuildCompressionOptionsParams {
  selectedOutputFormat: OutputFormat;
}

export interface BuildBackendOptionsParams {
  nvidiaAvailable: boolean;
  nvidiaSupportedForFormat: boolean;
}

export interface BuildTimingOptionsParams {
  selectedTimingMode: VideoTimingMode;
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

export interface JobComposerExecutionNotesProps {
  title: string;
  orderInfo: string;
  orderAlertType: 'info' | 'warning';
  hardwareAccelerationLoaded: boolean;
  hardwareAccelerationProfile: HardwareAccelerationProfile;
  hardwareAlertType: 'success' | 'info' | 'warning';
  hardwareDetectingLabel: string;
  encoderModeDescription: string;
  timingModeDescription: string;
  setupSummary: JobComposerSummaryItem[];
  backendSelectedLabel: string;
  backendCopy: string;
  destinationCopy: string;
}

export interface JobComposerQueuePanelProps {
  title: string;
  queueHint: string;
  selectedFilesCount: number;
  loading: boolean;
  addButtonLabel: string;
  clearButtonLabel: string;
  startButtonLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  isMergeMode: boolean;
  selectedFiles: InputFileDTO[];
  selectVideoFiles: () => Promise<void>;
  clearSelectedFiles: () => void;
  createJob: () => Promise<void>;
  removeSelectedFile: (id: string) => void;
  moveSelectedFile: (id: string, direction: 'up' | 'down') => void;
  moveUpTooltipLabel: string;
  moveDownTooltipLabel: string;
  removeTooltipLabel: string;
  startTagLabel: string;
  endTagLabel: string;
  startRoleLabel: string;
  endRoleLabel: string;
  middleRoleLabel: string;
  sourceRoleLabel: string;
}
