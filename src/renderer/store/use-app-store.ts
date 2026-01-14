import { create } from 'zustand';
import type { HardwareAccelerationProfile, JobCreationPayload } from '@shared/types';
import { api } from '@renderer/services/ipc';
import type { AppStoreState } from '@renderer/store/app-store.types';

const DEFAULT_HARDWARE_ACCELERATION_PROFILE: HardwareAccelerationProfile = {
  nvidia: {
    available: false,
    encoder: null,
    hardwareAccel: null,
    supportedOutputFormats: [],
    reason: 'Hardware detection pending.',
  },
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  selectedFiles: [],
  jobs: [],
  hardwareAccelerationProfile: DEFAULT_HARDWARE_ACCELERATION_PROFILE,
  hardwareAccelerationLoaded: false,
  outputDirectory: null,
  settings: {
    outputFormat: 'mp4',
    compression: 'balanced',
    encoderBackend: 'auto',
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

  refreshHardwareAccelerationProfile: async () => {
    try {
      const hardwareAccelerationProfile = await api.getHardwareAccelerationProfile();
      set({ hardwareAccelerationProfile, hardwareAccelerationLoaded: true });
    } catch {
      set({
        hardwareAccelerationLoaded: true,
        hardwareAccelerationProfile: {
          nvidia: {
            available: false,
            encoder: null,
            hardwareAccel: null,
            supportedOutputFormats: [],
            reason: 'Hardware detection is unavailable in this session.',
          },
        },
      });
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
  setCompression: (compression) => set({ settings: { ...get().settings, compression } }),
  setEncoderBackend: (encoderBackend) => set({ settings: { ...get().settings, encoderBackend } }),

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
    const { selectedFiles, settings, outputDirectory, loading } = get();
    if (selectedFiles.length === 0 || loading) {
      return;
    }

    set({ loading: true });
    const payload: JobCreationPayload = {
      filePaths: selectedFiles.map((file) => file.path),
      settings,
      outputDirectory: outputDirectory ?? undefined,
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
        .jobs.map((job) => {
          if (job.id !== payload.jobId) {
            return job;
          }

          const nextLogs = payload.logEntry ? [...job.logs, payload.logEntry] : job.logs;
          const nextOutputPaths =
            payload.outputPath && !job.outputPaths.includes(payload.outputPath)
              ? [...job.outputPaths, payload.outputPath]
              : job.outputPaths;

          return {
            ...job,
            status: payload.status,
            progress: payload.progress,
            message: payload.message,
            outputPaths: nextOutputPaths,
            updatedAt: Date.now(),
            logs: nextLogs,
            telemetry: payload.telemetry ?? job.telemetry,
            resolvedEncoderBackend: payload.resolvedEncoderBackend ?? job.resolvedEncoderBackend,
            error: payload.error,
          };
        })
        .sort((a, b) => b.updatedAt - a.updatedAt),
    });
  },
}));
