import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Form, Input, Segmented, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { JobComposerOptionCard } from '@renderer/components/job-composer/JobComposerOptionCard';
import {
  buildBackendOptions,
  buildCompressionOptions,
  buildOutputFormatOptions,
  buildTargetFrameRateOptions,
  buildTimingOptions,
} from '@renderer/components/job-composer/job-composer-options';
import type { JobComposerSettingsFormProps } from '@renderer/components/job-composer/job-composer.types';

const { Text } = Typography;

export const JobComposerSettingsForm = ({
  outputDirectory,
  settings,
  nvidiaAvailable,
  nvidiaSupportedForFormat,
  setOutputFormat,
  setCompression,
  setEncoderBackend,
  setVideoTimingMode,
  setTargetFrameRate,
  selectOutputDirectory,
  clearOutputDirectory,
}: JobComposerSettingsFormProps) => {
  const { t } = useTranslation();

  const formatOptions = buildOutputFormatOptions();
  const compressionOptions = buildCompressionOptions({
    selectedOutputFormat: settings.outputFormat,
  });
  const backendOptions = buildBackendOptions({
    nvidiaAvailable,
    nvidiaSupportedForFormat,
  });
  const timingOptions = buildTimingOptions({
    selectedTimingMode: settings.videoTimingMode,
  });
  const targetFrameRateOptions = buildTargetFrameRateOptions();
  const activeBackendOption = backendOptions.find((option) => option.value === settings.encoderBackend);
  const activeTimingOption = timingOptions.find((option) => option.value === settings.videoTimingMode);

  return (
    <Form layout="vertical" className="composer-settings-form">
      <div className="composer-settings-shell">
        <section className="composer-settings-section">
          <div className="composer-settings-copy">
            <Text strong>{t('composer.sections.outputContainer')}</Text>
            <Text type="secondary">{t('composer.formatSectionHelp')}</Text>
          </div>

          <div className="composer-options-grid composer-format-grid">
            {formatOptions.map((option) => (
              <JobComposerOptionCard
                key={option.value}
                title={option.title}
                description={option.description}
                badges={option.badges}
                meta={option.meta}
                selected={settings.outputFormat === option.value}
                onClick={() => setOutputFormat(option.value)}
              />
            ))}
          </div>
        </section>

        <section className="composer-settings-section">
          <div className="composer-settings-copy">
            <Text strong>{t('composer.sections.qualityProfile')}</Text>
            <Text type="secondary">{t('composer.compressionSectionHelp')}</Text>
          </div>

          <div className="composer-options-grid composer-compression-grid">
            {compressionOptions.map((option) => (
              <JobComposerOptionCard
                key={option.value}
                title={option.title}
                description={option.description}
                badges={option.badges}
                meta={option.meta}
                selected={settings.compression === option.value}
                onClick={() => setCompression(option.value)}
              />
            ))}
          </div>
        </section>

        <section className="composer-settings-section">
          <div className="composer-settings-copy">
            <Text strong>{t('composer.sections.processingRules')}</Text>
            <Text type="secondary">{t('composer.processingSectionHelp')}</Text>
          </div>

          <div className="composer-processing-grid">
            <div className="composer-control-panel">
              <Text strong>{t('composer.fields.backend')}</Text>
              <Segmented
                block
                value={settings.encoderBackend}
                onChange={(value) =>
                  setEncoderBackend(value as JobComposerSettingsFormProps['settings']['encoderBackend'])
                }
                options={backendOptions.map((option) => ({
                  value: option.value,
                  label: option.title,
                  disabled: option.disabled,
                }))}
              />
              <Text type="secondary">{activeBackendOption?.description}</Text>
            </div>

            <div className="composer-control-panel">
              <Text strong>{t('composer.fields.frameTiming')}</Text>
              <Segmented
                block
                value={settings.videoTimingMode}
                onChange={(value) =>
                  setVideoTimingMode(value as JobComposerSettingsFormProps['settings']['videoTimingMode'])
                }
                options={timingOptions.map((option) => ({
                  value: option.value,
                  label: option.title,
                }))}
              />
              <Text type="secondary">{activeTimingOption?.description}</Text>
            </div>
          </div>

          {settings.videoTimingMode === 'cfr' ? (
            <Form.Item label={t('composer.fields.targetFrameRate')} style={{ marginBottom: 0 }}>
              <Select
                value={settings.targetFrameRate}
                onChange={setTargetFrameRate}
                options={targetFrameRateOptions.map((option) => ({
                  value: option.value,
                  label: option.title,
                }))}
              />
            </Form.Item>
          ) : null}
        </section>

        <section className="composer-settings-section">
          <div className="composer-settings-copy">
            <Text strong>{t('composer.sections.deliveryControls')}</Text>
            <Text type="secondary">{t('composer.destinationSectionHelp')}</Text>
          </div>

          <Form.Item label={t('composer.fields.destinationFolder')} style={{ marginBottom: 0 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input readOnly value={outputDirectory ?? t('composer.destinationDefault')} />
              <Button icon={<FolderOpenOutlined />} onClick={selectOutputDirectory}>
                {t('composer.buttons.selectDestination')}
              </Button>
              <Button onClick={clearOutputDirectory} disabled={!outputDirectory}>
                {t('composer.buttons.useDefaultDestination')}
              </Button>
            </Space.Compact>
          </Form.Item>
        </section>
      </div>
    </Form>
  );
};
