import type {
  CompressionPreset,
  EncoderBackend,
  HardwareAccelerationProfile,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';
import i18n from '@renderer/i18n';

const COMPRESSION_PARAMETERS: Record<CompressionPreset, { x264: number; nvenc: number; vp9: number }> = {
  light: {
    x264: 18,
    nvenc: 18,
    vp9: 28,
  },
  balanced: {
    x264: 23,
    nvenc: 22,
    vp9: 32,
  },
  strong: {
    x264: 28,
    nvenc: 28,
    vp9: 36,
  },
};

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

export const getCompressionPresetLabel = (preset: CompressionPreset): string =>
  i18n.t(`compression.${preset}`);

export const getCompressionPresetParameters = (preset: CompressionPreset) => COMPRESSION_PARAMETERS[preset];

export const getCompressionPresetTechnicalLabel = (preset: CompressionPreset): string => {
  const parameters = COMPRESSION_PARAMETERS[preset];

  return `${getCompressionPresetLabel(preset)} � H.264 CRF ${parameters.x264} / NVENC CQ ${parameters.nvenc} / VP9 CRF ${parameters.vp9}`;
};

export const isNvidiaSupportedOutputFormat = (outputFormat: OutputFormat): boolean => outputFormat !== 'webm';

export const getEncoderModeDescription = (
  outputFormat: OutputFormat,
  requestedEncoderBackend: EncoderBackend,
  hardwareAccelerationProfile: HardwareAccelerationProfile,
): string => {
  if (!isNvidiaSupportedOutputFormat(outputFormat)) {
    return i18n.t('composer.backendWebm');
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
