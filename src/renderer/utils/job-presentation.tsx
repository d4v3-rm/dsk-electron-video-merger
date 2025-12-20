import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import type { Job } from '@shared/types';

export const statusLabel: Record<Job['status'], string> = {
  queued: 'In coda',
  running: 'In corso',
  completed: 'Completato',
  error: 'Errore',
};

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
