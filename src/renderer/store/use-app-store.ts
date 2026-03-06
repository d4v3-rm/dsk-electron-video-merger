import { create } from 'zustand';
import type { AppStoreState } from '@renderer/store/app-store.types';
import { createHardwareSlice } from '@renderer/store/slices/hardware.slice';
import { createJobsSlice } from '@renderer/store/slices/jobs.slice';
import { createSettingsSlice } from '@renderer/store/slices/settings.slice';
import { createWorkspaceSlice } from '@renderer/store/slices/workspace.slice';

export const useAppStore = create<AppStoreState>()((...args) => ({
  ...createWorkspaceSlice(...args),
  ...createSettingsSlice(...args),
  ...createHardwareSlice(...args),
  ...createJobsSlice(...args),
}));
