import type {
  EncoderBackend,
  HardwareAccelerationProfile,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';

export const requestedEncoderBackendLabel: Record<EncoderBackend, string> = {
  auto: 'Auto',
  cpu: 'CPU',
  nvidia: 'NVIDIA NVENC',
};

export const resolvedEncoderBackendLabel: Record<ResolvedEncoderBackend, string> = {
  cpu: 'CPU',
  nvidia: 'NVIDIA NVENC',
};

export const isNvidiaSupportedOutputFormat = (outputFormat: OutputFormat): boolean => outputFormat !== 'webm';

export const getEncoderModeDescription = (
  outputFormat: OutputFormat,
  requestedEncoderBackend: EncoderBackend,
  hardwareAccelerationProfile: HardwareAccelerationProfile,
): string => {
  if (!isNvidiaSupportedOutputFormat(outputFormat)) {
    return 'WebM usa sempre il path CPU in questa versione.';
  }

  if (requestedEncoderBackend === 'cpu') {
    return 'Transcodifica software via CPU.';
  }

  if (requestedEncoderBackend === 'nvidia' && hardwareAccelerationProfile.nvidia.available) {
    return 'NVENC verra` usato per la transcodifica finale.';
  }

  if (requestedEncoderBackend === 'nvidia') {
    return 'NVENC non disponibile: il job fara` fallback automatico su CPU.';
  }

  return hardwareAccelerationProfile.nvidia.available
    ? 'Auto selezionera` NVIDIA NVENC per MP4 e MOV, altrimenti CPU.'
    : 'Auto restera` su CPU finche` NVENC non e` disponibile.';
};
