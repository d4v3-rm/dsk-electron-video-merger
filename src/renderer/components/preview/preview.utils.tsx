import {
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  FolderOpenOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import type { TFunction } from 'i18next';
import type { AppStoreState } from '@renderer/store/app-store.types';
import type { PreviewMetric, PreviewModel } from '@renderer/components/preview/preview.types';
import { buildOutputPreviewName } from '@renderer/utils/file-utils';
import {
  getRequestedEncoderBackendLabel,
  getResolvedEncoderBackendLabel,
} from '@renderer/utils/encoder-presentation';

type PreviewState = Pick<
  AppStoreState,
  'selectedFiles' | 'outputDirectory' | 'settings' | 'jobMode' | 'jobs'
>;

export const buildPreviewModel = (state: PreviewState, t: TFunction): PreviewModel => {
  const { selectedFiles, outputDirectory, settings, jobMode, jobs } = state;
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

  return {
    totalSize,
    activeJob,
    latestCompletedJob,
    previewMode,
    previewSettings,
    previewSeedFile,
    previewOutputDirectory,
    latestOutputPath,
    previewName,
    previewStatus,
    inputCount: selectedFiles.length || activeJob?.files.length || 0,
  };
};

export const buildPreviewMetrics = (previewModel: PreviewModel, t: TFunction): PreviewMetric[] => [
  {
    key: 'inputs',
    title: t('preview.metrics.inputVideos'),
    value: previewModel.inputCount,
    prefix: <ClockCircleOutlined />,
  },
  {
    key: 'format',
    title: t('preview.metrics.format'),
    value: previewModel.previewSettings.outputFormat.toUpperCase(),
    prefix: <DeploymentUnitOutlined />,
  },
  {
    key: 'backend',
    title: t('preview.metrics.backend'),
    value: previewModel.activeJob?.resolvedEncoderBackend
      ? getResolvedEncoderBackendLabel(previewModel.activeJob.resolvedEncoderBackend)
      : getRequestedEncoderBackendLabel(previewModel.previewSettings.encoderBackend),
    prefix: <RadarChartOutlined />,
  },
  {
    key: 'delivery',
    title: t('preview.metrics.delivery'),
    value:
      previewModel.previewMode === 'merge' ? t('preview.delivery.merge') : t('preview.delivery.compress'),
    prefix: <FolderOpenOutlined />,
  },
];
