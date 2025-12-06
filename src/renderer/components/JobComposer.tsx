import { Card, Button, Space, Radio, Select, List, Typography, Divider, Flex } from 'antd';
import { PlayCircleOutlined, DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/use-app-store';

const { Title, Text } = Typography;

export const JobComposer = () => {
  const {
    selectedFiles,
    jobType,
    settings,
    setJobType,
    setCompression,
    setOutputFormat,
    selectVideoFiles,
    removeSelectedFile,
    createJob,
    loading
  } = useAppStore();

  return (
    <Card>
      <Title level={4}>Nuovo processo</Title>
      <Divider />
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space>
          <Radio.Group value={jobType} onChange={(event) => setJobType(event.target.value)}>
            <Radio.Button value="single">Job singolo</Radio.Button>
            <Radio.Button value="bulk">Batch massivo</Radio.Button>
          </Radio.Group>
        </Space>

        <Flex justify="space-between" gap="12px" wrap>
          <Space direction="vertical">
            <Text strong>Formato output</Text>
            <Select
              value={settings.outputFormat}
              onChange={setOutputFormat}
              options={['mp4', 'mov', 'webm'].map((value) => ({
                value,
                label: value.toUpperCase()
              }))}
            />
          </Space>
          <Space direction="vertical">
            <Text strong>Compressione</Text>
            <Select
              value={settings.compression}
              onChange={setCompression}
              options={[
                { value: 'light', label: 'Leggera' },
                { value: 'balanced', label: 'Bilanciata' },
                { value: 'strong', label: 'Alta' }
              ]}
            />
          </Space>
        </Flex>

        <Space wrap>
          <Button type="primary" icon={<FileDoneOutlined />} onClick={selectVideoFiles}>
            Aggiungi file
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={loading}
            disabled={selectedFiles.length === 0}
            onClick={createJob}
          >
            Avvia {jobType === 'single' ? 'Job Singolo' : 'Batch'}
          </Button>
        </Space>

        <List
          size="small"
          bordered
          dataSource={selectedFiles}
          locale={{ emptyText: 'Nessun file selezionato' }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeSelectedFile(item.id)}
                />
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
};
