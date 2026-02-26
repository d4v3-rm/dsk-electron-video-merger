import {
  type CompressionPreset,
  NVENC_CQ_BY_PRESET,
  NVENC_PRESET_BY_PRESET,
  type OutputFormat,
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

export const buildTimingArgs = (
  videoTimingMode: VideoTimingMode,
  targetFrameRate: TargetFrameRate,
): string[] => {
  if (videoTimingMode === 'cfr') {
    return ['-vf', `fps=${resolveFrameRateLabel(targetFrameRate)}`];
  }

  return ['-fps_mode', 'passthrough'];
};
