import { Progress, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TFunction } from 'i18next';
import type { Job } from '@shared/types';
import {
  historyDateFormatter,
  summarizeJobOutputs,
} from '@renderer/components/job-history/job-history.utils';
import {
  getCompressionPresetTechnicalLabel,
  getOutputFormatLabel,
  getOutputResolutionTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';
import {
  getJobModeLabel,
  getStatusLabel,
  statusColor,
  statusIcon,
  toProgressStatus,
} from '@renderer/utils/job-presentation';

const { Text } = Typography;

export const buildJobBoardColumns = (t: TFunction): ColumnsType<Job> => [
  {
    title: t('history.columns.job'),
    dataIndex: 'id',
    key: 'id',
    width: 120,
    render: (id: string) => <Text code>{id.slice(0, 8)}</Text>,
  },
  {
    title: t('history.columns.mode'),
    dataIndex: 'mode',
    key: 'mode',
    width: 140,
    render: (mode: Job['mode']) => <Tag bordered={false}>{getJobModeLabel(mode)}</Tag>,
  },
  {
    title: t('history.columns.input'),
    dataIndex: 'files',
    key: 'files',
    render: (files: Job['files']) => (
      <Text>{t('history.inputSummary', { count: files.length, suffix: files.length === 1 ? '' : 's' })}</Text>
    ),
    width: 130,
  },
  {
    title: t('history.columns.profile'),
    key: 'settings',
    render: (_, job) => (
      <Space direction="vertical" size={0}>
        <Text>
          {getOutputFormatLabel(job.settings.outputFormat)} -{' '}
          {getCompressionPresetTechnicalLabel(job.settings.compression, job.settings.outputFormat)}
        </Text>
        <Text type="secondary">{getOutputResolutionTechnicalLabel(job.settings.outputResolution)}</Text>
        <Text type="secondary">
          {getRequestedEncoderBackendLabel(job.settings.encoderBackend)}
          {job.resolvedEncoderBackend
            ? ` -> ${getResolvedEncoderBackendLabel(job.resolvedEncoderBackend)}`
            : ''}
        </Text>
        <Text type="secondary">
          {getVideoTimingModeLabel(job.settings.videoTimingMode)}
          {job.settings.videoTimingMode === 'cfr'
            ? ` -> ${getTargetFrameRateLabel(job.settings.targetFrameRate)}`
            : ''}
        </Text>
      </Space>
    ),
    width: 400,
  },
  {
    title: t('history.columns.status'),
    dataIndex: 'status',
    key: 'status',
    width: 170,
    render: (status: Job['status']) => (
      <Tag icon={statusIcon[status]} color={statusColor[status]}>
        {getStatusLabel(status)}
      </Tag>
    ),
  },
  {
    title: t('history.columns.output'),
    key: 'outputPaths',
    render: (_, job) => summarizeJobOutputs(job, t),
    width: 260,
  },
  {
    title: t('history.columns.progress'),
    key: 'progress',
    width: 260,
    render: (_, job) => (
      <Space direction="vertical" size={1} style={{ width: '100%' }}>
        <Progress percent={job.progress} size="small" status={toProgressStatus(job.status)} />
        <Text type="secondary">{job.message || t('common.waiting')}</Text>
      </Space>
    ),
  },
  {
    title: t('history.columns.updated'),
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 140,
    render: (updatedAt: number) => <Text type="secondary">{historyDateFormatter.format(updatedAt)}</Text>,
  },
];
