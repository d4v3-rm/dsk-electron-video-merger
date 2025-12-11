declare global {
  interface Window {
    electronAPI: {
      selectVideoFiles: () => Promise<{ id: string; name: string; path: string; size: number }[]>;
      createSingleJob: (payload: {
        filePaths: string[];
        settings: import('../../shared/types').ConversionSettings;
      }) => Promise<import('../../shared/types').Job>;
      createBulkJob: (payload: {
        filePaths: string[];
        settings: import('../../shared/types').ConversionSettings;
      }) => Promise<import('../../shared/types').Job>;
      getJobs: () => Promise<import('../../shared/types').Job[]>;
      onJobProgress: (cb: (payload: import('../../shared/types').JobProgressPayload) => void) => () => void;
    };
  }
}

export {};
