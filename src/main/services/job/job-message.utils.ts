import type { JobCreationPayload, JobMode, ResolvedEncoderBackend } from '@shared/types';

export const buildQueuedMessage = (mode: JobMode, filesCount: number): string => {
  if (mode === 'compress') {
    return `Queued ${filesCount} video${filesCount === 1 ? '' : 's'} for compression.`;
  }

  return `Queued ${filesCount} clip${filesCount === 1 ? '' : 's'} for merge.`;
};

export const buildStartMessage = (
  mode: JobMode,
  requestedBackend: JobCreationPayload['settings']['encoderBackend'],
  resolvedBackend: ResolvedEncoderBackend,
): string => {
  const operationLabel = mode === 'merge' ? 'merge' : 'compression';

  if (requestedBackend === 'nvidia' && resolvedBackend === 'cpu') {
    return `NVIDIA NVENC is unavailable. Falling back to CPU ${operationLabel}.`;
  }

  if (resolvedBackend === 'nvidia') {
    return requestedBackend === 'auto'
      ? `Starting ${operationLabel} with automatic NVIDIA NVENC selection.`
      : `Starting ${operationLabel} with NVIDIA NVENC.`;
  }

  return `Starting ${operationLabel} with CPU encoding.`;
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
