import type { CompressionPreset, OutputFormat } from '@shared/types';
import type { EncoderArgs } from '@main/services/ffmpeg.types';

export const CPU_CRF_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '23',
  strong: '28',
};

export const VP9_CRF_BY_PRESET: Record<CompressionPreset, string> = {
  light: '28',
  balanced: '32',
  strong: '36',
};

export const NVENC_CQ_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '22',
  strong: '28',
};

export const NVENC_PRESET_BY_PRESET: Record<CompressionPreset, string> = {
  light: 'p6',
  balanced: 'p5',
  strong: 'p4',
};

export const CPU_ENCODER_BY_FORMAT: Record<OutputFormat, EncoderArgs> = {
  mp4: {
    args: [
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '160k',
      '-movflags',
      '+faststart',
    ],
  },
  mov: {
    args: [
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '160k',
      '-movflags',
      '+faststart',
    ],
  },
  mkv: {
    args: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k'],
  },
  webm: {
    args: [
      '-c:v',
      'libvpx-vp9',
      '-pix_fmt',
      'yuv420p',
      '-b:v',
      '0',
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      '-row-mt',
      '1',
      '-c:a',
      'libopus',
    ],
  },
};

export const NVIDIA_SUPPORTED_FORMATS: OutputFormat[] = ['mp4', 'mov', 'mkv'];
export const PROGRESS_LOG_BUCKET_SIZE = 10;
export const PROGRESS_SEGMENT_SEPARATOR = ' | ';
export const DEFAULT_AUDIO_SAMPLE_RATE = 48_000;
export const DEFAULT_AUDIO_CHANNEL_LAYOUT = 'stereo';
