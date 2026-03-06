import {
  COMPRESSION_PRESETS,
  type CompressionPreset,
  type EncoderBackend,
  type HardwareAccelerationProfile,
  MPEG2_QUALITY_BY_PRESET,
  MPEG4_QUALITY_BY_PRESET,
  NVIDIA_SUPPORTED_OUTPUT_FORMATS,
  NVENC_CQ_BY_PRESET,
  type OutputFormat,
  OUTPUT_RESOLUTION_DIMENSIONS,
  OUTPUT_RESOLUTIONS,
  type OutputResolution,
  type OutputResolutionPreset,
  type ResolvedEncoderBackend,
  THEORA_QUALITY_BY_PRESET,
  type TargetFrameRate,
  type VideoTimingMode,
  VP9_CRF_BY_PRESET,
  X264_CRF_BY_PRESET,
} from '@shared/types';
import i18n from '@renderer/i18n';

interface CompressionParameters {
  primaryLabel: string;
  fallbackLabel?: string;
}

const NVIDIA_SUPPORTED_OUTPUTS: OutputFormat[] = [...NVIDIA_SUPPORTED_OUTPUT_FORMATS];
const OUTPUT_RESOLUTION_OPTIONS: OutputResolution[] = [...OUTPUT_RESOLUTIONS];

const isFixedOutputResolution = (
  outputResolution: OutputResolution,
): outputResolution is OutputResolutionPreset => outputResolution !== 'source';

export const getRequestedEncoderBackendLabel = (backend: EncoderBackend): string => {
  switch (backend) {
    case 'auto':
      return i18n.t('common.auto');
    case 'cpu':
      return i18n.t('common.cpu');
    case 'nvidia':
      return i18n.t('common.nvidiaNvenc');
    default:
      return backend;
  }
};

export const getResolvedEncoderBackendLabel = (backend: ResolvedEncoderBackend): string => {
  switch (backend) {
    case 'cpu':
      return i18n.t('common.cpu');
    case 'nvidia':
      return i18n.t('common.nvidiaNvenc');
    default:
      return backend;
  }
};

export const getOutputFormatLabel = (outputFormat: OutputFormat): string =>
  i18n.t(`formats.${outputFormat}.label`);

export const getOutputFormatCategoryLabel = (outputFormat: OutputFormat): string =>
  i18n.t(`formats.${outputFormat}.category`);

export const getOutputFormatDescription = (outputFormat: OutputFormat): string =>
  i18n.t(`formats.${outputFormat}.description`);

export const getOutputFormatCodecSummary = (outputFormat: OutputFormat): string =>
  i18n.t(`formats.${outputFormat}.codecs`);

export const getOutputFormatBackendSummary = (outputFormat: OutputFormat): string =>
  i18n.t(`formats.${outputFormat}.backend`);

export const getOutputFormatTechnicalLabel = (outputFormat: OutputFormat): string =>
  `${getOutputFormatLabel(outputFormat)} | ${getOutputFormatCodecSummary(outputFormat)}`;

export const getOutputResolutionLabel = (outputResolution: OutputResolution): string =>
  i18n.t(`resolutions.${outputResolution}.label`);

export const getOutputResolutionDescription = (outputResolution: OutputResolution): string =>
  i18n.t(`resolutions.${outputResolution}.description`);

export const getOutputResolutionTechnicalSummary = (outputResolution: OutputResolution): string => {
  if (!isFixedOutputResolution(outputResolution)) {
    return i18n.t('resolutions.source.technical');
  }

  const { width, height } = OUTPUT_RESOLUTION_DIMENSIONS[outputResolution];
  return `${width} x ${height}`;
};

export const getOutputResolutionTechnicalLabel = (outputResolution: OutputResolution): string =>
  `${getOutputResolutionLabel(outputResolution)} | ${getOutputResolutionTechnicalSummary(outputResolution)}`;

export const getOutputResolutionBadges = (outputResolution: OutputResolution): string[] => {
  if (!isFixedOutputResolution(outputResolution)) {
    return [i18n.t('resolutions.source.badge'), i18n.t('resolutions.source.behavior')];
  }

  return [getOutputResolutionTechnicalSummary(outputResolution), i18n.t('resolutions.fixedCanvasBadge')];
};

export const getAvailableOutputResolutions = (): OutputResolution[] => [...OUTPUT_RESOLUTION_OPTIONS];

export const getCompressionPresetLabel = (preset: CompressionPreset): string =>
  i18n.t(`compression.${preset}.label`);

