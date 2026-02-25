import type {
  CompressionPreset,
  OutputFormat,
  ResolvedEncoderBackend,
  TargetFrameRate,
  VideoTimingMode,
} from '@shared/types';
import type { EncoderArgs } from '@main/services/ffmpeg.types';
import {
  CPU_CRF_BY_PRESET,
  CPU_ENCODER_BY_FORMAT,
  NVIDIA_SUPPORTED_FORMATS,
  NVENC_CQ_BY_PRESET,
  NVENC_PRESET_BY_PRESET,
  VP9_CRF_BY_PRESET,
} from '@main/services/ffmpeg/ffmpeg.constants';

export const resolveFrameRateLabel = (targetFrameRate: TargetFrameRate): string => `${targetFrameRate}`;

export const buildEncoderArgs = (
  format: OutputFormat,
  compression: CompressionPreset,
  resolvedEncoderBackend: ResolvedEncoderBackend,
  hasAudio: boolean,
): EncoderArgs => {
  if (resolvedEncoderBackend === 'nvidia' && NVIDIA_SUPPORTED_FORMATS.includes(format)) {
    const baseArgs = [
      '-c:v',
      'h264_nvenc',
      '-preset:v',
      NVENC_PRESET_BY_PRESET[compression],
      '-rc:v',
      'vbr',
      '-cq:v',
      NVENC_CQ_BY_PRESET[compression],
      '-b:v',
      '0',
      '-pix_fmt',
      'yuv420p',
    ];

    if (hasAudio) {
      baseArgs.push('-c:a', 'aac', '-b:a', '160k');
    } else {
      baseArgs.push('-an');
    }

    return {
      args: format === 'mp4' || format === 'mov' ? [...baseArgs, '-movflags', '+faststart'] : baseArgs,
    };
  }

  const cpuEncoder = CPU_ENCODER_BY_FORMAT[format];
  if (format === 'webm') {
    return {
      args: [
        ...cpuEncoder.args.filter((arg) => (hasAudio ? true : !['-c:a', 'libopus'].includes(arg))),
        ...(hasAudio ? [] : ['-an']),
        '-crf',
        VP9_CRF_BY_PRESET[compression],
      ],
    };
  }

  return {
    args: [
      ...cpuEncoder.args.filter((arg) => (hasAudio ? true : !['-c:a', 'aac', '-b:a', '160k'].includes(arg))),
      ...(hasAudio ? [] : ['-an']),
      '-crf',
      CPU_CRF_BY_PRESET[compression],
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
