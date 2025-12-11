import { Card, List, Progress, Tag, type TagProps, Typography } from 'antd';
import type { Job } from '../../shared/types';
import { useAppStore } from '../store/use-app-store';

const { Title, Text } = Typography;

const statusLabel: Record<Job['status'], string> = {
  queued: 'In coda',
  running: 'In corso',
  completed: 'Completato',
  error: 'Errore',
};

const statusColor: Record<Job['status'], TagProps['color']> = {
  queued: 'default',
  running: 'processing',
  completed: 'success',
  error: 'error',
};

export const JobBoard = () => {
  const jobs = useAppStore((state) => state.jobs);

  return (
    <Card>
      <Title level={4}>Coda e cronologia</Title>
      <List
        itemLayout="vertical"
        dataSource={jobs}
        locale={{ emptyText: 'Nessun job ancora' }}
        renderItem={(job) => (
          <List.Item key={job.id}>
            <List.Item.Meta
              title={
                <div className="job-title">
                  <span>{`[#${job.id.slice(0, 8)}] ${job.type === 'single' ? 'Singolo' : 'Massivo'}`}</span>
                  <Tag color={statusColor[job.status]}>{statusLabel[job.status]}</Tag>
                </div>
              }
              description={
                <Text type="secondary">
                  Formato {job.settings.outputFormat.toUpperCase()} · Compressione {job.settings.compression}
                </Text>
              }
            />
            <Progress percent={job.progress} status={job.status === 'error' ? 'exception' : 'active'} />
            <Text type="secondary">{job.message}</Text>
            {job.outputPaths.length > 0 && <Text italic>{job.outputPaths.join(' ')}</Text>}
          </List.Item>
        )}
      />
    </Card>
  );
};
