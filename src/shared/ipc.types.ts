import type { HardwareAccelerationProfile } from './hardware.types';
import type { Job, JobCreationPayload, JobProgressPayload } from './job.types';
import type { InputFileDTO } from './video.types';

export interface ElectronApi {
  selectVideoFiles: () => Promise<InputFileDTO[]>;
  createJob: (payload: JobCreationPayload) => Promise<Job>;
  getJobs: () => Promise<Job[]>;
  getHardwareAccelerationProfile: () => Promise<HardwareAccelerationProfile>;
  onJobProgress: (callback: (payload: JobProgressPayload) => void) => () => void;
}
