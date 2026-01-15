import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClearOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
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
  Input,
  List,
  Select,
  Space,
  Statistic,
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
import { formatBytes } from '@renderer/utils/file-utils';

const { Text, Paragraph, Title } = Typography;

export const JobComposer = () => {
  const { t } = useTranslation();
  const {
    jobMode,
    selectedFiles,
    hardwareAccelerationProfile,
    hardwareAccelerationLoaded,
    outputDirectory,
    settings,
    loading,
    setCompression,
    setEncoderBackend,
    setOutputFormat,
    selectVideoFiles,
    selectOutputDirectory,
    clearOutputDirectory,
    clearSelectedFiles,
    removeSelectedFile,
    moveSelectedFile,
    createJob,
  } = useAppStore();

  const isMergeMode = jobMode === 'merge';

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

  return (
    <Card
      title={isMergeMode ? t('composer.cardTitle.merge') : t('composer.cardTitle.compress')}
      className="modern-card queue-card"
      extra={
        <Space size="small" wrap>
          <Tag color={selectedFiles.length > (isMergeMode ? 1 : 0) ? 'processing' : 'default'}>
            {isMergeMode ? t('composer.tags.orderedQueue') : t('composer.tags.batchCompression')}
          </Tag>
          <Tag color={nvidiaAvailable ? 'success' : 'default'}>
            {nvidiaAvailable ? t('composer.tags.nvidiaAvailable') : t('composer.tags.cpuOnly')}
          </Tag>
          <CodecGuideModal />
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} className="section-title">
            {isMergeMode ? t('composer.title.merge') : t('composer.title.compress')}
          </Title>
          <Text type="secondary">
            {isMergeMode ? t('composer.subtitle.merge') : t('composer.subtitle.compress')}
          </Text>
        </div>

        <Alert
          type={isMergeMode ? 'info' : 'warning'}
          showIcon
          message={isMergeMode ? t('composer.orderInfo.merge') : t('composer.orderInfo.compress')}
        />

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

        <div className="queue-stats">
          <div className="queue-stat-tile">
            <Statistic
              title={isMergeMode ? t('composer.stats.clips') : t('composer.stats.videos')}
              value={selectedStats.totalFiles}
              prefix={<VideoCameraAddOutlined />}
            />
          </div>
          <div className="queue-stat-tile">
            <Statistic title={t('composer.stats.stagingSize')} value={selectedStats.totalSize} />
          </div>
        </div>

        <Form layout="vertical">
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

          <Form.Item label={t('composer.fields.destinationFolder')}>
            <Space.Compact style={{ width: '100%' }}>
              <Input readOnly value={outputDirectory ?? t('composer.destinationDefault')} />
              <Button icon={<FolderOpenOutlined />} onClick={selectOutputDirectory}>
                {t('composer.buttons.selectDestination')}
              </Button>
              <Button onClick={clearOutputDirectory} disabled={!outputDirectory}>
                {t('composer.buttons.useDefaultDestination')}
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>

        <Text type="secondary">
          {t('composer.backendSelected', {
            backend: getRequestedEncoderBackendLabel(settings.encoderBackend),
          })}{' '}
          {settings.outputFormat === 'webm'
            ? t('composer.backendWebm')
            : nvidiaAvailable
              ? t('composer.backendNvenc')
              : t('composer.backendCpu')}
        </Text>

        <Text type="secondary">
          {outputDirectory ? t('composer.destinationSelected') : t('composer.destinationAuto')}
        </Text>

        <Space size="middle" wrap>
          <Button icon={<UploadOutlined />} onClick={selectVideoFiles} size="large">
            {isMergeMode ? t('composer.buttons.addClips') : t('composer.buttons.addVideos')}
          </Button>
          <Button
            icon={<ClearOutlined />}
            danger
            onClick={clearSelectedFiles}
            disabled={selectedFiles.length === 0}
            size="large"
          >
            {isMergeMode ? t('composer.buttons.clearQueue') : t('composer.buttons.clearSelection')}
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={loading}
            disabled={selectedFiles.length === 0}
            size="large"
            onClick={createJob}
          >
            {isMergeMode ? t('composer.buttons.startMerge') : t('composer.buttons.startCompression')}
          </Button>
        </Space>

        <Divider style={{ margin: 0 }} />

        {selectedFiles.length === 0 ? (
          <Alert
            type="warning"
            showIcon
            message={isMergeMode ? t('composer.empty.mergeTitle') : t('composer.empty.compressTitle')}
            description={
              isMergeMode ? t('composer.empty.mergeDescription') : t('composer.empty.compressDescription')
            }
          />
        ) : (
          <List
            className="queue-list"
            dataSource={selectedFiles}
            renderItem={(item, index) => {
              const isFirst = index === 0;
              const isLast = index === selectedFiles.length - 1;
              const actions = isMergeMode
                ? [
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
                  ]
                : [
                    <Tooltip key="remove" title={t('composer.tooltips.removeClip')}>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeSelectedFile(item.id)}
                      />
                    </Tooltip>,
                  ];

              return (
                <List.Item className="queue-item" actions={actions}>
                  <List.Item.Meta
                    avatar={<div className="queue-index">{index + 1}</div>}
                    title={
                      <Space wrap>
                        <Text strong>{item.name}</Text>
                        {isMergeMode && isFirst ? (
                          <Tag color="cyan">{t('composer.clipTag.start')}</Tag>
                        ) : null}
                        {isMergeMode && isLast ? (
                          <Tag color="geekblue">{t('composer.clipTag.end')}</Tag>
                        ) : null}
                      </Space>
                    }
                    description={
                      <Flex vertical gap={4}>
                        <Paragraph className="selected-file-path" ellipsis={{ tooltip: item.path }}>
                          {item.path}
                        </Paragraph>
                        <Space size="middle">
                          <Text type="secondary">{formatBytes(item.size)}</Text>
                          {isMergeMode ? (
                            <Text type="secondary">
                              {isFirst
                                ? t('composer.clipRole.start')
                                : isLast
                                  ? t('composer.clipRole.end')
                                  : t('composer.clipRole.middle')}
                            </Text>
                          ) : (
                            <Text type="secondary">{t('composer.videoRole.source')}</Text>
                          )}
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
