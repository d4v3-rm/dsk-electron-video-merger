import { EditOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, Input, Modal, Segmented, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { JobComposerOptionCard } from '@renderer/components/job-composer/JobComposerOptionCard';
import {
  buildBackendOptions,
  buildCompressionOptions,
  buildOutputFormatOptions,
  buildTargetFrameRateOptions,
  buildTimingOptions,
} from '@renderer/components/job-composer/job-composer-options';
import type { JobComposerSettingsFormProps } from '@renderer/components/job-composer/job-composer.types';
import { selectExportProfileModalState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';
import {
  getCompressionPresetTechnicalLabel,
  getOutputFormatTechnicalLabel,
  getRequestedEncoderBackendLabel,
  getTargetFrameRateLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';
import {
  APP_MODAL_BODY_STYLE,
  APP_MODAL_TOP_OFFSET,
  APP_MODAL_WIDTH,
} from '@renderer/utils/modal-presentation';
import {
  composerControlPanelStyle,
  composerSettingsCopyStyle,
  composerSettingsSectionStyle,
  composerSettingsShellStyle,
  composerSummaryDescriptionsStyle,
  composerSummaryStyle,
  modalBodyInsetStyle,
  modalContentStyle,
  modalHeaderStyle,
} from '@renderer/theme/component-styles';

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
  const { exportProfileModalOpen, setExportProfileModalOpen } = useUiStore(
    useShallow(selectExportProfileModalState),
  );

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
    <>
      <div style={composerSummaryStyle}>
        <div style={composerSettingsCopyStyle}>
          <Text strong>{t('composer.modalTitle')}</Text>
          <Text type="secondary">{t('composer.modalSubtitle')}</Text>
        </div>

        <Descriptions
          column={1}
          size="small"
          style={composerSummaryDescriptionsStyle}
          items={[
            {
              key: 'format',
              label: t('composer.fields.outputFormat'),
              children: getOutputFormatTechnicalLabel(settings.outputFormat),
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
              children:
                settings.videoTimingMode === 'cfr'
                  ? `${getVideoTimingModeLabel(settings.videoTimingMode)} - ${getTargetFrameRateLabel(settings.targetFrameRate)}`
                  : getVideoTimingModeLabel(settings.videoTimingMode),
            },
            {
              key: 'destination',
              label: t('composer.fields.destinationFolder'),
              children: outputDirectory ?? t('composer.destinationDefault'),
            },
          ]}
        />

        <Button icon={<EditOutlined />} onClick={() => setExportProfileModalOpen(true)}>
          {t('composer.buttons.configureProfile')}
        </Button>
      </div>

      <Modal
        destroyOnHidden
        footer={null}
        onCancel={() => setExportProfileModalOpen(false)}
        open={exportProfileModalOpen}
        style={{ top: APP_MODAL_TOP_OFFSET }}
        styles={{
          body: { ...APP_MODAL_BODY_STYLE, ...modalBodyInsetStyle },
          content: modalContentStyle,
          header: modalHeaderStyle,
        }}
        title={t('composer.modalTitle')}
        width={APP_MODAL_WIDTH}
      >
        <Form layout="vertical">
          <div style={composerSettingsShellStyle}>
            <section style={composerSettingsSectionStyle}>
              <div style={composerSettingsCopyStyle}>
                <Text strong>{t('composer.sections.outputContainer')}</Text>
                <Text type="secondary">{t('composer.formatSectionHelp')}</Text>
              </div>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
              </Space>
            </section>

            <section style={composerSettingsSectionStyle}>
              <div style={composerSettingsCopyStyle}>
                <Text strong>{t('composer.sections.qualityProfile')}</Text>
                <Text type="secondary">{t('composer.compressionSectionHelp')}</Text>
              </div>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
              </Space>
            </section>

            <section style={composerSettingsSectionStyle}>
              <div style={composerSettingsCopyStyle}>
                <Text strong>{t('composer.sections.processingRules')}</Text>
                <Text type="secondary">{t('composer.processingSectionHelp')}</Text>
              </div>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={composerControlPanelStyle}>
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

                <div style={composerControlPanelStyle}>
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
              </Space>

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

            <section style={composerSettingsSectionStyle}>
              <div style={composerSettingsCopyStyle}>
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
      </Modal>
    </>
  );
};
