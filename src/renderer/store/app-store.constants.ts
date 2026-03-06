import type { ConversionSettings, HardwareAccelerationProfile } from '@shared/types';

export const DEFAULT_HARDWARE_ACCELERATION_PROFILE: HardwareAccelerationProfile = {
  nvidia: {
    available: false,
    encoder: null,
    hardwareAccel: null,
    supportedOutputFormats: [],
    reason: 'Hardware detection pending.',
  },
};

export const UNAVAILABLE_HARDWARE_ACCELERATION_PROFILE: HardwareAccelerationProfile = {
  nvidia: {
    available: false,
    encoder: null,
    hardwareAccel: null,
    supportedOutputFormats: [],
    reason: 'Hardware detection is unavailable in this session.',
  },
};

export const DEFAULT_CONVERSION_SETTINGS: ConversionSettings = {
  outputFormat: 'mp4',
  compression: 'balanced',
  encoderBackend: 'auto',
  videoTimingMode: 'preserve',
  targetFrameRate: 30,
};
