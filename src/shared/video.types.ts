import {
  COMPRESSION_PRESETS,
  ENCODER_BACKENDS,
  OUTPUT_FORMATS,
  TARGET_FRAME_RATES,
  VIDEO_TIMING_MODES,
} from './video.constants';

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
export type CompressionPreset = (typeof COMPRESSION_PRESETS)[number];
export type EncoderBackend = (typeof ENCODER_BACKENDS)[number];
export type ResolvedEncoderBackend = 'cpu' | 'nvidia';
export type VideoTimingMode = (typeof VIDEO_TIMING_MODES)[number];
export type TargetFrameRate = (typeof TARGET_FRAME_RATES)[number];

export interface InputFileDTO {
  id: string;
  name: string;
  path: string;
  size: number;
}

export interface ConversionSettings {
  outputFormat: OutputFormat;
  compression: CompressionPreset;
  encoderBackend: EncoderBackend;
  videoTimingMode: VideoTimingMode;
  targetFrameRate: TargetFrameRate;
}
