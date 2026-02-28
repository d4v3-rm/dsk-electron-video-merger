import { Card, Progress, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { getResolvedEncoderBackendLabel } from '@renderer/utils/encoder-presentation';
import {
  getJobModeLabel,
  getStatusLabel,
  statusColor,
  toProgressStatus,
} from '@renderer/utils/job-presentation';
import { formatDurationMs, formatSpeed } from '@renderer/utils/runtime-presentation';
import {
  highlightCardStyle,
  infoStackStyle,
  runtimeBoxStyle,
  sectionCardStyle,
  sectionCardStyles,
} from '@renderer/theme/component-styles';

const { Text } = Typography;

interface PreviewRuntimeCardProps {
  activeJob: Job | null;
  selectedFilesCount: number;
}

export const PreviewRuntimeCard = ({ activeJob, selectedFilesCount }: PreviewRuntimeCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      size="small"
      style={activeJob ? highlightCardStyle : sectionCardStyle}
      styles={sectionCardStyles}
      title={t('preview.sections.runtime')}
    >
      {activeJob ? (
        <div style={runtimeBoxStyle}>
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
        <div style={infoStackStyle}>
          <Text strong>
            {selectedFilesCount > 0 ? t('preview.runtime.readyTitle') : t('preview.runtime.idleTitle')}
          </Text>
          <Text type="secondary">
            {selectedFilesCount > 0
              ? t('preview.runtime.readyDescription')
              : t('preview.runtime.idleDescription')}
          </Text>
        </div>
      )}
    </Card>
  );
};
