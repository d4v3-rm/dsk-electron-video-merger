import { RadarChartOutlined } from '@ant-design/icons';
import { Card, Space, Tag, Timeline, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { getJobLogColor, historyDateFormatter } from '@renderer/components/job-history/job-history.utils';
import { getLogStageLabel } from '@renderer/utils/job-presentation';

const { Text } = Typography;

interface JobDetailsLogsCardProps {
  job: Job;
}

export const JobDetailsLogsCard = ({ job }: JobDetailsLogsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card title={t('details.logTitle')} extra={<RadarChartOutlined />}>
      <Timeline
        items={job.logs.map((log) => ({
          color: getJobLogColor(log),
          children: (
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space wrap>
                <Tag bordered={false}>{getLogStageLabel(log.stage)}</Tag>
                {log.progress !== undefined ? <Tag color="blue">{log.progress}%</Tag> : null}
                <Text type="secondary">{historyDateFormatter.format(log.timestamp)}</Text>
              </Space>
              <Text>{log.message}</Text>
            </Space>
          ),
        }))}
        pending={job.status === 'running' ? t('details.logPending') : undefined}
      />
    </Card>
  );
};
