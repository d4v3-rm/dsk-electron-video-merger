import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AppPaths, JobFolders } from '@main/services/storage.types';

export interface StorageService {
  readonly paths: AppPaths;
  ensurePaths: () => Promise<void>;
  buildJobFolders: (jobId: string, outputDirectory?: string) => Promise<JobFolders>;
}

export const createStorageService = (): StorageService => {
  const getPaths = (): AppPaths => {
    const root = path.join(app.getPath('userData'), 'video-merger');
    return {
      root,
      output: path.join(root, 'outputs'),
    };
  };

  const ensurePaths = async (): Promise<void> => {
    const paths = getPaths();
    await fs.mkdir(paths.root, { recursive: true });
    await fs.mkdir(paths.output, { recursive: true });
  };

  const buildJobFolders = async (jobId: string, outputDirectory?: string): Promise<JobFolders> => {
    await ensurePaths();
    const { output } = getPaths();
    const outputDir = outputDirectory ?? path.join(output, jobId);
    await fs.mkdir(outputDir, { recursive: true });
    return { outputDir };
  };

  return {
    get paths() {
      return getPaths();
    },
    ensurePaths,
    buildJobFolders,
  };
};
