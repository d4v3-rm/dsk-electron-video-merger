import type {
  BuildBackendOptionsParams,
  BuildCompressionOptionsParams,
  BuildTimingOptionsParams,
  JobComposerSelectableOption,
} from '@renderer/components/job-composer/job-composer.types';
import type {
  CompressionPreset,
  EncoderBackend,
  OutputFormat,
  OutputResolution,
  TargetFrameRate,
  VideoTimingMode,
} from '@shared/types';
import { ENCODER_BACKENDS, OUTPUT_FORMATS, TARGET_FRAME_RATES } from '@shared/types';
import {
  getAvailableCompressionPresets,
  getAvailableOutputResolutions,
  getCompressionPresetBadges,
  getCompressionPresetDescription,
  getCompressionPresetLabel,
  getCompressionPresetTechnicalLabel,
  getOutputFormatBackendSummary,
  getOutputFormatBadges,
  getOutputFormatDescription,
  getOutputFormatLabel,
  getOutputResolutionBadges,
  getOutputResolutionDescription,
  getOutputResolutionLabel,
  getOutputResolutionTechnicalSummary,
  getRequestedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';
import i18n from '@renderer/i18n';

export const buildOutputFormatOptions = (): JobComposerSelectableOption<OutputFormat>[] =>
  OUTPUT_FORMATS.map((value) => ({
    value,
    title: getOutputFormatLabel(value),
    description: getOutputFormatDescription(value),
    badges: getOutputFormatBadges(value),
    meta: getOutputFormatBackendSummary(value),
  }));

export const buildResolutionOptions = (): JobComposerSelectableOption<OutputResolution>[] =>
  getAvailableOutputResolutions().map((value) => ({
    value,
    title: getOutputResolutionLabel(value),
    description: getOutputResolutionDescription(value),
    badges: getOutputResolutionBadges(value),
    meta: getOutputResolutionTechnicalSummary(value),
  }));

export const buildCompressionOptions = ({ selectedOutputFormat }: BuildCompressionOptionsParams) =>
  getAvailableCompressionPresets().map(
    (value): JobComposerSelectableOption<CompressionPreset> => ({
      value,
      title: getCompressionPresetLabel(value),
      description: getCompressionPresetDescription(value),
      badges: getCompressionPresetBadges(value, selectedOutputFormat),
      meta: getCompressionPresetTechnicalLabel(value, selectedOutputFormat),
    }),
  );

export const buildBackendOptions = ({
  nvidiaAvailable,
  nvidiaSupportedForFormat,
}: BuildBackendOptionsParams): JobComposerSelectableOption<EncoderBackend>[] =>
  ENCODER_BACKENDS.map((value) => ({
    value,
    title: getRequestedEncoderBackendLabel(value),
    description:
      value === 'auto'
        ? nvidiaAvailable
          ? i18n.t('composer.encoderAutoGpu')
          : i18n.t('composer.encoderAutoCpu')
        : value === 'cpu'
          ? i18n.t('composer.encoderSoftwareOnly')
          : i18n.t('composer.encoderNvencRequest'),
    badges:
      value === 'nvidia'
        ? [
            nvidiaAvailable && nvidiaSupportedForFormat
              ? i18n.t('common.nvencReady')
              : i18n.t('common.cpuOnly'),
          ]
        : value === 'auto'
          ? [nvidiaAvailable ? i18n.t('composer.tags.nvidiaAvailable') : i18n.t('composer.tags.cpuOnly')]
          : [i18n.t('common.cpuOnly')],
    disabled: value === 'nvidia' && (!nvidiaAvailable || !nvidiaSupportedForFormat),
  }));

export const buildTimingOptions = ({
  selectedTimingMode,
}: BuildTimingOptionsParams): JobComposerSelectableOption<VideoTimingMode>[] => [
  {
    value: 'preserve',
    title: getVideoTimingModeLabel('preserve'),
    description: i18n.t('composer.timingPreserveHelp'),
    badges: selectedTimingMode === 'preserve' ? [i18n.t('common.preserveTiming')] : [],
  },
  {
    value: 'cfr',
    title: getVideoTimingModeLabel('cfr'),
    description: i18n.t('composer.timingCfrHelp', {
      frameRate: getTargetFrameRateLabel(30),
    }),
    badges: TARGET_FRAME_RATES.map((value) => getTargetFrameRateLabel(value)),
  },
];

export const buildTargetFrameRateOptions = (): JobComposerSelectableOption<TargetFrameRate>[] =>
  TARGET_FRAME_RATES.map((value) => ({
    value,
    title: getTargetFrameRateLabel(value),
    description:
      value >= 60
        ? 'High refresh output for gameplay or motion-heavy delivery.'
        : 'Standard fixed frame rate.',
    badges: [value >= 60 ? 'High refresh' : 'Standard'],
  }));
