import type { Job } from '@shared/types';

export interface JobDetailsDrawerProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}
