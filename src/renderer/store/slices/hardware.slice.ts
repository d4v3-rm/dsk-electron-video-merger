import type { AppStoreSlice, HardwareSlice } from '@renderer/store/app-store.types';
import {
  DEFAULT_HARDWARE_ACCELERATION_PROFILE,
  UNAVAILABLE_HARDWARE_ACCELERATION_PROFILE,
} from '@renderer/store/app-store.constants';
import { api } from '@renderer/services/ipc';

export const createHardwareSlice: AppStoreSlice<HardwareSlice> = (set) => ({
  hardwareAccelerationProfile: DEFAULT_HARDWARE_ACCELERATION_PROFILE,
  hardwareAccelerationLoaded: false,

  refreshHardwareAccelerationProfile: async () => {
    try {
      const hardwareAccelerationProfile = await api.getHardwareAccelerationProfile();
      set({ hardwareAccelerationProfile, hardwareAccelerationLoaded: true });
    } catch {
      set({
        hardwareAccelerationLoaded: true,
        hardwareAccelerationProfile: UNAVAILABLE_HARDWARE_ACCELERATION_PROFILE,
      });
    }
  },
});
