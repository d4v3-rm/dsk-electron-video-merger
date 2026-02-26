import {
  type CompressionPreset,
  type OutputFormat,
  MPEG2_QUALITY_BY_PRESET,
  MPEG4_QUALITY_BY_PRESET,
  NVIDIA_SUPPORTED_OUTPUT_FORMATS,
  THEORA_QUALITY_BY_PRESET,
  VP9_CRF_BY_PRESET,
  X264_CRF_BY_PRESET,
} from '@shared/types';

interface CpuEncoderProfile {
  videoArgs: string[];
  audioArgs: string[];
  muxArgs?: string[];
  qualityFlag: '-crf' | '-q:v';
  qualityByPreset: Record<CompressionPreset, string>;
}

interface NvidiaEncoderProfile {
  videoArgs: string[];
  audioArgs: string[];
  muxArgs?: string[];
}

export const CPU_ENCODER_BY_FORMAT: Record<OutputFormat, CpuEncoderProfile> = {
  mp4: {
    videoArgs: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '160k'],
    muxArgs: ['-movflags', '+faststart'],
    qualityFlag: '-crf',
    qualityByPreset: X264_CRF_BY_PRESET,
  },
  mov: {
    videoArgs: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '160k'],
    muxArgs: ['-movflags', '+faststart'],
    qualityFlag: '-crf',
    qualityByPreset: X264_CRF_BY_PRESET,
  },
  mkv: {
    videoArgs: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '160k'],
    qualityFlag: '-crf',
    qualityByPreset: X264_CRF_BY_PRESET,
  },
  webm: {
    videoArgs: [
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
    ],
    audioArgs: ['-c:a', 'libopus', '-b:a', '128k'],
    qualityFlag: '-crf',
    qualityByPreset: VP9_CRF_BY_PRESET,
  },
  flv: {
    videoArgs: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '128k'],
    qualityFlag: '-crf',
    qualityByPreset: X264_CRF_BY_PRESET,
  },
  avi: {
    videoArgs: ['-c:v', 'mpeg4', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'libmp3lame', '-b:a', '192k'],
    qualityFlag: '-q:v',
    qualityByPreset: MPEG4_QUALITY_BY_PRESET,
  },
  ogv: {
    videoArgs: ['-c:v', 'libtheora', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'libvorbis', '-q:a', '5'],
    qualityFlag: '-q:v',
    qualityByPreset: THEORA_QUALITY_BY_PRESET,
  },
  mpg: {
    videoArgs: ['-c:v', 'mpeg2video', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'mp2', '-b:a', '192k'],
    qualityFlag: '-q:v',
    qualityByPreset: MPEG2_QUALITY_BY_PRESET,
  },
};

export const NVIDIA_ENCODER_BY_FORMAT: Partial<Record<OutputFormat, NvidiaEncoderProfile>> = {
  mp4: {
    videoArgs: ['-c:v', 'h264_nvenc', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '160k'],
    muxArgs: ['-movflags', '+faststart'],
  },
  mov: {
    videoArgs: ['-c:v', 'h264_nvenc', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '160k'],
    muxArgs: ['-movflags', '+faststart'],
  },
  mkv: {
    videoArgs: ['-c:v', 'h264_nvenc', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '160k'],
  },
  flv: {
    videoArgs: ['-c:v', 'h264_nvenc', '-pix_fmt', 'yuv420p'],
    audioArgs: ['-c:a', 'aac', '-b:a', '128k'],
  },
};

export const NVIDIA_SUPPORTED_FORMATS: OutputFormat[] = [...NVIDIA_SUPPORTED_OUTPUT_FORMATS];
export const PROGRESS_LOG_BUCKET_SIZE = 10;
export const PROGRESS_SEGMENT_SEPARATOR = ' | ';
export const DEFAULT_AUDIO_SAMPLE_RATE = 48_000;
export const DEFAULT_AUDIO_CHANNEL_LAYOUT = 'stereo';
