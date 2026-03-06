import { Card, Progress, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { historyDateFormatter } from '@renderer/components/job-history/job-history.utils';
import { getResolvedEncoderBackendLabel } from '@renderer/utils/encoder-presentation';
import {
  getJobModeLabel,
  getStatusLabel,
  statusColor,
  toProgressStatus,
} from '@renderer/utils/job-presentation';

const { Text } = Typography;

interface JobDetailsStatusCardProps {
  job: Job;
}

export const JobDetailsStatusCard = ({ job }: JobDetailsStatusCardProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space align="center" wrap>
          <Tag color={statusColor[job.status]}>{getStatusLabel(job.status)}</Tag>
          <Tag bordered={false}>{getJobModeLabel(job.mode)}</Tag>
          {job.resolvedEncoderBackend ? (
            <Tag bordered={false} color="blue">
              {getResolvedEncoderBackendLabel(job.resolvedEncoderBackend)}
            </Tag>
          ) : null}
          <Text type="secondary">
            {t('details.updatedAt', { value: historyDateFormatter.format(job.updatedAt) })}
          </Text>
        </Space>

        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Text strong>{t('details.progressTitle')}</Text>
          <Progress percent={job.progress} status={toProgressStatus(job.status)} />
          <Text type="secondary">{job.message}</Text>
        </Space>
      </Space>
    </Card>
  );
};
