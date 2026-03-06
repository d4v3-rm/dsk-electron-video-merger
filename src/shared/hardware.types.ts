import type { OutputFormat } from './video.types';

export interface HardwareAccelerationSupport {
  available: boolean;
  encoder: string | null;
  hardwareAccel: string | null;
  supportedOutputFormats: OutputFormat[];
  reason: string;
}

export interface HardwareAccelerationProfile {
  nvidia: HardwareAccelerationSupport;
}
