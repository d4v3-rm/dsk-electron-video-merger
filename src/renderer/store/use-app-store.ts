import { create } from 'zustand';
import type {
  CompressionPreset,
  ConversionSettings,
  Job,
  JobProgressPayload,
  OutputFormat,
} from '../../shared/types';
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
  settings: ConversionSettings;
  loading: boolean;
  loaded: boolean;
  refreshJobs: () => Promise<void>;
  selectVideoFiles: () => Promise<void>;
  setOutputFormat: (outputFormat: OutputFormat) => void;
  setCompression: (compression: CompressionPreset) => void;
  clearSelectedFiles: () => void;
  removeSelectedFile: (id: string) => void;
  moveSelectedFile: (id: string, direction: 'up' | 'down') => void;
  createJob: () => Promise<void>;
  upsertJobProgress: (payload: JobProgressPayload) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedFiles: [],
  jobs: [],
  settings: {
    outputFormat: 'mp4',
    compression: 'balanced',
  },
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

  selectVideoFiles: async () => {
    try {
      const files = await api.selectVideoFiles();
      const nextFiles = [...get().selectedFiles];
      files.forEach((file) => {
        if (!nextFiles.some((existing) => existing.path === file.path)) {
          nextFiles.push(file);
        }
      });
      set({ selectedFiles: nextFiles });
    } catch {
      // no-op: il bridge Electron potrebbe non essere disponibile in questa fase
    }
  },

  setOutputFormat: (outputFormat) => set({ settings: { ...get().settings, outputFormat } }),
  setCompression: (compression) => set({ settings: { ...get().settings, compression } }),

  clearSelectedFiles: () => {
    set({ selectedFiles: [] });
  },

  removeSelectedFile: (id) => {
    set({ selectedFiles: get().selectedFiles.filter((file) => file.id !== id) });
  },

  moveSelectedFile: (id, direction) => {
    const files = [...get().selectedFiles];
    const currentIndex = files.findIndex((file) => file.id === id);
    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= files.length) {
      return;
    }

    const [movedFile] = files.splice(currentIndex, 1);
    files.splice(targetIndex, 0, movedFile);
    set({ selectedFiles: files });
  },

  createJob: async () => {
    const { selectedFiles, settings, loading } = get();
    if (selectedFiles.length === 0 || loading) {
      return;
    }

    set({ loading: true });
    const payload = {
      filePaths: selectedFiles.map((file) => file.path),
      settings,
    };

    try {
      const job = await api.createJob(payload);

      set({
        jobs: [job, ...get().jobs],
        selectedFiles: [],
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  upsertJobProgress: (payload) => {
    set({
      jobs: get()
        .jobs.map((job) =>
          job.id === payload.jobId
            ? {
                ...job,
                status: payload.status,
                progress: payload.progress,
                message: payload.message,
                outputPaths:
                  payload.outputPath && !job.outputPaths.includes(payload.outputPath)
                    ? [...job.outputPaths, payload.outputPath]
                    : job.outputPaths,
                error: payload.error,
              }
            : job,
        )
        .sort((a, b) => b.updatedAt - a.updatedAt),
    });
  },
}));
