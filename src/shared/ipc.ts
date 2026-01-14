export const IPC_CHANNELS = {
  filesPick: 'videos:pick',
  outputDirectoryPick: 'output-directory:pick',
  jobsCreate: 'jobs:create',
  jobsList: 'jobs:list',
  jobsProgress: 'jobs:progress',
  systemCapabilities: 'system:capabilities',
} as const;

export type IpcChannels = typeof IPC_CHANNELS;
export type IpcChannel = keyof IpcChannels;
