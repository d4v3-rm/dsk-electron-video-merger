import { FileDoneOutlined, OrderedListOutlined, RadarChartOutlined } from '@ant-design/icons';
import {
  Alert,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Timeline,
  Typography,
  theme,
} from 'antd';
import { useTranslation } from 'react-i18next';
import type { JobLogEntry } from '@shared/types';
import type { JobDetailsDrawerProps } from '@renderer/components/job-details-drawer.types';
import {
  getCompressionPresetTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
} from '@renderer/utils/encoder-presentation';
import { getFileName } from '@renderer/utils/file-utils';
import {
  getJobModeLabel,
  getLogStageLabel,
  getStatusLabel,
  statusColor,
  toProgressStatus,
} from '@renderer/utils/job-presentation';
import { formatDurationMs, formatSpeed } from '@renderer/utils/runtime-presentation';

const { Text, Paragraph } = Typography;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const getLogColor = (log: JobLogEntry): 'blue' | 'red' | 'orange' => {
  if (log.level === 'error') {
    return 'red';
  }

  if (log.level === 'warning') {
    return 'orange';
  }

  return 'blue';
};

export const JobDetailsDrawer = ({ job, open, onClose }: JobDetailsDrawerProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Drawer
      title={
        job
          ? t('details.title', { mode: getJobModeLabel(job.mode), id: job.id.slice(0, 8) })
          : t('details.defaultTitle')
      }
      open={open}
      onClose={onClose}
      width={680}
      destroyOnClose
      styles={{
        content: {
          borderTopLeftRadius: 28,
          borderBottomLeftRadius: 28,
          overflow: 'hidden',
          background: token.colorBgContainer,
        },
        header: {
          padding: '24px 24px 0',
          background: 'transparent',
        },
        body: {
          padding: 24,
          background: 'transparent',
        },
      }}
    >
      {job ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space align="center" wrap>
                <Tag color={statusColor[job.status]}>{getStatusLabel(job.status)}</Tag>
                <Tag bordered={false}>{getJobModeLabel(job.mode)}</Tag>
                {job.resolvedEncoderBackend ? (
                  <Tag bordered={false} color="blue">
                    {getResolvedEncoderBackendLabel(job.resolvedEncoderBackend)}
                  </Tag>
                ) : null}
                <Text type="secondary">
                  {t('details.updatedAt', { value: dateFormatter.format(job.updatedAt) })}
                </Text>
              </Space>

              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text strong>{t('details.progressTitle')}</Text>
                <Progress percent={job.progress} status={toProgressStatus(job.status)} />
                <Text type="secondary">{job.message}</Text>
              </Space>
            </Space>
          </Card>

          {job.error ? (
            <Alert type="error" showIcon message={t('details.errorTitle')} description={job.error} />
          ) : null}

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title={t('details.summaryTitle')}>
                <Descriptions
                  column={1}
                  size="small"
                  items={[
                    {
                      key: 'mode',
                      label: t('details.labels.mode'),
                      children: getJobModeLabel(job.mode),
                    },
                    {
                      key: 'format',
                      label: t('details.labels.format'),
                      children: job.settings.outputFormat.toUpperCase(),
                    },
                    {
                      key: 'compression',
                      label: t('details.labels.compression'),
                      children: getCompressionPresetTechnicalLabel(job.settings.compression),
                    },
                    {
                      key: 'backendRequested',
                      label: t('details.labels.requestedBackend'),
                      children: getRequestedEncoderBackendLabel(job.settings.encoderBackend),
                    },
                    {
                      key: 'backendResolved',
                      label: t('details.labels.activeBackend'),
                      children: job.resolvedEncoderBackend
                        ? getResolvedEncoderBackendLabel(job.resolvedEncoderBackend)
                        : t('common.pending'),
                    },
                    {
                      key: 'clips',
                      label: t('details.labels.inputVideos'),
                      children: job.files.length,
                    },
                    {
                      key: 'destinationFolder',
                      label: t('details.labels.destinationFolder'),
                      children: job.outputDirectory ? (
                        <Paragraph
                          className="job-drawer-path"
                          copyable={{ text: job.outputDirectory }}
                          ellipsis={{ tooltip: job.outputDirectory }}
                        >
                          {job.outputDirectory}
                        </Paragraph>
                      ) : (
                        t('details.defaultDestination')
                      ),
                    },
                    {
                      key: 'createdAt',
                      label: t('details.labels.createdAt'),
                      children: dateFormatter.format(job.createdAt),
                    },
                  ]}
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card title={t('details.runtimeTitle')}>
                <Descriptions
                  column={2}
                  size="small"
                  items={[
                    {
                      key: 'processedDuration',
                      label: t('details.labels.processedDuration'),
                      children: formatDurationMs(job.telemetry?.processedDurationMs),
                    },
                    {
                      key: 'totalDuration',
                      label: t('details.labels.totalDuration'),
                      children: formatDurationMs(job.telemetry?.totalDurationMs),
                    },
                    {
                      key: 'fps',
                      label: t('details.labels.fps'),
                      children: job.telemetry?.fps
                        ? `${job.telemetry.fps.toFixed(1)} fps`
                        : t('common.notAvailable'),
                    },
                    {
                      key: 'speed',
                      label: t('details.labels.speed'),
                      children: formatSpeed(job.telemetry?.speed),
                    },
                    {
                      key: 'bitrate',
                      label: t('details.labels.bitrate'),
                      children: job.telemetry?.bitrate ?? t('common.notAvailable'),
                    },
                  ]}
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card title={t('details.logTitle')} extra={<RadarChartOutlined />}>
                <Timeline
                  items={job.logs.map((log) => ({
                    color: getLogColor(log),
                    children: (
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Space wrap>
                          <Tag bordered={false}>{getLogStageLabel(log.stage)}</Tag>
                          {log.progress !== undefined ? <Tag color="blue">{log.progress}%</Tag> : null}
                          <Text type="secondary">{dateFormatter.format(log.timestamp)}</Text>
                        </Space>
                        <Text>{log.message}</Text>
                      </Space>
                    ),
                  }))}
                  pending={job.status === 'running' ? t('details.logPending') : undefined}
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <OrderedListOutlined />
                    {t('details.inputTitle')}
                  </Space>
                }
              >
                <List
                  size="small"
                  dataSource={job.files}
                  renderItem={(file, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Tag bordered={false}>{index + 1}</Tag>}
                        title={file.name}
                        description={
                          <Paragraph
                            className="job-drawer-path"
                            copyable={{ text: file.path }}
                            ellipsis={{ tooltip: file.path }}
                          >
                            {file.path}
                          </Paragraph>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <FileDoneOutlined />
                    {t('details.outputTitle')}
                  </Space>
                }
              >
                {job.outputPaths.length > 0 ? (
                  <List
                    size="small"
                    dataSource={job.outputPaths}
                    renderItem={(outputPath) => (
                      <List.Item>
                        <List.Item.Meta
                          title={getFileName(outputPath)}
                          description={
                            <Paragraph
                              className="job-drawer-path"
                              copyable={{ text: outputPath }}
                              ellipsis={{ tooltip: outputPath }}
                            >
                              {outputPath}
                            </Paragraph>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('details.outputPending')} />
                )}
              </Card>
            </Col>
          </Row>
        </Space>
      ) : null}
    </Drawer>
  );
};
