import fs from 'node:fs/promises';
import path from 'node:path';
import type { OutputFormat } from '@shared/types';

export class JobOutputPathService {
  createMergeOutputPath(outputDir: string, outputFormat: OutputFormat): string {
    return path.join(outputDir, `merged-${Date.now()}.${outputFormat}`);
  }

  async resolveCompressionOutputPath(
    outputDir: string,
    sourcePath: string,
    outputFormat: OutputFormat,
    reservedOutputPaths: Set<string>,
  ): Promise<string> {
    const baseName = `${path.parse(sourcePath).name}-compressed`;
    let suffix = 0;

    while (true) {
      const candidate = path.join(
        outputDir,
        `${baseName}${suffix === 0 ? '' : `-${suffix + 1}`}.${outputFormat}`,
      );

      if (reservedOutputPaths.has(candidate)) {
        suffix += 1;
        continue;
      }

      try {
        await fs.access(candidate);
        suffix += 1;
      } catch {
        reservedOutputPaths.add(candidate);
        return candidate;
      }
    }
  }
}
