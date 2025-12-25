declare global {
  interface Window {
    electronAPI: {
      selectVideoFiles: () => Promise<{ id: string; name: string; path: string; size: number }[]>;
      createJob: (payload: {
        filePaths: string[];
        settings: import('../../shared/types').ConversionSettings;
      }) => Promise<import('../../shared/types').Job>;
      getJobs: () => Promise<import('../../shared/types').Job[]>;
      getHardwareAccelerationProfile: () => Promise<import('../../shared/types').HardwareAccelerationProfile>;
      onJobProgress: (cb: (payload: import('../../shared/types').JobProgressPayload) => void) => () => void;
    };
  }
}

export {};