export const getCompressionPresetDescription = (preset: CompressionPreset): string =>
  i18n.t(`compression.${preset}.description`);

const getCompressionPresetParameters = (
  preset: CompressionPreset,
  outputFormat: OutputFormat,
): CompressionParameters => {
  switch (outputFormat) {
    case 'webm':
      return {
        primaryLabel: `VP9 CRF ${VP9_CRF_BY_PRESET[preset]}`,
      };
    case 'avi':
      return {
        primaryLabel: `MPEG-4 q:v ${MPEG4_QUALITY_BY_PRESET[preset]}`,
      };
    case 'ogv':
      return {
        primaryLabel: `Theora q:v ${THEORA_QUALITY_BY_PRESET[preset]}`,
      };
    case 'mpg':
      return {
        primaryLabel: `MPEG-2 q:v ${MPEG2_QUALITY_BY_PRESET[preset]}`,
      };
    default:
      return {
        primaryLabel: `x264 CRF ${X264_CRF_BY_PRESET[preset]}`,
        fallbackLabel: isNvidiaSupportedOutputFormat(outputFormat)
          ? `NVENC CQ ${NVENC_CQ_BY_PRESET[preset]}`
          : undefined,
      };
  }
};

export const getCompressionPresetTechnicalLabel = (
  preset: CompressionPreset,
  outputFormat: OutputFormat,
): string => {
  const parameters = getCompressionPresetParameters(preset, outputFormat);
  const detail = parameters.fallbackLabel
    ? `${parameters.primaryLabel} / ${parameters.fallbackLabel}`
    : parameters.primaryLabel;

  return `${getCompressionPresetLabel(preset)} | ${detail}`;
};

export const getCompressionPresetBadges = (
  preset: CompressionPreset,
  outputFormat: OutputFormat,
): string[] => {
  const parameters = getCompressionPresetParameters(preset, outputFormat);
  return [parameters.primaryLabel, parameters.fallbackLabel].filter((value): value is string =>
    Boolean(value),
  );
};

export const getAvailableCompressionPresets = (): CompressionPreset[] => [...COMPRESSION_PRESETS];

export const getVideoTimingModeLabel = (videoTimingMode: VideoTimingMode): string => {
  switch (videoTimingMode) {
    case 'preserve':
      return i18n.t('common.preserveTiming');
    case 'cfr':
      return i18n.t('common.constantFrameRate');
    default:
      return videoTimingMode;
  }
};

export const getTargetFrameRateLabel = (targetFrameRate: TargetFrameRate): string => `${targetFrameRate} fps`;

export const getVideoTimingDescription = (
  videoTimingMode: VideoTimingMode,
  targetFrameRate: TargetFrameRate,
): string =>
  videoTimingMode === 'preserve'
    ? i18n.t('composer.timingPreserveHelp')
    : i18n.t('composer.timingCfrHelp', { frameRate: getTargetFrameRateLabel(targetFrameRate) });

export const isNvidiaSupportedOutputFormat = (outputFormat: OutputFormat): boolean =>
  NVIDIA_SUPPORTED_OUTPUTS.includes(outputFormat);

export const getOutputFormatBadges = (outputFormat: OutputFormat): string[] => [
  getOutputFormatCategoryLabel(outputFormat),
  getOutputFormatCodecSummary(outputFormat),
  isNvidiaSupportedOutputFormat(outputFormat) ? i18n.t('common.nvencReady') : i18n.t('common.cpuOnly'),
];

export const getEncoderModeDescription = (
  outputFormat: OutputFormat,
  requestedEncoderBackend: EncoderBackend,
  hardwareAccelerationProfile: HardwareAccelerationProfile,
): string => {
  if (!isNvidiaSupportedOutputFormat(outputFormat)) {
    return i18n.t('composer.backendCpuOnlyFormat', {
      format: getOutputFormatLabel(outputFormat),
    });
  }

  if (requestedEncoderBackend === 'cpu') {
    return i18n.t('composer.encoderSoftwareOnly');
  }

  if (requestedEncoderBackend === 'nvidia' && hardwareAccelerationProfile.nvidia.available) {
    return i18n.t('composer.encoderNvencActive');
  }

  if (requestedEncoderBackend === 'nvidia') {
    return i18n.t('composer.encoderNvencFallback');
  }

  return hardwareAccelerationProfile.nvidia.available
    ? i18n.t('composer.encoderAutoGpu')
    : i18n.t('composer.encoderAutoCpu');
};
