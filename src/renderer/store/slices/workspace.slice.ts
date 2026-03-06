import type { AppStoreSlice, WorkspaceSlice } from '@renderer/store/app-store.types';
import { api } from '@renderer/services/ipc';
import { appendUniqueFiles, moveSelectedFileInList } from '@renderer/store/app-store.utils';

export const createWorkspaceSlice: AppStoreSlice<WorkspaceSlice> = (set, get) => ({
  jobMode: 'merge',
  selectedFiles: [],
  outputDirectory: null,

  selectVideoFiles: async () => {
    try {
      const files = await api.selectVideoFiles();
      set((state) => ({
        selectedFiles: appendUniqueFiles(state.selectedFiles, files),
      }));
    } catch {
      // no-op: the Electron bridge may be unavailable while rendering outside Electron.
    }
  },

  selectOutputDirectory: async () => {
    try {
      const outputDirectory = await api.selectOutputDirectory();
      if (!outputDirectory) {
        return;
      }

      set({ outputDirectory });
    } catch {
      // no-op: the Electron bridge may be unavailable while rendering outside Electron.
    }
  },

  clearOutputDirectory: () => {
    set({ outputDirectory: null });
  },

  setJobMode: (jobMode) => {
    set({ jobMode });
  },

  clearSelectedFiles: () => {
    set({ selectedFiles: [] });
  },

  removeSelectedFile: (id) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((file) => file.id !== id),
    }));
  },

  moveSelectedFile: (id, direction) => {
    const selectedFiles = moveSelectedFileInList(get().selectedFiles, id, direction);
    set({ selectedFiles });
  },
});
