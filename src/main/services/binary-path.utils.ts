import fs from 'node:fs';

const ASAR_SEGMENT_PATTERN = /([\\/])app\.asar([\\/])/;

export const resolveBundledBinaryPath = (binaryPath: string | null | undefined): string | null => {
  if (!binaryPath) {
    return null;
  }

  if (fs.existsSync(binaryPath)) {
    return binaryPath;
  }

  const unpackedBinaryPath = binaryPath.replace(ASAR_SEGMENT_PATTERN, '$1app.asar.unpacked$2');

  if (unpackedBinaryPath !== binaryPath && fs.existsSync(unpackedBinaryPath)) {
    return unpackedBinaryPath;
  }

  return null;
};
