import { dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { InputFileDTO } from '@shared/types';

export interface FilePickerService {
  pickVideos: () => Promise<InputFileDTO[]>;
  pickOutputDirectory: () => Promise<string | null>;
}

export const createFilePickerService = (): FilePickerService => {
  const pickVideos = async (): Promise<InputFileDTO[]> => {
    const result = await dialog.showOpenDialog({
      title: 'Select one or more videos',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Video',
          extensions: ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v', 'flv', 'ogv', 'mpg', 'mpeg'],
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
  };

  const pickOutputDirectory = async (): Promise<string | null> => {
    const result = await dialog.showOpenDialog({
      title: 'Select the destination folder for merged output',
      properties: ['openDirectory'],
    });

    if (result.canceled) {
      return null;
    }

    return result.filePaths[0] ?? null;
  };

  return {
    pickVideos,
    pickOutputDirectory,
  };
};
