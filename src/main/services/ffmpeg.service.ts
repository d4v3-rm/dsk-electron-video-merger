import path from 'node:path';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import type { CompressionPreset, OutputFormat } from '../../shared/types';

export type JobProgressCallback = (value: number, message: string, outputPath?: string) => void;

interface EncoderArgs {
  formatArgs: string[];
  ext: string;
}

const CODEC_BY_FORMAT: Record<OutputFormat, EncoderArgs> = {
  mp4: {
    ext: 'mp4',
    formatArgs: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart']
  },
  mov: {
    ext: 'mov',
    formatArgs: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart']
  },
  webm: {
    ext: 'webm',
    formatArgs: ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', '0', '-c:a', 'libopus']
  }
};

const CRF_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '25',
  strong: '35'
};

export class FfmpegService {
  private readonly ffmpegBinary = ffmpegPath;

  async processSingleMerge({
    inputPaths,
    outputPath,
    format,
    compression,
    tempDir,
    onProgress
  }: {
    inputPaths: string[];
    outputPath: string;
    format: OutputFormat;
    compression: CompressionPreset;
    tempDir: string;
    onProgress: JobProgressCallback;
  }): Promise<string> {
    const intermediateOutput = path.join(tempDir, `merged-${Date.now()}.mp4`);

    if (inputPaths.length > 1) {
      const concatFile = path.join(tempDir, 'concat-input.txt');
      const content = inputPaths
        .map((f) => `file '${f.replace(/'/g, "'\\''")}'`)
        .join('\n');
      await fs.writeFile(concatFile, content, 'utf8');
      await this.runFfMpeg(
        ['-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy', intermediateOutput],
        onProgress
      );
    } else {
      await fs.copyFile(inputPaths[0], intermediateOutput);
    }

    const encoder = CODEC_BY_FORMAT[format];
    const args = ['-y', '-i', intermediateOutput, ...encoder.formatArgs, '-crf', CRF_BY_PRESET[compression], outputPath];
    await this.runFfMpeg(args, onProgress);
    return outputPath;
  }

  async processBulk({
    inputPaths,
    format,
    compression,
    outputDir,
    onProgress
  }: {
    inputPaths: string[];
    format: OutputFormat;
    compression: CompressionPreset;
    outputDir: string;
    onProgress: JobProgressCallback;
  }): Promise<string[]> {
    const results: string[] = [];

    for (let i = 0; i < inputPaths.length; i += 1) {
      const source = inputPaths[i];
      const baseName = path.basename(source, path.extname(source));
      const encoder = CODEC_BY_FORMAT[format];
      const destination = path.join(outputDir, `${baseName}.${encoder.ext}`);

      const args = ['-y', '-i', source, ...encoder.formatArgs, '-crf', CRF_BY_PRESET[compression], destination];
      await this.runFfMpeg(args, (p, m) => {
        const itemProgress = Math.round((i / inputPaths.length) * 100 + p * (1 / inputPaths.length));
        onProgress(itemProgress, `${m} (${baseName})`, destination);
      });
      results.push(destination);
    }

    return results;
  }

  private async runFfMpeg(args: string[], onProgress: JobProgressCallback): Promise<void> {
    if (!this.ffmpegBinary) {
      throw new Error('ffmpeg binary unavailable in runtime environment');
    }

    return new Promise<void>((resolve, reject) => {
      const ffmpegProcess = spawn(this.ffmpegBinary as string, args, {
        stdio: ['ignore', 'ignore', 'pipe']
      });

      ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
        const line = chunk.toString();
        if (line.includes('time=')) {
          onProgress(85, 'Elaborazione media');
        }
      });

      ffmpegProcess.on('error', (error: Error) => {
        reject(error);
      });

      ffmpegProcess.on('close', (code: number | null) => {
        if (code === 0 || code === null) {
          resolve();
        } else {
          reject(new Error(`ffmpeg exit code: ${code}`));
        }
      });
    });
  }
}