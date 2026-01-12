import { ClockCircleOutlined, FileDoneOutlined, LinkOutlined, RadarChartOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Empty, List, Progress, Row, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  getCompressionPresetTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
} from '@renderer/utils/encoder-presentation';
import { buildMergedOutputName, formatBytes } from '@renderer/utils/file-utils';
import { getStatusLabel, statusColor, toProgressStatus } from '@renderer/utils/job-presentation';
import { formatDurationMs, formatSpeed } from '@renderer/utils/runtime-presentation';

const { Text, Paragraph, Title } = Typography;

export const MergePreviewCard = () => {
  const { t } = useTranslation();
  const selectedFiles = useAppStore((state) => state.selectedFiles);
  const settings = useAppStore((state) => state.settings);
  const jobs = useAppStore((state) => state.jobs);

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const activeJob =
    jobs.find((job) => job.status === 'running') ?? jobs.find((job) => job.status === 'queued') ?? null;
  const latestCompletedJob =
    jobs.find((job) => job.status === 'completed' && job.outputPaths.length > 0) ?? null;
  const previewSettings =
    selectedFiles.length > 0 ? settings : (activeJob?.settings ?? latestCompletedJob?.settings ?? settings);
  const previewSeedFile =
    selectedFiles[0]?.name ?? activeJob?.files[0]?.name ?? latestCompletedJob?.files[0]?.name ?? undefined;

  const previewName = buildMergedOutputName(previewSeedFile, previewSettings.outputFormat);
  const previewStatus =
    activeJob?.status === 'running'
      ? t('preview.status.active')
      : activeJob?.status === 'queued'
        ? t('preview.status.queued')
        : selectedFiles.length > 0
          ? t('preview.status.ready')
          : t('preview.status.idle');
  const stagedClips =
    selectedFiles.length || activeJob?.files.length || latestCompletedJob?.files.length || 0;
  const effectiveBackend = activeJob?.resolvedEncoderBackend ?? latestCompletedJob?.resolvedEncoderBackend;

  return (
    <Card
      className="modern-card preview-card"
      title={t('preview.cardTitle')}
      extra={<Tag color={activeJob ? 'processing' : 'default'}>{previewStatus}</Tag>}
    >
      {selectedFiles.length === 0 && !activeJob && !latestCompletedJob ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('preview.emptyDescription')} />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="preview-hero">
            <div>
              <Text className="panel-kicker">{t('preview.summaryTitle')}</Text>
              <Title level={4} className="section-heading preview-output-name">
                {previewName}
              </Title>
              <Text type="secondary">
                {t('preview.summaryText', {
                  format: previewSettings.outputFormat.toUpperCase(),
                  clips: stagedClips,
                })}
              </Text>
            </div>

            <Space wrap size={[8, 8]} className="signal-pills">
              <Tag color="blue">{previewSettings.outputFormat.toUpperCase()}</Tag>
              <Tag>{getCompressionPresetTechnicalLabel(previewSettings.compression)}</Tag>
              <Tag>{getRequestedEncoderBackendLabel(previewSettings.encoderBackend)}</Tag>
            </Space>
          </div>

          <Row gutter={[12, 12]} className="preview-insight-grid">
            <Col xs={24} md={8}>
              <div className="data-tile">
                <Text className="data-tile-label">{t('preview.labels.inputClips')}</Text>
                <Text className="data-tile-value">{stagedClips}</Text>
                <Text type="secondary" className="data-tile-meta">
                  {t('preview.currentOrder')}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="data-tile">
                <Text className="data-tile-label">{t('preview.labels.stagingSize')}</Text>
                <Text className="data-tile-value">
                  {selectedFiles.length > 0 ? formatBytes(totalSize) : t('common.notAvailable')}
                </Text>
                <Text type="secondary" className="data-tile-meta">
                  {t('preview.singleFile')}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="data-tile">
                <Text className="data-tile-label">{t('preview.labels.activeBackend')}</Text>
                <Text className="data-tile-value">
                  {effectiveBackend
                    ? getResolvedEncoderBackendLabel(effectiveBackend)
                    : t('preview.pendingResolution')}
                </Text>
                <Text type="secondary" className="data-tile-meta">
                  {getRequestedEncoderBackendLabel(previewSettings.encoderBackend)}
                </Text>
              </div>
            </Col>
          </Row>

          {activeJob ? (
            <div className="preview-runtime">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space align="center" wrap>
                  <Tag color={statusColor[activeJob.status]}>{getStatusLabel(activeJob.status)}</Tag>
                  {activeJob.resolvedEncoderBackend ? (
                    <Tag bordered={false} color="blue">
                      {getResolvedEncoderBackendLabel(activeJob.resolvedEncoderBackend)}
                    </Tag>
                  ) : null}
                  <Text type="secondary">{activeJob.message}</Text>
                </Space>

                <div>
                  <Text className="panel-kicker">{t('preview.telemetryTitle')}</Text>
                  <Progress percent={activeJob.progress} status={toProgressStatus(activeJob.status)} />
                </div>

                <div className="preview-telemetry-grid">
                  <div className="telemetry-tile">
                    <Text className="telemetry-tile-label">{t('details.labels.processedDuration')}</Text>
                    <Text className="telemetry-tile-value">
                      {formatDurationMs(activeJob.telemetry?.processedDurationMs)}
                    </Text>
                  </div>
                  <div className="telemetry-tile">
                    <Text className="telemetry-tile-label">{t('details.labels.speed')}</Text>
                    <Text className="telemetry-tile-value">{formatSpeed(activeJob.telemetry?.speed)}</Text>
                  </div>
                  <div className="telemetry-tile">
                    <Text className="telemetry-tile-label">{t('details.labels.bitrate')}</Text>
                    <Text className="telemetry-tile-value">
                      {activeJob.telemetry?.bitrate ?? t('common.notAvailable')}
                    </Text>
                  </div>
                </div>
              </Space>
            </div>
          ) : (
            <Alert
              type="info"
              showIcon
              icon={<RadarChartOutlined />}
              message={t('preview.telemetryIdleTitle')}
              description={t('preview.telemetryIdleDescription')}
            />
          )}

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={12}>
              <div className="preview-panel">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Space align="center">
                    <ClockCircleOutlined />
                    <Text className="panel-kicker">{t('preview.queueTitle')}</Text>
                  </Space>

                  {selectedFiles.length > 0 ? (
                    <>
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
                          {t('preview.moreClips', { count: selectedFiles.length - 4 })}
                        </Text>
                      ) : null}
                    </>
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t('preview.queueIdleDescription')}
                    />
                  )}
                </Space>
              </div>
            </Col>

            <Col xs={24} xl={12}>
              <div className="preview-panel">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Space align="center">
                    <FileDoneOutlined />
                    <Text className="panel-kicker">{t('preview.artifactTitle')}</Text>
                  </Space>

                  {latestCompletedJob?.outputPaths[0] ? (
                    <Paragraph
                      className="preview-path"
                      copyable={{ text: latestCompletedJob.outputPaths[0] }}
                      ellipsis={{ tooltip: latestCompletedJob.outputPaths[0] }}
                    >
                      <LinkOutlined /> {latestCompletedJob.outputPaths[0]}
                    </Paragraph>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('details.outputPending')} />
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </Space>
      )}
    </Card>
  );
};
