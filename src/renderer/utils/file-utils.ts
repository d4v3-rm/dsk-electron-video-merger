import type { JobMode, OutputFormat } from '@shared/types';

export const formatBytes = (size: number): string => {
  const kilo = 1024;
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let current = size;

  while (current >= kilo && index < units.length - 1) {
    current /= kilo;
    index += 1;
  }

  return `${current.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export const getFileName = (filePath: string): string => {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.split('/').at(-1) ?? filePath;
};

export const stripExtension = (fileName: string): string => {
  const extensionIndex = fileName.lastIndexOf('.');
  return extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
};

export const buildMergedOutputName = (inputName: string | undefined, outputFormat: OutputFormat): string => {
  if (!inputName) {
    return `merged-output.${outputFormat}`;
  }

  return `${stripExtension(inputName)}-merged.${outputFormat}`;
};

export const buildCompressedOutputName = (
  inputName: string | undefined,
  outputFormat: OutputFormat,
): string => {
  if (!inputName) {
    return `compressed-output.${outputFormat}`;
  }

  return `${stripExtension(inputName)}-compressed.${outputFormat}`;
};

export const buildOutputPreviewName = (
  mode: JobMode,
  inputName: string | undefined,
  outputFormat: OutputFormat,
): string => {
  if (mode === 'compress') {
    return buildCompressedOutputName(inputName, outputFormat);
  }

  return buildMergedOutputName(inputName, outputFormat);
};
