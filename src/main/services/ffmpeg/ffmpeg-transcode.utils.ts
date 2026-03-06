import type {
  OutputFormat,
  OutputResolution,
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
import {
  buildEncoderArgs,
  buildSingleInputVideoTransformArgs,
} from '@main/services/ffmpeg/ffmpeg-command.utils';
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
  outputResolution: OutputResolution;
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
  outputResolution: OutputResolution;
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
    ? `Encoding merged ${format.toUpperCase()} output with NVIDIA NVENC`
    : `Encoding merged ${format.toUpperCase()} output on CPU`;

export const getCompressionProcessingLabel = (
  format: OutputFormat,
  resolvedEncoderBackend: ResolvedEncoderBackend,
): string =>
  resolvedEncoderBackend === 'nvidia'
    ? `Compressing to ${format.toUpperCase()} with NVIDIA NVENC`
    : `Compressing to ${format.toUpperCase()} on CPU`;

export const processSingleInputTranscode = async ({
  ffmpegBinary,
  mediaProbeService,
  inputPath,
  outputPath,
  format,
  outputResolution,
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
  const videoTransformArgs = buildSingleInputVideoTransformArgs(
    fileInfo.video.width,
    fileInfo.video.height,
    outputResolution,
    videoTimingMode,
    targetFrameRate,
  );
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
    ...videoTransformArgs.filterArgs,
    ...encoder.args,
    ...videoTransformArgs.fpsArgs,
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
  outputResolution,
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
  const totalDurationMs = filesInfo.reduce(
    (total, fileInfo) => total + resolveSegmentDurationMs(fileInfo),
    0,
  );
  const mergeFilter = buildMergeFilterGraph(filesInfo, outputResolution, videoTimingMode, targetFrameRate);
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
