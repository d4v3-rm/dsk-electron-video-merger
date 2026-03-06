export const OUTPUT_FORMATS = ['mp4', 'mov', 'mkv', 'webm', 'flv', 'avi', 'ogv', 'mpg'] as const;

export const COMPRESSION_PRESETS = ['master', 'high', 'balanced', 'web', 'small'] as const;

export const ENCODER_BACKENDS = ['auto', 'cpu', 'nvidia'] as const;

export const VIDEO_TIMING_MODES = ['preserve', 'cfr'] as const;

export const TARGET_FRAME_RATES = [24, 25, 30, 48, 50, 60, 120] as const;

export const NVIDIA_SUPPORTED_OUTPUT_FORMATS = ['mp4', 'mov', 'mkv', 'flv'] as const;

export const X264_CRF_BY_PRESET = {
  master: '16',
  high: '20',
  balanced: '23',
  web: '27',
  small: '31',
} as const;

export const VP9_CRF_BY_PRESET = {
  master: '26',
  high: '29',
  balanced: '32',
  web: '35',
  small: '39',
} as const;

export const NVENC_CQ_BY_PRESET = {
  master: '16',
  high: '19',
  balanced: '22',
  web: '26',
  small: '30',
} as const;

export const NVENC_PRESET_BY_PRESET = {
  master: 'p7',
  high: 'p6',
  balanced: 'p5',
  web: 'p4',
  small: 'p3',
} as const;

export const MPEG4_QUALITY_BY_PRESET = {
  master: '2',
  high: '4',
  balanced: '5',
  web: '7',
  small: '9',
} as const;

export const THEORA_QUALITY_BY_PRESET = {
  master: '9',
  high: '8',
  balanced: '7',
  web: '6',
  small: '5',
} as const;

export const MPEG2_QUALITY_BY_PRESET = {
  master: '2',
  high: '4',
  balanced: '5',
  web: '7',
  small: '9',
} as const;
