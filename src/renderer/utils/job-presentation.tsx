import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import type { Job } from '@shared/types';
import i18n from '@renderer/i18n';

export const getStatusLabel = (status: Job['status']): string => i18n.t(`status.${status}`);

export const getJobModeLabel = (mode: Job['mode']): string => i18n.t(`modes.${mode}`);

export const getLogStageLabel = (stage: 'queue' | 'prepare' | 'encode' | 'finalize' | 'system'): string =>
  i18n.t(`logs.${stage}`);

export const statusColor: Record<Job['status'], string> = {
  queued: 'default',
  running: 'processing',
  completed: 'success',
  error: 'error',
};

export const statusIcon: Record<Job['status'], ReactNode> = {
  queued: <ClockCircleOutlined />,
  running: <LoadingOutlined />,
  completed: <CheckCircleOutlined />,
  error: <ExclamationCircleOutlined />,
};

export const toProgressStatus = (status: Job['status']): 'active' | 'success' | 'exception' | 'normal' => {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'error') {
    return 'exception';
  }

  if (status === 'running') {
    return 'active';
  }

  return 'normal';
};
