import { Alert, Button, Card, Divider, Flex, Form, List, Select, Segmented, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, PlayCircleOutlined, UploadOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useAppStore } from '../store/use-app-store';

const { Text, Paragraph, Title } = Typography;

const formatBytes = (size: number): string => {
  const kilo = 1024;
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let current = size;

  while (current >= kilo && index < units.length - 1) {
    current /= kilo;
    index += 1;
  }

  return `${current.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export const JobComposer = () => {
  const {
    selectedFiles,
    jobType,
    settings,
    loading,
    setJobType,
    setCompression,
    setOutputFormat,
    selectVideoFiles,
    removeSelectedFile,
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
      title="Nuovo processo"
      className="modern-card"
      extra={<Tag color={jobType === 'bulk' ? 'processing' : 'default'}>{jobType === 'bulk' ? 'Batch' : 'Singolo'}</Tag>}
    >
      <Title level={5}>1. Carica file e configura il job</Title>
      <Text type="secondary">Seleziona i video e scegli una modalità di lavoro.</Text>

      <Divider style={{ marginTop: 16, marginBottom: 16 }} />

      <Form layout="vertical">
        <Form.Item label="Modalità di elaborazione">
          <Segmented
            block
            value={jobType}
            onChange={setJobType}
            options={[
              { value: 'single', label: 'Job singolo' },
              { value: 'bulk', label: 'Batch massivo' },
            ]}
          />
        </Form.Item>

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
        <Button
          icon={<UploadOutlined />}
          onClick={selectVideoFiles}
          size="large"
          style={{ minWidth: 180 }}
        >
          Seleziona file
        </Button>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          loading={loading}
          disabled={selectedFiles.length === 0}
          size="large"
          style={{ minWidth: 170 }}
          onClick={createJob}
        >
          Avvia {jobType === 'single' ? 'job singolo' : 'batch'}
        </Button>
      </Space>

      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <Flex align="center" justify="space-between" gap="small" className="composer-summary">
        <Space size="middle">
          <Text strong>{selectedStats.totalFiles} file</Text>
          <Text type="secondary">{selectedStats.totalSize}</Text>
        </Space>
        {selectedFiles.length > 0 ? <Tag icon={<VideoCameraAddOutlined />}>Pronti</Tag> : <Tag>Seleziona file per iniziare</Tag>}
      </Flex>

      {selectedFiles.length === 0 ? (
        <Alert
          type="info"
          showIcon
          message="Nessun file selezionato"
          description="Aggiungi almeno un video prima di avviare un processo."
        />
      ) : (
        <List
          dataSource={selectedFiles}
          header={<Text type="secondary">File selezionati</Text>}
          bordered
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeSelectedFile(item.id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={<Text ellipsis={{ tooltip: item.name }}>{item.name}</Text>}
                description={
                  <Flex vertical>
                    <Paragraph className="selected-file-path" ellipsis={{ tooltip: item.path }}>
                      {item.path}
                    </Paragraph>
                    <Text type="secondary" className="selected-file-size">
                      {formatBytes(item.size)}
                    </Text>
                  </Flex>
                }
              />
            </List.Item>
          )}
        />
      )}

      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <Space size="middle" split={<Divider type="vertical" />}>
        <Text type="secondary">Formato: {settings.outputFormat.toUpperCase()}</Text>
        <Text type="secondary">Compressione: {settings.compression}</Text>
        <Text type="secondary">Stato: {selectedFiles.length > 0 ? 'Pronti' : 'In attesa'}</Text>
      </Space>
    </Card>
  );
};
