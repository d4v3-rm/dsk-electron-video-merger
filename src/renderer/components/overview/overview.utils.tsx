import {
  CompressOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import type { TFunction } from 'i18next';
import type { Job, JobMode } from '@shared/types';
import type { OverviewMetricItem, OverviewModeCopy } from '@renderer/components/overview/overview.types';
import { getJobModeLabel } from '@renderer/utils/job-presentation';

export const getCurrentOverviewStep = (
  selectedFilesCount: number,
  runningJobsCount: number,
  completedJobsCount: number,
): number => {
  if (runningJobsCount > 0) {
    return 1;
  }

  if (completedJobsCount > 0 && selectedFilesCount === 0) {
    return 2;
  }

  return 0;
};

export const getOverviewWorkspaceStatus = (
  t: TFunction,
  runningJobsCount: number,
  selectedFilesCount: number,
  activeMode: JobMode,
  selectedMode: JobMode,
): string => {
  if (runningJobsCount > 0) {
    return t('overview.status.running', { mode: getJobModeLabel(activeMode) });
  }

  if (selectedFilesCount > 0) {
    return t('overview.status.ready', { mode: getJobModeLabel(selectedMode) });
  }

  return t('overview.status.idle');
};

export const getOverviewMetrics = (
  t: TFunction,
  modeCopy: OverviewModeCopy,
  selectedFilesCount: number,
  queuedJobsCount: number,
  runningJobsCount: number,
  completedJobsCount: number,
): OverviewMetricItem[] => [
  {
    key: 'clips',
    title: modeCopy.firstMetricTitle,
    value: selectedFilesCount,
    prefix: <VideoCameraOutlined />,
  },
  {
    key: 'queued',
    title: t('overview.metrics.queued'),
    value: queuedJobsCount,
    prefix: <ProfileOutlined />,
  },
  {
    key: 'running',
    title: t('overview.metrics.running'),
    value: runningJobsCount,
    prefix: <CompressOutlined />,
  },
  {
    key: 'completed',
    title: t('overview.metrics.completed'),
    value: completedJobsCount,
    prefix: <PlayCircleOutlined />,
  },
];

export const getActiveOverviewJob = (jobs: Job[]): Job | null =>
  jobs.find((job) => job.status === 'running') ?? jobs.find((job) => job.status === 'queued') ?? null;
