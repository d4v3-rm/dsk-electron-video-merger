import {
  CheckCircleOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Card, Progress, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { JobDetailsDrawer } from '@renderer/components/JobDetailsDrawer';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  getCompressionPresetTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
} from '@renderer/utils/encoder-presentation';
import { getFileName } from '@renderer/utils/file-utils';
import {
  getJobModeLabel,
  getStatusLabel,
  statusColor,
  statusIcon,
  toProgressStatus,
} from '@renderer/utils/job-presentation';

const { Text } = Typography;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const summarizeOutputs = (job: Job, t: (key: string, options?: Record<string, unknown>) => string) => {
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

export const JobBoard = () => {
  const { t } = useTranslation();
  const jobs = useAppStore((state) => state.jobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const failedJobs = jobs.filter((job) => job.status === 'error').length;

  const historySummary = [
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

  const columns: ColumnsType<Job> = [
    {
      title: t('history.columns.job'),
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => <Text code>{id.slice(0, 8)}</Text>,
    },
    {
      title: t('history.columns.mode'),
      dataIndex: 'mode',
      key: 'mode',
      width: 140,
      render: (mode: Job['mode']) => <Tag bordered={false}>{getJobModeLabel(mode)}</Tag>,
    },
    {
      title: t('history.columns.input'),
      dataIndex: 'files',
      key: 'files',
      render: (files: Job['files']) => (
        <Text>
          {t('history.inputSummary', { count: files.length, suffix: files.length === 1 ? '' : 's' })}
        </Text>
      ),
      width: 130,
    },
    {
      title: t('history.columns.profile'),
      key: 'settings',
      render: (_, job) => (
        <Space direction="vertical" size={0}>
          <Text>
            {job.settings.outputFormat.toUpperCase()} -{' '}
            {getCompressionPresetTechnicalLabel(job.settings.compression)}
          </Text>
          <Text type="secondary">
            {getRequestedEncoderBackendLabel(job.settings.encoderBackend)}
            {job.resolvedEncoderBackend
              ? ` -> ${getResolvedEncoderBackendLabel(job.resolvedEncoderBackend)}`
              : ''}
          </Text>
        </Space>
      ),
      width: 320,
    },
    {
      title: t('history.columns.status'),
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (status: Job['status']) => (
        <Tag icon={statusIcon[status]} color={statusColor[status]}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: t('history.columns.output'),
      key: 'outputPaths',
      render: (_, job) => summarizeOutputs(job, t),
      width: 260,
    },
    {
      title: t('history.columns.progress'),
      key: 'progress',
      width: 260,
      render: (_, job) => (
        <Space direction="vertical" size={1} style={{ width: '100%' }}>
          <Progress percent={job.progress} size="small" status={toProgressStatus(job.status)} />
          <Text type="secondary">{job.message || t('common.waiting')}</Text>
        </Space>
      ),
    },
    {
      title: t('history.columns.updated'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: (updatedAt: number) => <Text type="secondary">{dateFormatter.format(updatedAt)}</Text>,
    },
  ];

  return (
    <>
      <Card
        className="modern-card history-card"
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
          <div className="history-summary-grid">
            {historySummary.map((item) => (
              <div key={item.key} className="history-stat-tile">
                <Statistic title={item.title} value={item.value} prefix={item.prefix} />
              </div>
            ))}
          </div>

          <Table<Job>
            rowKey="id"
            columns={columns}
            dataSource={jobs}
            size="middle"
            pagination={{ pageSize: 8, showSizeChanger: false, position: ['bottomRight'] }}
            locale={{ emptyText: t('history.emptyText') }}
            scroll={{ x: 1440 }}
            rowClassName="history-row"
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
