export const IPC_CHANNELS = {
  filesPick: 'videos:pick',
  jobsCreateSingle: 'jobs:create:single',
  jobsCreateBulk: 'jobs:create:bulk',
  jobsList: 'jobs:list',
  jobsProgress: 'jobs:progress',
} as const;

export type IpcChannels = typeof IPC_CHANNELS;
export type IpcChannel = keyof IpcChannels;
