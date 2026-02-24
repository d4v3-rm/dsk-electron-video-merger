import type {
  OutputFormat,
  ResolvedEncoderBackend,
  TargetFrameRate,
  VideoTimingMode,
} from '@shared/types';
import type { MediaProbeService } from '@main/services/media-probe.service';
import type {
  JobProgressCallback,
  ProcessSingleCompressionOptions,
  ProcessSingleMergeOptions,
} from '@main/services/ffmpeg.types';
import { buildEncoderArgs, buildTimingArgs } from '@main/services/ffmpeg/ffmpeg-command.utils';
import {
  buildMergeFilterGraph,
  resolveSegmentDurationMs,
} from '@main/services/ffmpeg/ffmpeg-merge-filter.utils';
import { runFfMpeg } from '@main/services/ffmpeg/ffmpeg-process.utils';

interface ProcessSingleInputTranscodeOptions {
  ffmpegBinary: string | null;
  mediaProbeService: MediaProbeService;
  inputPath: string;
  outputPath: string;
  format: OutputFormat;
  compression: ProcessSingleCompressionOptions['compression'];
  resolvedEncoderBackend: ResolvedEncoderBackend;
  videoTimingMode: VideoTimingMode;
  targetFrameRate: TargetFrameRate;
  onProgress: JobProgressCallback;
  processingLabel: string;
}

interface ProcessMergedInputsOptions {
  ffmpegBinary: string | null;
  mediaProbeService: MediaProbeService;
  inputPaths: string[];
  outputPath: string;
  format: ProcessSingleMergeOptions['format'];
  compression: ProcessSingleMergeOptions['compression'];
  resolvedEncoderBackend: ResolvedEncoderBackend;
  videoTimingMode: VideoTimingMode;
  targetFrameRate: TargetFrameRate;
  onProgress: JobProgressCallback;
  processingLabel: string;
}

export const getMergeProcessingLabel = (
  format: OutputFormat,
  resolvedEncoderBackend: ResolvedEncoderBackend,
): string =>
  resolvedEncoderBackend === 'nvidia'
    ? 'Encoding merged output with NVIDIA NVENC'
    : format === 'webm'
      ? 'Encoding merged VP9 output on CPU'
      : 'Encoding merged output on CPU';

export const getCompressionProcessingLabel = (
  format: OutputFormat,
  resolvedEncoderBackend: ResolvedEncoderBackend,
): string =>
  resolvedEncoderBackend === 'nvidia'
    ? 'Compressing with NVIDIA NVENC'
    : format === 'webm'
      ? 'Compressing VP9 output on CPU'
      : 'Compressing on CPU';

export const processSingleInputTranscode = async ({
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
  processingLabel,
}: ProcessSingleInputTranscodeOptions): Promise<string> => {
  const fileInfo = await mediaProbeService.getFileInfo(inputPath);
  if (!fileInfo?.video) {
    throw new Error(`Unable to read the primary video stream from ${inputPath}.`);
  }

  const encoder = buildEncoderArgs(format, compression, resolvedEncoderBackend, Boolean(fileInfo.audio));
  const timingArgs = buildTimingArgs(videoTimingMode, targetFrameRate);
  const commandArgs = [
    '-y',
    '-fflags',
    '+genpts',
    '-i',
    inputPath,
    '-map',
    '0:v:0',
    '-map',
    '0:a?',
    '-sn',
    '-dn',
    ...timingArgs,
    ...encoder.args,
    '-avoid_negative_ts',
    'make_zero',
    outputPath,
  ];

  await runFfMpeg(ffmpegBinary, commandArgs, onProgress, processingLabel, fileInfo.durationMs ?? undefined);
  return outputPath;
};

export const processMergedInputs = async ({
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
  processingLabel,
}: ProcessMergedInputsOptions): Promise<string> => {
  const filesInfo = await mediaProbeService.getFilesInfo(inputPaths);
  if (!filesInfo || filesInfo.some((fileInfo) => !fileInfo.video)) {
    throw new Error('Unable to inspect one or more input video streams before merge.');
  }

  const inputArgs = inputPaths.flatMap((inputPath) => ['-fflags', '+genpts', '-i', inputPath]);
  const totalDurationMs = filesInfo.reduce((total, fileInfo) => total + resolveSegmentDurationMs(fileInfo), 0);
  const mergeFilter = buildMergeFilterGraph(filesInfo, videoTimingMode, targetFrameRate);
  const encoder = buildEncoderArgs(format, compression, resolvedEncoderBackend, mergeFilter.hasAudio);
  const commandArgs = [
    '-y',
    ...inputArgs,
    '-filter_complex',
    mergeFilter.filterComplex,
    '-map',
    mergeFilter.videoOutputLabel,
    ...(mergeFilter.audioOutputLabel ? ['-map', mergeFilter.audioOutputLabel] : []),
    '-sn',
    '-dn',
    '-fps_mode',
    'passthrough',
    ...encoder.args,
    '-avoid_negative_ts',
    'make_zero',
    outputPath,
  ];

  await runFfMpeg(ffmpegBinary, commandArgs, onProgress, processingLabel, totalDurationMs);
  return outputPath;
};
