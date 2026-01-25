import type { JobMode } from '@shared/types';
import type { ReactNode } from 'react';

export interface OverviewModeCopy {
  studioTag: string;
  deliveryTag: string;
  title: string;
  body: string;
  chips: string[];
  steps: Array<{
    title: string;
    description: string;
    icon: ReactNode;
  }>;
  firstMetricTitle: string;
}

export interface OverviewHeaderProps {
  isExpanded: boolean;
  jobMode: JobMode;
  workspaceStatus: string;
  title: string;
  studioTag: string;
  deliveryTag: string;
  onToggleOverview: () => void;
  onModeChange: (mode: JobMode) => void;
}

export interface OverviewMetricItem {
  key: string;
  title: string;
  value: number;
  prefix: ReactNode;
}

export interface OverviewMetricsProps {
  metrics: OverviewMetricItem[];
}

export interface OverviewDetailsProps {
  body: string;
  chips: string[];
  toggleHint: string;
  currentStep: number;
  steps: OverviewModeCopy['steps'];
}
