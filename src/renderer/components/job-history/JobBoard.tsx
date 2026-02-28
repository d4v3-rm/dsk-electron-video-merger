import {
  CheckCircleOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Card, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { JobBoardSummary } from '@renderer/components/job-history/JobBoardSummary';
import { JobDetailsDrawer } from '@renderer/components/job-history/JobDetailsDrawer';
import { buildJobBoardColumns } from '@renderer/components/job-history/job-board.columns';
import type { JobHistoryMetric } from '@renderer/components/job-history/job-history.types';
import { useAppStore } from '@renderer/store/use-app-store';
import { fullHeightCardStyle } from '@renderer/theme/component-styles';

export const JobBoard = () => {
  const { t } = useTranslation();
  const jobs = useAppStore((state) => state.jobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );
  const columns = useMemo(() => buildJobBoardColumns(t), [t]);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const failedJobs = jobs.filter((job) => job.status === 'error').length;

  const historyMetrics: JobHistoryMetric[] = [
    {
      key: 'total',
      title: t('history.metrics.total'),
      value: jobs.length,
      prefix: <OrderedListOutlined />,
    },
    {
      key: 'queued',
      title: t('history.metrics.queued'),
      value: queuedJobs,
      prefix: <PlayCircleOutlined />,
    },
    {
      key: 'running',
      title: t('history.metrics.running'),
      value: runningJobs,
      prefix: <SyncOutlined />,
    },
    {
      key: 'completed',
      title: t('history.metrics.completed'),
      value: completedJobs,
      prefix: failedJobs > 0 ? <WarningOutlined /> : <CheckCircleOutlined />,
    },
  ];

  return (
    <>
      <Card
        style={fullHeightCardStyle}
        title={t('history.cardTitle')}
        extra={
          <Space>
            <Tag>{t('history.jobsCount', { count: jobs.length })}</Tag>
            {failedJobs > 0 ? (
              <Tag color="error">{t('history.failedCount', { count: failedJobs })}</Tag>
            ) : null}
            <Tag color="blue">{t('history.openDetailHint')}</Tag>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <JobBoardSummary metrics={historyMetrics} />

          <Table<Job>
            rowKey="id"
            columns={columns}
            dataSource={jobs}
            size="middle"
            pagination={{ pageSize: 8, showSizeChanger: false, position: ['bottomRight'] }}
            locale={{ emptyText: t('history.emptyText') }}
            scroll={{ x: 1440 }}
            onRow={(job) => ({
              onClick: () => setSelectedJobId(job.id),
            })}
          />
        </Space>
      </Card>

      <JobDetailsDrawer
        job={selectedJob}
        open={Boolean(selectedJob)}
        onClose={() => setSelectedJobId(null)}
      />
    </>
  );
};
