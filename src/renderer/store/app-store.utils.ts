import type { InputFileDTO, Job, JobProgressPayload } from '@shared/types';
import type { SelectedFileMoveDirection } from '@renderer/store/app-store.types';

export const appendUniqueFiles = (
  currentFiles: InputFileDTO[],
  nextFiles: InputFileDTO[],
): InputFileDTO[] => {
  const mergedFiles = [...currentFiles];

  nextFiles.forEach((file) => {
    if (!mergedFiles.some((existingFile) => existingFile.path === file.path)) {
      mergedFiles.push(file);
    }
  });

  return mergedFiles;
};

export const moveSelectedFileInList = (
  files: InputFileDTO[],
  id: string,
  direction: SelectedFileMoveDirection,
): InputFileDTO[] => {
  const currentIndex = files.findIndex((file) => file.id === id);
  if (currentIndex === -1) {
    return files;
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= files.length) {
    return files;
  }

  const reorderedFiles = [...files];
  const [movedFile] = reorderedFiles.splice(currentIndex, 1);
  reorderedFiles.splice(targetIndex, 0, movedFile);
  return reorderedFiles;
};

export const upsertJobProgress = (jobs: Job[], payload: JobProgressPayload): Job[] =>
  jobs
    .map((job) => {
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
    .sort((leftJob, rightJob) => rightJob.updatedAt - leftJob.updatedAt);
