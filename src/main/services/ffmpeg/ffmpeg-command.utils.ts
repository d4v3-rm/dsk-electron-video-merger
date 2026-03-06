import {
  type CompressionPreset,
  NVENC_CQ_BY_PRESET,
  NVENC_PRESET_BY_PRESET,
  type OutputFormat,
  OUTPUT_RESOLUTION_DIMENSIONS,
  type OutputResolution,
  type OutputResolutionPreset,
  type ResolvedEncoderBackend,
  type TargetFrameRate,
  type VideoTimingMode,
} from '@shared/types';
import type { EncoderArgs } from '@main/services/ffmpeg.types';
import {
  CPU_ENCODER_BY_FORMAT,
  NVIDIA_ENCODER_BY_FORMAT,
  NVIDIA_SUPPORTED_FORMATS,
} from '@main/services/ffmpeg/ffmpeg.constants';

export const resolveFrameRateLabel = (targetFrameRate: TargetFrameRate): string => `${targetFrameRate}`;

export const buildScalePadFilter = (targetWidth: number, targetHeight: number): string =>
  `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black,setsar=1`;

const isFixedOutputResolution = (
  outputResolution: OutputResolution,
): outputResolution is OutputResolutionPreset => outputResolution !== 'source';

export const resolveOutputResolutionDimensions = (
  outputResolution: OutputResolution,
  fallbackWidth: number,
  fallbackHeight: number,
): { width: number; height: number } => {
  if (!isFixedOutputResolution(outputResolution)) {
    return {
      width: fallbackWidth,
      height: fallbackHeight,
    };
  }

  return OUTPUT_RESOLUTION_DIMENSIONS[outputResolution];
};

const buildAudioArgs = (hasAudio: boolean, audioArgs: string[]): string[] => (hasAudio ? audioArgs : ['-an']);

export const buildEncoderArgs = (
  format: OutputFormat,
  compression: CompressionPreset,
  resolvedEncoderBackend: ResolvedEncoderBackend,
  hasAudio: boolean,
): EncoderArgs => {
  if (resolvedEncoderBackend === 'nvidia' && NVIDIA_SUPPORTED_FORMATS.includes(format)) {
    const nvidiaProfile = NVIDIA_ENCODER_BY_FORMAT[format];
    if (!nvidiaProfile) {
      throw new Error(`NVIDIA encoder profile is missing for ${format}.`);
    }

    return {
      args: [
        ...nvidiaProfile.videoArgs,
        '-preset:v',
        NVENC_PRESET_BY_PRESET[compression],
        '-rc:v',
        'vbr',
        '-cq:v',
        NVENC_CQ_BY_PRESET[compression],
        '-b:v',
        '0',
        ...buildAudioArgs(hasAudio, nvidiaProfile.audioArgs),
        ...(nvidiaProfile.muxArgs ?? []),
      ],
    };
  }

  const cpuEncoder = CPU_ENCODER_BY_FORMAT[format];
  return {
    args: [
      ...cpuEncoder.videoArgs,
      ...buildAudioArgs(hasAudio, cpuEncoder.audioArgs),
      cpuEncoder.qualityFlag,
      cpuEncoder.qualityByPreset[compression],
      ...(cpuEncoder.muxArgs ?? []),
    ],
  };
};

export const buildSingleInputVideoTransformArgs = (
  sourceWidth: number,
  sourceHeight: number,
  outputResolution: OutputResolution,
  videoTimingMode: VideoTimingMode,
  targetFrameRate: TargetFrameRate,
): { filterArgs: string[]; fpsArgs: string[] } => {
  const filterChain: string[] = [];

  if (isFixedOutputResolution(outputResolution)) {
    const { width, height } = resolveOutputResolutionDimensions(outputResolution, sourceWidth, sourceHeight);
    filterChain.push(buildScalePadFilter(width, height));
  }

  if (videoTimingMode === 'cfr') {
    filterChain.push(`fps=${resolveFrameRateLabel(targetFrameRate)}`);
  }

  return {
    filterArgs: filterChain.length > 0 ? ['-vf', filterChain.join(',')] : [],
    fpsArgs: videoTimingMode === 'preserve' ? ['-fps_mode', 'passthrough'] : [],
  };
};
