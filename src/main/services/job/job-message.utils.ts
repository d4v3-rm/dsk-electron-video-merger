import type { JobCreationPayload, JobMode, ResolvedEncoderBackend } from '@shared/types';

const buildTimingSuffix = (settings: JobCreationPayload['settings']): string =>
  settings.videoTimingMode === 'cfr'
    ? ` Output will be normalized to ${settings.targetFrameRate} fps.`
    : ' Source timing will be preserved whenever possible.';

export const buildQueuedMessage = (mode: JobMode, filesCount: number): string => {
  if (mode === 'compress') {
    return `Queued ${filesCount} video${filesCount === 1 ? '' : 's'} for compression.`;
  }

  return `Queued ${filesCount} clip${filesCount === 1 ? '' : 's'} for merge.`;
};

export const buildStartMessage = (
  mode: JobMode,
  settings: JobCreationPayload['settings'],
  resolvedBackend: ResolvedEncoderBackend,
): string => {
  const operationLabel = mode === 'merge' ? 'merge' : 'compression';
  const timingSuffix = buildTimingSuffix(settings);

  if (settings.encoderBackend === 'nvidia' && resolvedBackend === 'cpu') {
    return `NVIDIA NVENC is unavailable. Falling back to CPU ${operationLabel}.${timingSuffix}`;
  }

  if (resolvedBackend === 'nvidia') {
    return settings.encoderBackend === 'auto'
      ? `Starting ${operationLabel} with automatic NVIDIA NVENC selection.${timingSuffix}`
      : `Starting ${operationLabel} with NVIDIA NVENC.${timingSuffix}`;
  }

  return `Starting ${operationLabel} with CPU encoding.${timingSuffix}`;
};

export const buildCompletionMessage = (mode: JobMode, outputCount: number): string => {
  if (mode === 'compress') {
    return outputCount === 1
      ? 'Compression completed.'
      : `Compression completed. Generated ${outputCount} files.`;
  }

  return 'Merge completed.';
};

export const buildSuccessLogMessage = (mode: JobMode, outputCount: number): string => {
  if (mode === 'compress') {
    return outputCount === 1
      ? 'Compression completed successfully.'
      : `Compression completed successfully. Generated ${outputCount} files.`;
  }

  return 'Merge completed successfully.';
};
