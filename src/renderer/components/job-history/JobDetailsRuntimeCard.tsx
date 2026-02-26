import { Card, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { formatDurationMs, formatSpeed } from '@renderer/utils/runtime-presentation';

interface JobDetailsRuntimeCardProps {
  job: Job;
}

export const JobDetailsRuntimeCard = ({ job }: JobDetailsRuntimeCardProps) => {
  const { t } = useTranslation();

  return (
    <Card title={t('details.runtimeTitle')}>
      <Descriptions
        column={2}
        size="small"
        items={[
          {
            key: 'processedDuration',
            label: t('details.labels.processedDuration'),
            children: formatDurationMs(job.telemetry?.processedDurationMs),
          },
          {
            key: 'totalDuration',
            label: t('details.labels.totalDuration'),
            children: formatDurationMs(job.telemetry?.totalDurationMs),
          },
          {
            key: 'fps',
            label: t('details.labels.fps'),
            children: job.telemetry?.fps ? `${job.telemetry.fps.toFixed(1)} fps` : t('common.notAvailable'),
          },
          {
            key: 'speed',
            label: t('details.labels.speed'),
            children: formatSpeed(job.telemetry?.speed),
          },
          {
            key: 'bitrate',
            label: t('details.labels.bitrate'),
            children: job.telemetry?.bitrate ?? t('common.notAvailable'),
          },
        ]}
      />
    </Card>
  );
};
