import { randomUUID } from 'node:crypto';
import type { JobLogEntry, JobLogLevel, JobLogStage } from '@shared/types';

export const createJobLogEntry = (
  stage: JobLogStage,
  level: JobLogLevel,
  message: string,
  progress?: number,
): JobLogEntry => ({
  id: randomUUID(),
  timestamp: Date.now(),
  stage,
  level,
  message,
  progress,
});

export const appendJobLog = (
  logs: JobLogEntry[],
  nextLog: JobLogEntry,
  maxEntries: number,
): JobLogEntry[] => {
  if (logs.some((entry) => entry.id === nextLog.id)) {
    return logs;
  }

  return [...logs, nextLog].slice(-maxEntries);
};
