import type { ReactNode } from 'react';
import type { ConversionSettings, Job, JobMode } from '@shared/types';

export interface PreviewMetric {
  key: string;
  title: string;
  value: number | string;
  prefix: ReactNode;
}

export interface PreviewModel {
  totalSize: number;
  activeJob: Job | null;
  latestCompletedJob: Job | null;
  previewMode: JobMode;
  previewSettings: ConversionSettings;
  previewSeedFile?: string;
  previewOutputDirectory: string | null;
  latestOutputPath: string | null;
  previewName: string;
  previewStatus: string;
  inputCount: number;
}
