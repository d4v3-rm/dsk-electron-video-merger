import { create } from 'zustand';
import type { CompressionPreset, ConversionSettings, Job, JobProgressPayload, JobType, OutputFormat } from '../../shared/types';
import { api } from '../services/ipc';

export type SelectedVideo = {
  id: string;
  name: string;
  path: string;
  size: number;
};

interface AppState {
  selectedFiles: SelectedVideo[];
  jobs: Job[];
  jobType: JobType;
  settings: ConversionSettings;
  loading: boolean;
  loaded: boolean;
  refreshJobs: () => Promise<void>;
  selectVideoFiles: () => Promise<void>;
  setJobType: (type: JobType) => void;
  setOutputFormat: (outputFormat: OutputFormat) => void;
  setCompression: (compression: CompressionPreset) => void;
  removeSelectedFile: (id: string) => void;
  createJob: () => Promise<void>;
  upsertJobProgress: (payload: JobProgressPayload) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedFiles: [],
  jobs: [],
  jobType: 'single',
  settings: {
    outputFormat: 'mp4',
    compression: 'balanced'
  },
  loading: false,
  loaded: false,

  refreshJobs: async () => {
    const jobs = await api.getJobs();
    set({ jobs, loaded: true });
  },

  selectVideoFiles: async () => {
    const files = await api.selectVideoFiles();
    const nextFiles = [...get().selectedFiles];
    files.forEach((f) => {
      if (!nextFiles.some((existing) => existing.path === f.path)) {
        nextFiles.push(f);
      }
    });
    set({ selectedFiles: nextFiles });
  },

  setJobType: (type) => set({ jobType: type }),
  setOutputFormat: (outputFormat) => set({ settings: { ...get().settings, outputFormat } }),
  setCompression: (compression) => set({ settings: { ...get().settings, compression } }),

  removeSelectedFile: (id) => {
    set({ selectedFiles: get().selectedFiles.filter((f) => f.id !== id) });
  },

  createJob: async () => {
    const { selectedFiles, jobType, settings, loading } = get();
    if (selectedFiles.length === 0 || loading) {
      return;
    }

    set({ loading: true });
    const payload = {
      filePaths: selectedFiles.map((f) => f.path),
      settings
    };

    const job =
      jobType === 'single' ? await api.createSingleJob(payload) : await api.createBulkJob(payload);

    set({
      jobs: [job, ...get().jobs],
      selectedFiles: [],
      loading: false
    });
  },

  upsertJobProgress: (payload) => {
    set({
      jobs: get()
        .jobs
        .map((job) =>
          job.id === payload.jobId
            ? {
                ...job,
                status: payload.status,
                progress: payload.progress,
                message: payload.message,
                outputPaths: payload.outputPath && !job.outputPaths.includes(payload.outputPath)
                  ? [...job.outputPaths, payload.outputPath]
                  : job.outputPaths,
                error: payload.error
              }
            : job
        )
        .sort((a, b) => b.updatedAt - a.updatedAt)
    });
  }
}));
