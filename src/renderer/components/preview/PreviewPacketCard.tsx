import { Card, Descriptions, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { InputFileDTO } from '@shared/types';
import type { PreviewModel } from '@renderer/components/preview/preview.types';
import {
  getCompressionPresetTechnicalLabel,
  getOutputFormatTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';
import { formatBytes } from '@renderer/utils/file-utils';
import { getJobModeLabel } from '@renderer/utils/job-presentation';
import { outputNameStyle, sectionCardStyle, sectionCardStyles } from '@renderer/theme/component-styles';

const { Text } = Typography;

interface PreviewPacketCardProps {
  previewModel: PreviewModel;
  selectedFiles: InputFileDTO[];
}

export const PreviewPacketCard = ({ previewModel, selectedFiles }: PreviewPacketCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      size="small"
      title={t('preview.sections.packet')}
      style={sectionCardStyle}
      styles={sectionCardStyles}
    >
      <Descriptions
        column={2}
        size="small"
        items={[
          {
            key: 'name',
            label: t('preview.labels.outputName'),
            children: (
              <Text strong style={outputNameStyle}>
                {previewModel.previewName}
              </Text>
            ),
          },
          {
            key: 'mode',
            label: t('preview.labels.mode'),
            children: getJobModeLabel(previewModel.previewMode),
          },
          {
            key: 'clips',
            label: t('preview.labels.inputVideos'),
            children: previewModel.inputCount,
          },
          {
            key: 'format',
            label: t('preview.labels.format'),
            children: getOutputFormatTechnicalLabel(previewModel.previewSettings.outputFormat),
          },
          {
            key: 'compression',
            label: t('preview.labels.compression'),
            children: getCompressionPresetTechnicalLabel(
              previewModel.previewSettings.compression,
              previewModel.previewSettings.outputFormat,
            ),
          },
          {
            key: 'backendRequested',
            label: t('preview.labels.requestedBackend'),
            children: getRequestedEncoderBackendLabel(previewModel.previewSettings.encoderBackend),
          },
          {
            key: 'backendResolved',
            label: t('preview.labels.activeBackend'),
            children: previewModel.activeJob?.resolvedEncoderBackend
              ? getResolvedEncoderBackendLabel(previewModel.activeJob.resolvedEncoderBackend)
              : previewModel.latestCompletedJob?.resolvedEncoderBackend
                ? getResolvedEncoderBackendLabel(previewModel.latestCompletedJob.resolvedEncoderBackend)
                : t('preview.pendingResolution'),
          },
          {
            key: 'frameTiming',
            label: t('preview.labels.frameTiming'),
            children: getVideoTimingModeLabel(previewModel.previewSettings.videoTimingMode),
          },
          ...(previewModel.previewSettings.videoTimingMode === 'cfr'
            ? [
                {
                  key: 'targetFrameRate',
                  label: t('preview.labels.targetFrameRate'),
                  children: getTargetFrameRateLabel(previewModel.previewSettings.targetFrameRate),
                },
              ]
            : []),
          {
            key: 'size',
            label: t('preview.labels.stagingSize'),
            children:
              selectedFiles.length > 0 ? formatBytes(previewModel.totalSize) : t('common.notAvailable'),
          },
          {
            key: 'delivery',
            label: t('preview.labels.delivery'),
            children:
              previewModel.previewMode === 'merge'
                ? t('preview.delivery.merge')
                : t('preview.delivery.compress'),
          },
          {
            key: 'destination',
            label: t('preview.labels.destinationFolder'),
            children: previewModel.previewOutputDirectory ?? t('preview.defaultDestination'),
            span: 2,
          },
        ]}
      />
    </Card>
  );
};
