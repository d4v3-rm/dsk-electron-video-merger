import type { TFunction } from 'i18next';
import type { ConversionSettings } from '@shared/types';
import type { JobComposerSummaryItem } from '@renderer/components/job-composer/job-composer.types';
import {
  getCompressionPresetTechnicalLabel,
  getOutputFormatTechnicalLabel,
  getOutputResolutionTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';

interface BuildJobComposerSetupSummaryOptions {
  t: TFunction;
  settings: ConversionSettings;
  outputDirectory: string | null;
  deliveryValue: string;
  destinationDefaultLabel: string;
}

export const buildJobComposerSetupSummary = ({
  t,
  settings,
  outputDirectory,
  deliveryValue,
  destinationDefaultLabel,
}: BuildJobComposerSetupSummaryOptions): JobComposerSummaryItem[] => [
  {
    key: 'format',
    label: t('composer.fields.outputFormat'),
    children: getOutputFormatTechnicalLabel(settings.outputFormat),
  },
  {
    key: 'resolution',
    label: t('composer.fields.outputResolution'),
    children: getOutputResolutionTechnicalLabel(settings.outputResolution),
  },
  {
    key: 'compression',
    label: t('composer.fields.compression'),
    children: getCompressionPresetTechnicalLabel(settings.compression, settings.outputFormat),
  },
  {
    key: 'backend',
    label: t('composer.fields.backend'),
    children: getRequestedEncoderBackendLabel(settings.encoderBackend),
  },
  {
    key: 'timing',
    label: t('composer.fields.frameTiming'),
    children: getVideoTimingModeLabel(settings.videoTimingMode),
  },
  ...(settings.videoTimingMode === 'cfr'
    ? [
        {
          key: 'targetFrameRate',
          label: t('composer.fields.targetFrameRate'),
          children: getTargetFrameRateLabel(settings.targetFrameRate),
        },
      ]
    : []),
  {
    key: 'destination',
    label: t('composer.fields.destinationFolder'),
    children: outputDirectory ?? destinationDefaultLabel,
  },
  {
    key: 'delivery',
    label: t('composer.fields.delivery'),
    children: deliveryValue,
  },
];
