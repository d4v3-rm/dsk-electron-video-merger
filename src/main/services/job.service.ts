import type { BrowserWindow } from 'electron';
import type {
  HardwareAccelerationProfile,
  Job,
  JobCreationPayload,
} from '@shared/types';
import type { FfmpegService } from '@main/services/ffmpeg.service';
import { createJobLogEntry } from '@main/services/job/job-log.utils';
import { createJobQueueProcessor } from '@main/services/job/job-queue.processor';
import {
  createJobPublisher,
  createJobStatusUpdater,
  createQueuedJob,
  stripInternalJob,
} from '@main/services/job/job-service.utils';
import type { QueueJob } from '@main/services/job.types';
import type { StorageService } from '@main/services/storage.service';

export interface JobService {
  setWindow: (window: BrowserWindow | null) => void;
  getJobs: () => Job[];
  getHardwareAccelerationProfile: () => Promise<HardwareAccelerationProfile>;
  createJob: (payload: JobCreationPayload) => Promise<Job>;
}

export const createJobService = (
  storageService: StorageService,
  ffmpegService: FfmpegService,
): JobService => {
  const jobs = new Map<string, QueueJob>();
  const queue: string[] = [];
  let mainWindow: BrowserWindow | null = null;

  const publishJobEvent = createJobPublisher(() => mainWindow);
  const updateStatus = createJobStatusUpdater(jobs, publishJobEvent);
  const processQueue = createJobQueueProcessor({
    jobs,
    queue,
    storageService,
    ffmpegService,
    publishJobEvent,
    updateStatus,
    createLogEntry: createJobLogEntry,
  });

  const setWindow = (window: BrowserWindow | null): void => {
    mainWindow = window;
  };

  const getJobs = (): Job[] =>
    Array.from(jobs.values())
      .sort((leftJob, rightJob) => rightJob.createdAt - leftJob.createdAt)
      .map(stripInternalJob);

  const getHardwareAccelerationProfile = (): Promise<HardwareAccelerationProfile> =>
    ffmpegService.getHardwareAccelerationProfile();

  const createJob = async (payload: JobCreationPayload): Promise<Job> => {
    if ([...new Set(payload.filePaths)].length === 0) {
      throw new Error(
        `Select at least one video before starting ${payload.mode === 'merge' ? 'a merge' : 'compression'}.`,
      );
    }

    const job = createQueuedJob(payload, createJobLogEntry);

    jobs.set(job.id, job);
    queue.push(job.id);
    void processQueue();
    return stripInternalJob(job);
  };

  return {
    setWindow,
    getJobs,
    getHardwareAccelerationProfile,
    createJob,
  };
};
