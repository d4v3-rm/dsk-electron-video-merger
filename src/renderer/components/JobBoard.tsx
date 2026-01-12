import { PlayCircleOutlined } from '@ant-design/icons';
import { Card, Progress, Space, Table, Tag, Typography } from 'antd';
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
import { getStatusLabel, statusColor, statusIcon, toProgressStatus } from '@renderer/utils/job-presentation';

const { Text } = Typography;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const formatFiles = (files: Job['files']) => (
  <Text>
    {files.length} file{files.length === 1 ? '' : 's'}
  </Text>
);

export const JobBoard = () => {
  const { t } = useTranslation();
  const jobs = useAppStore((state) => state.jobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const erroredJobs = jobs.filter((job) => job.status === 'error').length;

  const columns: ColumnsType<Job> = [
    {
      title: t('history.columns.merge'),
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => <Text code>{id.slice(0, 8)}</Text>,
    },
    {
      title: t('history.columns.input'),
      dataIndex: 'files',
      key: 'files',
      render: formatFiles,
      width: 110,
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
      dataIndex: 'outputPaths',
      key: 'outputPaths',
      render: (outputPaths: string[]) =>
        outputPaths[0] ? (
          <Text>{getFileName(outputPaths[0])}</Text>
        ) : (
          <Text type="secondary">{t('history.pendingOutput')}</Text>
        ),
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
            <Tag color="blue">{t('history.openDetailHint')}</Tag>
            <PlayCircleOutlined />
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="history-toolbar">
            <div>
              <Text className="panel-kicker">{t('history.cardTitle')}</Text>
              <Text type="secondary" className="history-table-note">
                {t('history.subtitle')}
              </Text>
            </div>

            <Space wrap size={[10, 10]} className="history-stat-grid">
              <div className="history-stat-pill">
                <Text strong>{runningJobs}</Text>
                <Text type="secondary">{t('history.stats.running')}</Text>
              </div>
              <div className="history-stat-pill">
                <Text strong>{completedJobs}</Text>
                <Text type="secondary">{t('history.stats.completed')}</Text>
              </div>
              <div className="history-stat-pill">
                <Text strong>{erroredJobs}</Text>
                <Text type="secondary">{t('history.stats.error')}</Text>
              </div>
            </Space>
          </div>

          <Table<Job>
            rowKey="id"
            columns={columns}
            dataSource={jobs}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            locale={{ emptyText: t('history.emptyText') }}
            scroll={{ x: 1320 }}
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
