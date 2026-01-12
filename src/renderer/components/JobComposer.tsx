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
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Form,
  List,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CodecGuideModal } from '@renderer/components/CodecGuideModal';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  getCompressionPresetTechnicalLabel,
  getEncoderModeDescription,
  getRequestedEncoderBackendLabel,
  isNvidiaSupportedOutputFormat,
} from '@renderer/utils/encoder-presentation';
import { buildMergedOutputName, formatBytes } from '@renderer/utils/file-utils';

const { Text, Paragraph, Title } = Typography;

export const JobComposer = () => {
  const { t } = useTranslation();
  const {
    selectedFiles,
    hardwareAccelerationProfile,
    hardwareAccelerationLoaded,
    settings,
    loading,
    setCompression,
    setEncoderBackend,
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

  const nvidiaAvailable = hardwareAccelerationProfile.nvidia.available;
  const nvidiaSupportedForFormat = isNvidiaSupportedOutputFormat(settings.outputFormat);
  const encoderModeDescription = getEncoderModeDescription(
    settings.outputFormat,
    settings.encoderBackend,
    hardwareAccelerationProfile,
  );
  const hardwareAlertType = !hardwareAccelerationLoaded
    ? 'info'
    : nvidiaAvailable && nvidiaSupportedForFormat
      ? 'success'
      : settings.outputFormat === 'webm'
        ? 'warning'
        : 'info';
  const plannedOutputName = buildMergedOutputName(selectedFiles[0]?.name, settings.outputFormat);

  return (
    <Card
      title={t('composer.cardTitle')}
      className="modern-card composer-card"
      extra={
        <Space size="small" wrap>
          <Tag color={selectedFiles.length > 1 ? 'processing' : 'default'}>
            {t('composer.tags.orderedQueue')}
          </Tag>
          <Tag color={nvidiaAvailable ? 'success' : 'default'}>
            {nvidiaAvailable ? t('composer.tags.nvidiaAvailable') : t('composer.tags.cpuOnly')}
          </Tag>
          <CodecGuideModal />
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="composer-header">
          <Text className="panel-kicker">{t('composer.cardTitle')}</Text>
          <Title level={4} className="section-heading section-title">
            {t('composer.title')}
          </Title>
          <Text type="secondary">{t('composer.subtitle')}</Text>
        </div>

        <div className="composer-summary-grid">
          <div className="data-tile">
            <Text className="data-tile-label">{t('composer.stats.clips')}</Text>
            <Text className="data-tile-value">{selectedStats.totalFiles}</Text>
            <Text type="secondary" className="data-tile-meta">
              <VideoCameraAddOutlined /> {t('composer.manifestSubtitle')}
            </Text>
          </div>
          <div className="data-tile">
            <Text className="data-tile-label">{t('composer.stats.stagingSize')}</Text>
            <Text className="data-tile-value">{selectedStats.totalSize}</Text>
            <Text type="secondary" className="data-tile-meta">
              {settings.outputFormat.toUpperCase()} container lane
            </Text>
          </div>
          <div className="data-tile">
            <Text className="data-tile-label">{t('composer.summaryOutputName')}</Text>
            <Text className="data-tile-value data-tile-code">{plannedOutputName}</Text>
            <Text type="secondary" className="data-tile-meta">
              {getRequestedEncoderBackendLabel(settings.encoderBackend)}
            </Text>
          </div>
        </div>

        <Alert type="info" showIcon message={t('composer.orderInfo')} />

        <div className="composer-signal">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text className="panel-kicker">{t('composer.summaryTitle')}</Text>
            <Descriptions
              column={1}
              size="small"
              items={[
                {
                  key: 'outputName',
                  label: t('composer.summaryOutputName'),
                  children: plannedOutputName,
                },
                {
                  key: 'container',
                  label: t('composer.summaryContainer'),
                  children: settings.outputFormat.toUpperCase(),
                },
                {
                  key: 'compression',
                  label: t('composer.summaryCompression'),
                  children: getCompressionPresetTechnicalLabel(settings.compression),
                },
                {
                  key: 'backend',
                  label: t('composer.summaryBackend'),
                  children: getRequestedEncoderBackendLabel(settings.encoderBackend),
                },
              ]}
            />
          </Space>
        </div>

        <Form layout="vertical" className="control-grid">
          <Row gutter={[14, 0]}>
            <Col xs={24} lg={8}>
              <Form.Item label={t('composer.fields.outputFormat')}>
                <Select
                  value={settings.outputFormat}
                  onChange={setOutputFormat}
                  options={['mp4', 'mov', 'mkv', 'webm'].map((value) => ({
                    value,
                    label: value.toUpperCase(),
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item label={t('composer.fields.compression')}>
                <Select
                  value={settings.compression}
                  onChange={setCompression}
                  options={(['light', 'balanced', 'strong'] as const).map((preset) => ({
                    value: preset,
                    label: getCompressionPresetTechnicalLabel(preset),
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item label={t('composer.fields.backend')}>
                <Select
                  value={settings.encoderBackend}
                  onChange={setEncoderBackend}
                  options={[
                    {
                      value: 'auto',
                      label: `${getRequestedEncoderBackendLabel('auto')} (${nvidiaAvailable ? t('composer.autoPrefersNvidia') : t('composer.autoStaysCpu')})`,
                    },
                    {
                      value: 'cpu',
                      label: getRequestedEncoderBackendLabel('cpu'),
                    },
                    {
                      value: 'nvidia',
                      label: getRequestedEncoderBackendLabel('nvidia'),
                      disabled: !nvidiaAvailable || !nvidiaSupportedForFormat,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Alert
          type={hardwareAlertType}
          showIcon
          message={
            hardwareAccelerationLoaded
              ? hardwareAccelerationProfile.nvidia.reason
              : t('composer.hardwareDetecting')
          }
          description={encoderModeDescription}
        />

        <div className="composer-action-bar">
          <Button icon={<UploadOutlined />} onClick={selectVideoFiles} size="large">
            {t('composer.buttons.addClips')}
          </Button>
          <Button
            icon={<ClearOutlined />}
            danger
            onClick={clearSelectedFiles}
            disabled={selectedFiles.length === 0}
            size="large"
          >
            {t('composer.buttons.clearQueue')}
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={loading}
            disabled={selectedFiles.length === 0}
            size="large"
            onClick={createJob}
          >
            {t('composer.buttons.startMerge')}
          </Button>
        </div>

        <Divider style={{ margin: 0 }} />

        <div className="manifest-head">
          <div>
            <Text className="panel-kicker">{t('composer.manifestTitle')}</Text>
            <Title level={5} className="section-heading section-title">
              {t('composer.manifestTitle')}
            </Title>
            <Text type="secondary">{t('composer.manifestSubtitle')}</Text>
          </div>
        </div>

        {selectedFiles.length === 0 ? (
          <Empty description={t('composer.empty.description')} />
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
                      <Tooltip title={t('composer.tooltips.moveUp')}>
                        <Button
                          size="small"
                          icon={<ArrowUpOutlined />}
                          disabled={isFirst}
                          onClick={() => moveSelectedFile(item.id, 'up')}
                        />
                      </Tooltip>
                      <Tooltip title={t('composer.tooltips.moveDown')}>
                        <Button
                          size="small"
                          icon={<ArrowDownOutlined />}
                          disabled={isLast}
                          onClick={() => moveSelectedFile(item.id, 'down')}
                        />
                      </Tooltip>
                      <Tooltip title={t('composer.tooltips.removeClip')}>
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
                        {isFirst ? <Tag color="cyan">{t('composer.clipTag.start')}</Tag> : null}
                        {isLast ? <Tag color="geekblue">{t('composer.clipTag.end')}</Tag> : null}
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
                            {isFirst
                              ? t('composer.clipRole.start')
                              : isLast
                                ? t('composer.clipRole.end')
                                : t('composer.clipRole.middle')}
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
