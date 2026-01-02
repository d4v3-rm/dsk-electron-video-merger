import type { ConversionSettings, HardwareAccelerationProfile, Job, JobProgressPayload } from '@shared/types';

declare global {
  interface Window {
    electronAPI: {
      selectVideoFiles: () => Promise<{ id: string; name: string; path: string; size: number }[]>;
      createJob: (payload: { filePaths: string[]; settings: ConversionSettings }) => Promise<Job>;
      getJobs: () => Promise<Job[]>;
      getHardwareAccelerationProfile: () => Promise<HardwareAccelerationProfile>;
      onJobProgress: (cb: (payload: JobProgressPayload) => void) => () => void;
    };
  }
}

export {};
