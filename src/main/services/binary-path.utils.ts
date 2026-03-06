import fs from 'node:fs';

const ASAR_SEGMENT_PATTERN = /([\\/])app\.asar([\\/])/;
const toUnpackedAsarPath = (binaryPath: string): string =>
  binaryPath.replace(ASAR_SEGMENT_PATTERN, '$1app.asar.unpacked$2');

export const resolveBundledBinaryPath = (binaryPath: string | null | undefined): string | null => {
  if (!binaryPath) {
    return null;
  }

  if (ASAR_SEGMENT_PATTERN.test(binaryPath)) {
    const unpackedBinaryPath = toUnpackedAsarPath(binaryPath);
    return fs.existsSync(unpackedBinaryPath) ? unpackedBinaryPath : null;
  }

  return fs.existsSync(binaryPath) ? binaryPath : null;
};
