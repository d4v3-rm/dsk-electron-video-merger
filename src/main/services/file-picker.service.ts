import { dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { InputFileDTO } from '@shared/types';

export class FilePickerService {
  async pickVideos(): Promise<InputFileDTO[]> {
    const result = await dialog.showOpenDialog({
      title: 'Select one or more videos',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Video',
          extensions: ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v'],
        },
      ],
    });

    if (result.canceled) {
      return [];
    }

    const files: InputFileDTO[] = [];
    for (const filePath of result.filePaths) {
      const stat = await fs.stat(filePath);
      files.push({
        id: filePath,
        name: path.basename(filePath),
        path: filePath,
        size: stat.size,
      });
    }

    return files;
  }
}
