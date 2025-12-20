import { ClockCircleOutlined, FileDoneOutlined, LinkOutlined } from '@ant-design/icons';
import { Card, Descriptions, Divider, Empty, List, Progress, Space, Tag, Typography } from 'antd';
import { useAppStore } from '../store/use-app-store';
import { buildMergedOutputName, formatBytes } from '../utils/file-utils';
import { statusColor, statusLabel, toProgressStatus } from '../utils/job-presentation';

const { Text, Paragraph } = Typography;

export const MergePreviewCard = () => {
  const selectedFiles = useAppStore((state) => state.selectedFiles);
  const settings = useAppStore((state) => state.settings);
  const jobs = useAppStore((state) => state.jobs);

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const activeJob =
    jobs.find((job) => job.status === 'running') ?? jobs.find((job) => job.status === 'queued') ?? null;
  const latestCompletedJob =
    jobs.find((job) => job.status === 'completed' && job.outputPaths.length > 0) ?? null;

  const previewName = buildMergedOutputName(selectedFiles[0]?.name, settings.outputFormat);
  const previewStatus =
    activeJob?.status === 'running'
      ? 'Merge attivo'
      : activeJob?.status === 'queued'
        ? 'In coda'
        : selectedFiles.length > 0
          ? 'Pronto al lancio'
          : 'In attesa';

  return (
    <Card
      className="modern-card preview-card"
      title="Output plan"
      extra={<Tag color={activeJob ? 'processing' : 'default'}>{previewStatus}</Tag>}
    >
      {selectedFiles.length === 0 && !activeJob && !latestCompletedJob ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Seleziona dei clip per vedere il piano di merge."
        />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions
            column={2}
            size="small"
            items={[
              {
                key: 'name',
                label: 'Nome output',
                children: (
                  <Text strong className="preview-output-name">
                    {previewName}
                  </Text>
                ),
              },
              {
                key: 'clips',
                label: 'Clip in ingresso',
                children: selectedFiles.length || activeJob?.files.length || 0,
              },
              {
                key: 'format',
                label: 'Formato',
                children: settings.outputFormat.toUpperCase(),
              },
              {
                key: 'compression',
                label: 'Compressione',
                children: settings.compression,
              },
              {
                key: 'size',
                label: 'Peso staging',
                children: selectedFiles.length > 0 ? formatBytes(totalSize) : 'N/D',
              },
              {
                key: 'delivery',
                label: 'Consegna',
                children: 'Un singolo file finale',
              },
            ]}
          />

          {activeJob ? (
            <div className="preview-runtime">
              <Space align="center">
                <Tag color={statusColor[activeJob.status]}>{statusLabel[activeJob.status]}</Tag>
                <Text type="secondary">{activeJob.message}</Text>
              </Space>
              <Progress
                percent={activeJob.progress}
                status={toProgressStatus(activeJob.status)}
                showInfo={false}
              />
            </div>
          ) : null}

          {selectedFiles.length > 0 ? (
            <>
              <Divider style={{ margin: 0 }} />
              <div>
                <Space align="center">
                  <ClockCircleOutlined />
                  <Text strong>Ordine clip corrente</Text>
                </Space>
                <List
                  className="preview-list"
                  size="small"
                  dataSource={selectedFiles.slice(0, 4)}
                  renderItem={(file, index) => (
                    <List.Item>
                      <Space size="middle">
                        <Tag bordered={false}>{index + 1}</Tag>
                        <Text>{file.name}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
                {selectedFiles.length > 4 ? (
                  <Text type="secondary">+ {selectedFiles.length - 4} clip aggiuntivi in coda.</Text>
                ) : null}
              </div>
            </>
          ) : null}

          {latestCompletedJob?.outputPaths[0] ? (
            <>
              <Divider style={{ margin: 0 }} />
              <div>
                <Space align="center">
                  <FileDoneOutlined />
                  <Text strong>Ultimo output generato</Text>
                </Space>
                <Paragraph
                  className="preview-path"
                  copyable={{ text: latestCompletedJob.outputPaths[0] }}
                  ellipsis={{ tooltip: latestCompletedJob.outputPaths[0] }}
                >
                  <LinkOutlined /> {latestCompletedJob.outputPaths[0]}
                </Paragraph>
              </div>
            </>
          ) : null}
        </Space>
      )}
    </Card>
  );
};
