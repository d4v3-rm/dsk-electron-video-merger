import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AppPaths, JobFolders } from '@main/services/storage.types';

export class StorageService {
  get paths(): AppPaths {
    const root = path.join(app.getPath('userData'), 'video-merger');
    return {
      root,
      output: path.join(root, 'outputs'),
      temp: path.join(root, 'temp'),
    };
  }

  async ensurePaths(): Promise<void> {
    const paths = this.paths;
    await fs.mkdir(paths.root, { recursive: true });
    await fs.mkdir(paths.output, { recursive: true });
    await fs.mkdir(paths.temp, { recursive: true });
  }

  async buildJobFolders(jobId: string): Promise<JobFolders> {
    await this.ensurePaths();
    const { temp, output } = this.paths;
    const outputDir = path.join(output, jobId);
    const tempDir = path.join(temp, jobId);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });
    return { outputDir, tempDir };
  }

  async cleanTempFolder(tempDir: string): Promise<void> {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // best effort cleanup
    }
  }
}
