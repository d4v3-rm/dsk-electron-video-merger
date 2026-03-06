import type { ReactNode } from 'react';

export interface JobHistoryMetric {
  key: string;
  title: string;
  value: number;
  prefix: ReactNode;
}
