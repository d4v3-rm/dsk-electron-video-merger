import type { JobCreationPayload, JobMode, ResolvedEncoderBackend } from '@shared/types';

const buildTimingSuffix = (settings: JobCreationPayload['settings']): string =>
  settings.videoTimingMode === 'cfr'
    ? ` Output will be normalized to ${settings.targetFrameRate} fps.`
    : ' Source timing will be preserved whenever possible.';

const buildResolutionLabel = (settings: JobCreationPayload['settings']): string =>
  settings.outputResolution === 'source' ? 'source resolution' : settings.outputResolution;

const buildProfileSuffix = (settings: JobCreationPayload['settings']): string =>
  ` Deliverable: ${settings.outputFormat.toUpperCase()} at ${buildResolutionLabel(settings)} with the ${settings.compression} profile.`;

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
  const profileSuffix = buildProfileSuffix(settings);

  if (settings.encoderBackend === 'nvidia' && resolvedBackend === 'cpu') {
    return `NVIDIA NVENC is unavailable. Falling back to CPU ${operationLabel}.${profileSuffix}${timingSuffix}`;
  }

  if (resolvedBackend === 'nvidia') {
    return settings.encoderBackend === 'auto'
      ? `Starting ${operationLabel} with automatic NVIDIA NVENC selection.${profileSuffix}${timingSuffix}`
      : `Starting ${operationLabel} with NVIDIA NVENC.${profileSuffix}${timingSuffix}`;
  }

  return `Starting ${operationLabel} with CPU encoding.${profileSuffix}${timingSuffix}`;
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
