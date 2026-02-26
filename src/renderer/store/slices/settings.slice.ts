import { NVIDIA_SUPPORTED_OUTPUT_FORMATS } from '@shared/types';
import type { OutputFormat } from '@shared/types';
import type { AppStoreSlice, SettingsSlice } from '@renderer/store/app-store.types';
import { DEFAULT_CONVERSION_SETTINGS } from '@renderer/store/app-store.constants';

const NVIDIA_SUPPORTED_OUTPUTS: OutputFormat[] = [...NVIDIA_SUPPORTED_OUTPUT_FORMATS];

export const createSettingsSlice: AppStoreSlice<SettingsSlice> = (set) => ({
  settings: DEFAULT_CONVERSION_SETTINGS,

  setOutputFormat: (outputFormat) =>
    set((state) => ({
      settings: {
        ...state.settings,
        outputFormat,
        encoderBackend:
          !NVIDIA_SUPPORTED_OUTPUTS.includes(outputFormat) && state.settings.encoderBackend === 'nvidia'
            ? 'auto'
            : state.settings.encoderBackend,
      },
    })),

  setCompression: (compression) =>
    set((state) => ({
      settings: {
        ...state.settings,
        compression,
      },
    })),

  setEncoderBackend: (encoderBackend) =>
    set((state) => ({
      settings: {
        ...state.settings,
        encoderBackend,
      },
    })),

  setVideoTimingMode: (videoTimingMode) =>
    set((state) => ({
      settings: {
        ...state.settings,
        videoTimingMode,
      },
    })),

  setTargetFrameRate: (targetFrameRate) =>
    set((state) => ({
      settings: {
        ...state.settings,
        targetFrameRate,
      },
    })),
});
