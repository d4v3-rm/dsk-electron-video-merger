import { PlayCircleOutlined } from '@ant-design/icons';
import { Card, Progress, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import type { Job } from '@shared/types';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  requestedEncoderBackendLabel,
  resolvedEncoderBackendLabel,
} from '@renderer/utils/encoder-presentation';
import { getFileName } from '@renderer/utils/file-utils';
import { statusColor, statusIcon, statusLabel, toProgressStatus } from '@renderer/utils/job-presentation';
import { JobDetailsDrawer } from '@renderer/components/JobDetailsDrawer';

const { Text } = Typography;

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const formatFiles = (files: Job['files']) => (
  <Text>
    {files.length} file{files.length === 1 ? '' : 's'}
  </Text>
);

export const JobBoard = () => {
  const jobs = useAppStore((state) => state.jobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const columns: ColumnsType<Job> = [
    {
      title: 'Merge',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => <Text code>{id.slice(0, 8)}</Text>,
    },
    {
      title: 'Input',
      dataIndex: 'files',
      key: 'files',
      render: formatFiles,
      width: 110,
    },
    {
      title: 'Profilo',
      key: 'settings',
      render: (_, job) => (
        <Space direction="vertical" size={0}>
          <Text>
            {job.settings.outputFormat.toUpperCase()} - {job.settings.compression}
          </Text>
          <Text type="secondary">
            {requestedEncoderBackendLabel[job.settings.encoderBackend]}
            {job.resolvedEncoderBackend
              ? ` -> ${resolvedEncoderBackendLabel[job.resolvedEncoderBackend]}`
              : ''}
          </Text>
        </Space>
      ),
      width: 210,
    },
    {
      title: 'Stato',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (status: Job['status']) => (
        <Tag icon={statusIcon[status]} color={statusColor[status]}>
          {statusLabel[status]}
        </Tag>
      ),
    },
    {
      title: 'Output',
      dataIndex: 'outputPaths',
      key: 'outputPaths',
      render: (outputPaths: string[]) =>
        outputPaths[0] ? <Text>{getFileName(outputPaths[0])}</Text> : <Text type="secondary">In attesa</Text>,
    },
    {
      title: 'Avanzamento',
      key: 'progress',
      width: 230,
      render: (_, job) => (
        <Space direction="vertical" size={1} style={{ width: '100%' }}>
          <Progress
            percent={job.progress}
            size="small"
            status={toProgressStatus(job.status)}
            showInfo={false}
          />
          <Text type="secondary">{job.message || 'In attesa aggiornamenti...'}</Text>
        </Space>
      ),
    },
    {
      title: 'Aggiornato',
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
        title="Cronologia merge"
        extra={
          <Space>
            <Tag color="blue">Apri il dettaglio con un click</Tag>
            <PlayCircleOutlined />
          </Space>
        }
      >
        <Table<Job>
          rowKey="id"
          columns={columns}
          dataSource={jobs}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: 'Nessun merge in coda' }}
          scroll={{ x: 1120 }}
          rowClassName="history-row"
          onRow={(job) => ({
            onClick: () => setSelectedJobId(job.id),
          })}
        />
      </Card>

      <JobDetailsDrawer
        job={selectedJob}
        open={Boolean(selectedJob)}
        onClose={() => setSelectedJobId(null)}
      />
    </>
  );
};
