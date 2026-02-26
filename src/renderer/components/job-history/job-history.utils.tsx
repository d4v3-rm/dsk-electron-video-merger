import { Typography } from 'antd';
import type { TFunction } from 'i18next';
import type { Job, JobLogEntry } from '@shared/types';
import { getFileName } from '@renderer/utils/file-utils';

const { Text } = Typography;

export const historyDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const getJobLogColor = (log: JobLogEntry): 'blue' | 'red' | 'orange' => {
  if (log.level === 'error') {
    return 'red';
  }

  if (log.level === 'warning') {
    return 'orange';
  }

  return 'blue';
};

export const summarizeJobOutputs = (job: Job, t: TFunction) => {
  if (job.outputPaths.length === 0) {
    return <Text type="secondary">{t('history.pendingOutput')}</Text>;
  }

  const firstOutputName = getFileName(job.outputPaths[0]);
  if (job.outputPaths.length === 1) {
    return <Text>{firstOutputName}</Text>;
  }

  return (
    <Text>{t('history.outputSummary', { name: firstOutputName, count: job.outputPaths.length - 1 })}</Text>
  );
};
