import type {
  ConversionSettings,
  Job,
  JobCreationPayload,
  JobProgressPayload
} from '../../shared/types';

const electronAPI = (window as unknown as { electronAPI: Record<string, unknown> }).electronAPI as {
  selectVideoFiles: () => Promise<{ id: string; name: string; path: string; size: number }[]>;
  createSingleJob: (payload: JobCreationPayload) => Promise<Job>;
  createBulkJob: (payload: JobCreationPayload) => Promise<Job>;
  getJobs: () => Promise<Job[]>;
  onJobProgress: (cb: (payload: JobProgressPayload) => void) => () => void;
};

export const api = {
  selectVideoFiles: async () => electronAPI.selectVideoFiles(),
  createSingleJob: async (payload: { filePaths: string[]; settings: ConversionSettings }) =>
    electronAPI.createSingleJob(payload),
  createBulkJob: async (payload: { filePaths: string[]; settings: ConversionSettings }) =>
    electronAPI.createBulkJob(payload),
  getJobs: async () => electronAPI.getJobs(),
  subscribeJobProgress: (cb: (payload: JobProgressPayload) => void) => electronAPI.onJobProgress(cb)
};
