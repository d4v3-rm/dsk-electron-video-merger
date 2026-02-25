import ffmpegPath from 'ffmpeg-static';
import type {
  EncoderBackend,
  HardwareAccelerationProfile,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';
import { resolveBundledBinaryPath } from '@main/services/binary-path.utils';
import { createMediaProbeService, type MediaProbeService } from '@main/services/media-probe.service';
import { NVIDIA_SUPPORTED_FORMATS } from '@main/services/ffmpeg/ffmpeg.constants';
import {
  createDefaultHardwareAccelerationProfile,
  detectHardwareAccelerationProfileSafely,
} from '@main/services/ffmpeg/ffmpeg-hardware.utils';
import {
  getCompressionProcessingLabel,
  getMergeProcessingLabel,
  processMergedInputs,
  processSingleInputTranscode,
} from '@main/services/ffmpeg/ffmpeg-transcode.utils';
import type { ProcessSingleCompressionOptions, ProcessSingleMergeOptions } from '@main/services/ffmpeg.types';

export interface FfmpegService {
  getHardwareAccelerationProfile: () => Promise<HardwareAccelerationProfile>;
  resolveEncoderBackend: (
    requestedBackend: EncoderBackend,
    format: OutputFormat,
    hardwareProfile: HardwareAccelerationProfile,
  ) => ResolvedEncoderBackend;
  processSingleMerge: (options: ProcessSingleMergeOptions) => Promise<string>;
  processSingleCompression: (options: ProcessSingleCompressionOptions) => Promise<string>;
}

export const createFfmpegService = (
  mediaProbeService: MediaProbeService = createMediaProbeService(),
): FfmpegService => {
  const ffmpegBinary = resolveBundledBinaryPath(ffmpegPath);
  let hardwareAccelerationProfilePromise: Promise<HardwareAccelerationProfile> | null = null;

  const getHardwareAccelerationProfile = async (): Promise<HardwareAccelerationProfile> => {
    if (!ffmpegBinary) {
      return createDefaultHardwareAccelerationProfile('FFmpeg is not available in the current runtime.');
    }

    if (!hardwareAccelerationProfilePromise) {
      hardwareAccelerationProfilePromise = detectHardwareAccelerationProfileSafely(
        ffmpegBinary,
        NVIDIA_SUPPORTED_FORMATS,
      );
    }

    return hardwareAccelerationProfilePromise;
  };

  const resolveEncoderBackend = (
    requestedBackend: EncoderBackend,
    format: OutputFormat,
    hardwareProfile: HardwareAccelerationProfile,
  ): ResolvedEncoderBackend => {
    if (!NVIDIA_SUPPORTED_FORMATS.includes(format)) {
      return 'cpu';
    }

    if (requestedBackend === 'cpu') {
      return 'cpu';
    }

    if (requestedBackend === 'nvidia' && hardwareProfile.nvidia.available) {
      return 'nvidia';
    }

    if (requestedBackend === 'auto' && hardwareProfile.nvidia.available) {
      return 'nvidia';
    }

    return 'cpu';
  };
  const processSingleMerge = async ({
    inputPaths,
    outputPath,
    format,
    compression,
    resolvedEncoderBackend,
    videoTimingMode,
    targetFrameRate,
    onProgress,
  }: ProcessSingleMergeOptions): Promise<string> => {
    if (inputPaths.length === 1) {
      return processSingleInputTranscode({
        ffmpegBinary,
        mediaProbeService,
        inputPath: inputPaths[0],
        outputPath,
        format,
        compression,
        resolvedEncoderBackend,
        videoTimingMode,
        targetFrameRate,
        onProgress,
        processingLabel: getMergeProcessingLabel(format, resolvedEncoderBackend),
      });
    }

    return processMergedInputs({
      ffmpegBinary,
      mediaProbeService,
      inputPaths,
      outputPath,
      format,
      compression,
      resolvedEncoderBackend,
      videoTimingMode,
      targetFrameRate,
      onProgress,
      processingLabel: getMergeProcessingLabel(format, resolvedEncoderBackend),
    });
  };

  const processSingleCompression = async ({
    inputPath,
    outputPath,
    format,
    compression,
    resolvedEncoderBackend,
    videoTimingMode,
    targetFrameRate,
    onProgress,
  }: ProcessSingleCompressionOptions): Promise<string> =>
    processSingleInputTranscode({
      ffmpegBinary,
      mediaProbeService,
      inputPath,
      outputPath,
      format,
      compression,
      resolvedEncoderBackend,
      videoTimingMode,
      targetFrameRate,
      onProgress,
      processingLabel: getCompressionProcessingLabel(format, resolvedEncoderBackend),
    });

  return {
    getHardwareAccelerationProfile,
    resolveEncoderBackend,
    processSingleMerge,
    processSingleCompression,
  };
};
