import { dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface VideoChoice {
  id: string;
  name: string;
  path: string;
  size: number;
}

export class FilePickerService {
  async pickVideos(): Promise<VideoChoice[]> {
    const result = await dialog.showOpenDialog({
      title: 'Seleziona uno o più video',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Video',
          extensions: ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v']
        }
      ]
    });

    if (result.canceled) {
      return [];
    }

    const files: VideoChoice[] = [];
    for (const filePath of result.filePaths) {
      const stat = await fs.stat(filePath);
      files.push({
        id: filePath,
        name: path.basename(filePath),
        path: filePath,
        size: stat.size
      });
    }

    return files;
  }
}
