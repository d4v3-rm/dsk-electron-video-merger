import {
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import { Card, Col, Descriptions, Empty, List, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { selectPreviewState } from '@renderer/store/app-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  getCompressionPresetTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';
import { buildOutputPreviewName, formatBytes } from '@renderer/utils/file-utils';
import {
  getJobModeLabel,
  getStatusLabel,
  statusColor,
  toProgressStatus,
} from '@renderer/utils/job-presentation';
import { formatDurationMs, formatSpeed } from '@renderer/utils/runtime-presentation';

const { Text, Paragraph } = Typography;

export const MergePreviewCard = () => {
  const { t } = useTranslation();
  const { selectedFiles, outputDirectory, settings, jobMode, jobs } = useAppStore(
    useShallow(selectPreviewState),
  );

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const activeJob =
    jobs.find((job) => job.status === 'running') ?? jobs.find((job) => job.status === 'queued') ?? null;
  const latestCompletedJob =
    jobs.find((job) => job.status === 'completed' && job.outputPaths.length > 0) ?? null;
  const previewMode =
    selectedFiles.length > 0 ? jobMode : (activeJob?.mode ?? latestCompletedJob?.mode ?? jobMode);
  const previewSettings =
    selectedFiles.length > 0 ? settings : (activeJob?.settings ?? latestCompletedJob?.settings ?? settings);
  const previewSeedFile =
    selectedFiles[0]?.name ?? activeJob?.files[0]?.name ?? latestCompletedJob?.files[0]?.name ?? undefined;
  const previewOutputDirectory =
    selectedFiles.length > 0
      ? outputDirectory
      : (activeJob?.outputDirectory ?? latestCompletedJob?.outputDirectory ?? null);
  const latestOutputPath = latestCompletedJob?.outputPaths.at(-1) ?? null;

  const previewName = buildOutputPreviewName(previewMode, previewSeedFile, previewSettings.outputFormat);
  const previewStatus =
    activeJob?.status === 'running'
      ? t('preview.status.active')
      : activeJob?.status === 'queued'
        ? t('preview.status.queued')
        : selectedFiles.length > 0
          ? t('preview.status.ready')
          : t('preview.status.idle');

  const previewSummaryItems = [
    {
      key: 'inputs',
      title: t('preview.metrics.inputVideos'),
      value: selectedFiles.length || activeJob?.files.length || 0,
      prefix: <ClockCircleOutlined />,
    },
    {
      key: 'format',
      title: t('preview.metrics.format'),
      value: previewSettings.outputFormat.toUpperCase(),
      prefix: <DeploymentUnitOutlined />,
    },
    {
      key: 'backend',
      title: t('preview.metrics.backend'),
      value: activeJob?.resolvedEncoderBackend
        ? getResolvedEncoderBackendLabel(activeJob.resolvedEncoderBackend)
        : getRequestedEncoderBackendLabel(previewSettings.encoderBackend),
      prefix: <RadarChartOutlined />,
    },
    {
      key: 'delivery',
      title: t('preview.metrics.delivery'),
      value: previewMode === 'merge' ? t('preview.delivery.merge') : t('preview.delivery.compress'),
      prefix: <FolderOpenOutlined />,
    },
  ];

  return (
    <Card
      className="modern-card preview-card"
      title={t('preview.cardTitle')}
      extra={
        <Space size="small" wrap>
          <Tag>{getJobModeLabel(activeJob?.mode ?? previewMode)}</Tag>
          <Tag color={activeJob ? 'processing' : 'default'}>{previewStatus}</Tag>
        </Space>
      }
    >
      {selectedFiles.length === 0 && !activeJob && !latestCompletedJob ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('preview.emptyDescription')} />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="preview-summary-grid">
            {previewSummaryItems.map((item) => (
              <div key={item.key} className="preview-stat-tile">
                <Statistic
                  className="metric-stat"
                  title={item.title}
                  value={item.value}
                  prefix={item.prefix}
                />
              </div>
            ))}
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
              <Card size="small" className="panel-section-card" title={t('preview.sections.packet')}>
                <Descriptions
                  column={2}
                  size="small"
                  items={[
                    {
                      key: 'name',
                      label: t('preview.labels.outputName'),
                      children: (
                        <Text strong className="preview-output-name">
                          {previewName}
                        </Text>
                      ),
                    },
                    {
                      key: 'mode',
                      label: t('preview.labels.mode'),
                      children: getJobModeLabel(previewMode),
                    },
                    {
                      key: 'clips',
                      label: t('preview.labels.inputVideos'),
                      children: selectedFiles.length || activeJob?.files.length || 0,
                    },
                    {
                      key: 'format',
                      label: t('preview.labels.format'),
                      children: previewSettings.outputFormat.toUpperCase(),
                    },
                    {
                      key: 'compression',
                      label: t('preview.labels.compression'),
                      children: getCompressionPresetTechnicalLabel(previewSettings.compression),
                    },
                    {
                      key: 'backendRequested',
                      label: t('preview.labels.requestedBackend'),
                      children: getRequestedEncoderBackendLabel(previewSettings.encoderBackend),
                    },
                    {
                      key: 'backendResolved',
                      label: t('preview.labels.activeBackend'),
                      children: activeJob?.resolvedEncoderBackend
                        ? getResolvedEncoderBackendLabel(activeJob.resolvedEncoderBackend)
                        : latestCompletedJob?.resolvedEncoderBackend
                          ? getResolvedEncoderBackendLabel(latestCompletedJob.resolvedEncoderBackend)
                          : t('preview.pendingResolution'),
                    },
                    {
                      key: 'frameTiming',
                      label: t('preview.labels.frameTiming'),
                      children: getVideoTimingModeLabel(previewSettings.videoTimingMode),
                    },
                    ...(previewSettings.videoTimingMode === 'cfr'
                      ? [
                          {
                            key: 'targetFrameRate',
                            label: t('preview.labels.targetFrameRate'),
                            children: getTargetFrameRateLabel(previewSettings.targetFrameRate),
                          },
                        ]
                      : []),
                    {
                      key: 'size',
                      label: t('preview.labels.stagingSize'),
                      children: selectedFiles.length > 0 ? formatBytes(totalSize) : t('common.notAvailable'),
                    },
                    {
                      key: 'delivery',
                      label: t('preview.labels.delivery'),
                      children:
                        previewMode === 'merge'
                          ? t('preview.delivery.merge')
                          : t('preview.delivery.compress'),
                    },
                    {
                      key: 'destination',
                      label: t('preview.labels.destinationFolder'),
                      children: previewOutputDirectory ?? t('preview.defaultDestination'),
                      span: 2,
                    },
                  ]}
                />
              </Card>
            </Col>

            <Col xs={24} xl={10}>
              <Card
                size="small"
                className={activeJob ? 'panel-highlight-card' : 'panel-section-card'}
                title={t('preview.sections.runtime')}
              >
                {activeJob ? (
                  <div className="preview-runtime">
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Space align="center" wrap>
                        <Tag color={statusColor[activeJob.status]}>{getStatusLabel(activeJob.status)}</Tag>
                        <Tag>{getJobModeLabel(activeJob.mode)}</Tag>
                        {activeJob.resolvedEncoderBackend ? (
                          <Tag bordered={false} color="blue">
                            {getResolvedEncoderBackendLabel(activeJob.resolvedEncoderBackend)}
                          </Tag>
                        ) : null}
                      </Space>
                      <Progress percent={activeJob.progress} status={toProgressStatus(activeJob.status)} />
                      <Text>{activeJob.message}</Text>
                      {activeJob.telemetry ? (
                        <Text type="secondary">
                          {`${formatDurationMs(activeJob.telemetry.processedDurationMs)} / ${formatDurationMs(activeJob.telemetry.totalDurationMs)} | ${formatSpeed(activeJob.telemetry.speed)}${activeJob.telemetry.bitrate ? ` | ${activeJob.telemetry.bitrate}` : ''}`}
                        </Text>
                      ) : null}
                    </Space>
                  </div>
                ) : (
                  <div className="preview-section-copy">
                    <Text strong>
                      {selectedFiles.length > 0
                        ? t('preview.runtime.readyTitle')
                        : t('preview.runtime.idleTitle')}
                    </Text>
                    <Text type="secondary">
                      {selectedFiles.length > 0
                        ? t('preview.runtime.readyDescription')
                        : t('preview.runtime.idleDescription')}
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {selectedFiles.length > 0 ? (
              <Col xs={24} xl={latestOutputPath ? 12 : 24}>
                <Card size="small" className="panel-list-card" title={t('preview.sections.inputs')}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="secondary">
                      {previewMode === 'merge' ? t('preview.currentOrder') : t('preview.selectedVideos')}
                    </Text>
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
                      <Text type="secondary">
                        {t('preview.moreVideos', { count: selectedFiles.length - 4 })}
                      </Text>
                    ) : null}
                  </Space>
                </Card>
              </Col>
            ) : null}

            {latestOutputPath ? (
              <Col xs={24} xl={selectedFiles.length > 0 ? 12 : 24}>
                <Card size="small" className="panel-list-card" title={t('preview.sections.artifact')}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="secondary">{t('preview.lastOutput')}</Text>
                    <Paragraph
                      className="preview-path"
                      copyable={{ text: latestOutputPath }}
                      ellipsis={{ tooltip: latestOutputPath }}
                    >
                      <LinkOutlined /> {latestOutputPath}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            ) : null}
          </Row>
        </Space>
      )}
    </Card>
  );
};
