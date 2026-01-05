export type OutputFormat = 'mp4' | 'mov' | 'mkv' | 'webm';
export type CompressionPreset = 'light' | 'balanced' | 'strong';
export type EncoderBackend = 'auto' | 'cpu' | 'nvidia';
export type ResolvedEncoderBackend = 'cpu' | 'nvidia';

export interface InputFileDTO {
  id: string;
  name: string;
  path: string;
  size: number;
}

export interface ConversionSettings {
  outputFormat: OutputFormat;
  compression: CompressionPreset;
  encoderBackend: EncoderBackend;
}
