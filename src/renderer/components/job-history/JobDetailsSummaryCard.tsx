import { Card, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { HistoryPathText } from '@renderer/components/job-history/HistoryPathText';
import { historyDateFormatter } from '@renderer/components/job-history/job-history.utils';
import {
  getCompressionPresetTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';
import { getJobModeLabel } from '@renderer/utils/job-presentation';

interface JobDetailsSummaryCardProps {
  job: Job;
}

export const JobDetailsSummaryCard = ({ job }: JobDetailsSummaryCardProps) => {
  const { t } = useTranslation();

  return (
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
            key: 'frameTiming',
            label: t('details.labels.frameTiming'),
            children: getVideoTimingModeLabel(job.settings.videoTimingMode),
          },
          ...(job.settings.videoTimingMode === 'cfr'
            ? [
                {
                  key: 'targetFrameRate',
                  label: t('details.labels.targetFrameRate'),
                  children: getTargetFrameRateLabel(job.settings.targetFrameRate),
                },
              ]
            : []),
          {
            key: 'clips',
            label: t('details.labels.inputVideos'),
            children: job.files.length,
          },
          {
            key: 'destinationFolder',
            label: t('details.labels.destinationFolder'),
            children: job.outputDirectory ? (
              <HistoryPathText path={job.outputDirectory} />
            ) : (
              t('details.defaultDestination')
            ),
          },
          {
            key: 'createdAt',
            label: t('details.labels.createdAt'),
            children: historyDateFormatter.format(job.createdAt),
          },
        ]}
      />
    </Card>
  );
};
