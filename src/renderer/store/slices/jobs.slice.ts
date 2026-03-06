import type { JobCreationPayload } from '@shared/types';
import { api } from '@renderer/services/ipc';
import type { AppStoreSlice, JobsSlice } from '@renderer/store/app-store.types';
import { upsertJobProgress } from '@renderer/store/app-store.utils';

export const createJobsSlice: AppStoreSlice<JobsSlice> = (set, get) => ({
  jobs: [],
  loading: false,
  loaded: false,

  refreshJobs: async () => {
    try {
      const jobs = await api.getJobs();
      set({ jobs, loaded: true });
    } catch {
      set({ loaded: true, jobs: [] });
    }
  },

  createJob: async () => {
    const { jobMode, selectedFiles, settings, outputDirectory, loading } = get();
    if (selectedFiles.length === 0 || loading) {
      return null;
    }

    set({ loading: true });

    const payload: JobCreationPayload = {
      mode: jobMode,
      filePaths: selectedFiles.map((file) => file.path),
      settings,
      outputDirectory: outputDirectory ?? undefined,
    };

    try {
      const job = await api.createJob(payload);

      set((state) => ({
        jobs: [job, ...state.jobs],
        selectedFiles: [],
        loading: false,
      }));

      return job;
    } catch {
      set({ loading: false });
      return null;
    }
  },

  upsertJobProgress: (payload) => {
    set((state) => ({
      jobs: upsertJobProgress(state.jobs, payload),
    }));
  },
});
