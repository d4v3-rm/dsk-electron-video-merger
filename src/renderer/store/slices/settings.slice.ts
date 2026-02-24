import type { AppStoreSlice, SettingsSlice } from '@renderer/store/app-store.types';
import { DEFAULT_CONVERSION_SETTINGS } from '@renderer/store/app-store.constants';

export const createSettingsSlice: AppStoreSlice<SettingsSlice> = (set) => ({
  settings: DEFAULT_CONVERSION_SETTINGS,

  setOutputFormat: (outputFormat) =>
    set((state) => ({
      settings: {
        ...state.settings,
        outputFormat,
        encoderBackend:
          outputFormat === 'webm' && state.settings.encoderBackend === 'nvidia'
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
