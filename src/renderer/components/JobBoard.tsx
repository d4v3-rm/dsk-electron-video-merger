import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Card, Progress, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ReactNode } from 'react';
import type { Job } from '@shared/types';
import { useAppStore } from '../store/use-app-store';

const { Text } = Typography;

const statusLabel: Record<Job['status'], string> = {
  queued: 'In coda',
  running: 'In corso',
  completed: 'Completato',
  error: 'Errore',
};

const statusColor: Record<Job['status'], string> = {
  queued: 'default',
  running: 'processing',
  completed: 'success',
  error: 'error',
};

const statusIcon: Record<Job['status'], ReactNode> = {
  queued: <ClockCircleOutlined />,
  running: <LoadingOutlined />,
  completed: <CheckCircleOutlined />,
  error: <ExclamationCircleOutlined />,
};

const toProgressStatus = (status: Job['status']): 'active' | 'success' | 'exception' | 'normal' => {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'error') {
    return 'exception';
  }

  if (status === 'running') {
    return 'active';
  }

  return 'normal';
};

const toFormatLabel = (format: Job['settings']['outputFormat']) => format.toUpperCase();

const formatFiles = (files: Job['files']) => (
  <Text>
    {files.length} file{files.length === 1 ? '' : 's'}
  </Text>
);

const getFileName = (filePath: string): string => {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.split('/').at(-1) ?? filePath;
};

export const JobBoard = () => {
  const jobs = useAppStore((state) => state.jobs);

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
      title: 'Profilo output',
      key: 'settings',
      render: (_, job) => (
        <Space direction="vertical" size={0}>
          <Text>
            {toFormatLabel(job.settings.outputFormat)} - {job.settings.compression}
          </Text>
          <Text type="secondary">Un solo file finale</Text>
        </Space>
      ),
      width: 180,
    },
    {
      title: 'File generato',
      dataIndex: 'outputPaths',
      key: 'outputPaths',
      render: (outputPaths: string[]) => {
        if (outputPaths.length === 0) {
          return <Text type="secondary">In generazione</Text>;
        }

        return <Text>{getFileName(outputPaths[0])}</Text>;
      },
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
      title: 'Avanzamento',
      key: 'progress',
      width: 220,
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
  ];

  return (
    <Card className="modern-card" title="Cronologia merge" extra={<PlayCircleOutlined />}>
      <Table<Job>
        rowKey="id"
        columns={columns}
        dataSource={jobs}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        locale={{ emptyText: 'Nessun merge in coda' }}
        scroll={{ x: 1080 }}
      />
    </Card>
  );
};
