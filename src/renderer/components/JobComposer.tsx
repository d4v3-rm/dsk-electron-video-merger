import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClearOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  UploadOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  List,
  Select,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useMemo } from 'react';
import { useAppStore } from '../store/use-app-store';
import { formatBytes } from '../utils/file-utils';

const { Text, Paragraph, Title } = Typography;

export const JobComposer = () => {
  const {
    selectedFiles,
    settings,
    loading,
    setCompression,
    setOutputFormat,
    selectVideoFiles,
    clearSelectedFiles,
    removeSelectedFile,
    moveSelectedFile,
    createJob,
  } = useAppStore();

  const selectedStats = useMemo(() => {
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

    return {
      totalFiles: selectedFiles.length,
      totalSize: formatBytes(totalSize),
    };
  }, [selectedFiles]);

  return (
    <Card
      title="Merge setup"
      className="modern-card queue-card"
      extra={<Tag color={selectedFiles.length > 1 ? 'processing' : 'default'}>Queue ordinata</Tag>}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} className="section-title">
            Costruisci il merge finale
          </Title>
          <Text type="secondary">
            Definisci l&apos;ordine dei clip, scegli il profilo di esportazione e lancia il master.
          </Text>
        </div>

        <Alert type="info" showIcon message="L'ordine della lista e` l'ordine reale del video finale." />

        <div className="queue-stats">
          <div className="queue-stat-tile">
            <Statistic title="Clip" value={selectedStats.totalFiles} prefix={<VideoCameraAddOutlined />} />
          </div>
          <div className="queue-stat-tile">
            <Statistic title="Peso staging" value={selectedStats.totalSize} />
          </div>
        </div>

        <Form layout="vertical">
          <Form.Item label="Formato in uscita">
            <Select
              value={settings.outputFormat}
              onChange={setOutputFormat}
              options={['mp4', 'mov', 'webm'].map((value) => ({
                value,
                label: value.toUpperCase(),
              }))}
            />
          </Form.Item>

          <Form.Item label="Compressione">
            <Select
              value={settings.compression}
              onChange={setCompression}
              options={[
                { value: 'light', label: 'Leggera' },
                { value: 'balanced', label: 'Bilanciata' },
                { value: 'strong', label: 'Alta compressione' },
              ]}
            />
          </Form.Item>
        </Form>

        <Space size="middle" wrap>
          <Button icon={<UploadOutlined />} onClick={selectVideoFiles} size="large">
            Aggiungi clip
          </Button>
          <Button
            icon={<ClearOutlined />}
            danger
            onClick={clearSelectedFiles}
            disabled={selectedFiles.length === 0}
            size="large"
          >
            Svuota queue
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={loading}
            disabled={selectedFiles.length === 0}
            size="large"
            onClick={createJob}
          >
            Avvia merge
          </Button>
        </Space>

        <Divider style={{ margin: 0 }} />

        {selectedFiles.length === 0 ? (
          <Alert
            type="warning"
            showIcon
            message="Nessun clip in queue"
            description="Aggiungi i video da concatenare. Potrai riordinarli prima di esportare."
          />
        ) : (
          <List
            className="queue-list"
            dataSource={selectedFiles}
            renderItem={(item, index) => {
              const isFirst = index === 0;
              const isLast = index === selectedFiles.length - 1;

              return (
                <List.Item
                  className="queue-item"
                  actions={[
                    <Space key="controls" size="small">
                      <Tooltip title="Sposta in alto">
                        <Button
                          size="small"
                          icon={<ArrowUpOutlined />}
                          disabled={isFirst}
                          onClick={() => moveSelectedFile(item.id, 'up')}
                        />
                      </Tooltip>
                      <Tooltip title="Sposta in basso">
                        <Button
                          size="small"
                          icon={<ArrowDownOutlined />}
                          disabled={isLast}
                          onClick={() => moveSelectedFile(item.id, 'down')}
                        />
                      </Tooltip>
                      <Tooltip title="Rimuovi clip">
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeSelectedFile(item.id)}
                        />
                      </Tooltip>
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<div className="queue-index">{index + 1}</div>}
                    title={
                      <Space wrap>
                        <Text strong>{item.name}</Text>
                        {isFirst ? <Tag color="cyan">Inizio</Tag> : null}
                        {isLast ? <Tag color="geekblue">Finale</Tag> : null}
                      </Space>
                    }
                    description={
                      <Flex vertical gap={4}>
                        <Paragraph className="selected-file-path" ellipsis={{ tooltip: item.path }}>
                          {item.path}
                        </Paragraph>
                        <Space size="middle">
                          <Text type="secondary">{formatBytes(item.size)}</Text>
                          <Text type="secondary">
                            {isFirst ? 'Apre il merge' : isLast ? 'Chiude il merge' : 'Clip intermedia'}
                          </Text>
                        </Space>
                      </Flex>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Space>
    </Card>
  );
};
