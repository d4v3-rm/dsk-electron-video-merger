import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import type { JobComposerSettingsFormProps } from '@renderer/components/job-composer/job-composer.types';
import {
  TARGET_FRAME_RATE_OPTIONS,
  getCompressionPresetTechnicalLabel,
  getTargetFrameRateLabel,
  getRequestedEncoderBackendLabel,
  getVideoTimingModeLabel,
} from '@renderer/utils/encoder-presentation';

export const JobComposerSettingsForm = ({
  outputDirectory,
  settings,
  nvidiaAvailable,
  nvidiaSupportedForFormat,
  destinationDefaultLabel,
  autoPrefersNvidiaLabel,
  autoStaysCpuLabel,
  outputFormatLabel,
  compressionLabel,
  backendLabel,
  frameTimingLabel,
  targetFrameRateLabel,
  destinationFolderLabel,
  selectDestinationLabel,
  useDefaultDestinationLabel,
  setOutputFormat,
  setCompression,
  setEncoderBackend,
  setVideoTimingMode,
  setTargetFrameRate,
  selectOutputDirectory,
  clearOutputDirectory,
}: JobComposerSettingsFormProps) => (
  <Form layout="vertical">
    <Form.Item label={outputFormatLabel}>
      <Select
        value={settings.outputFormat}
        onChange={setOutputFormat}
        options={['mp4', 'mov', 'mkv', 'webm'].map((value) => ({
          value,
          label: value.toUpperCase(),
        }))}
      />
    </Form.Item>

    <Form.Item label={compressionLabel}>
      <Select
        value={settings.compression}
        onChange={setCompression}
        options={(['light', 'balanced', 'strong'] as const).map((preset) => ({
          value: preset,
          label: getCompressionPresetTechnicalLabel(preset),
        }))}
      />
    </Form.Item>

    <Form.Item label={backendLabel}>
      <Select
        value={settings.encoderBackend}
        onChange={setEncoderBackend}
        options={[
          {
            value: 'auto',
            label: `${getRequestedEncoderBackendLabel('auto')} (${nvidiaAvailable ? autoPrefersNvidiaLabel : autoStaysCpuLabel})`,
          },
          {
            value: 'cpu',
            label: getRequestedEncoderBackendLabel('cpu'),
          },
          {
            value: 'nvidia',
            label: getRequestedEncoderBackendLabel('nvidia'),
            disabled: !nvidiaAvailable || !nvidiaSupportedForFormat,
          },
        ]}
      />
    </Form.Item>

    <Form.Item label={frameTimingLabel}>
      <Select
        value={settings.videoTimingMode}
        onChange={setVideoTimingMode}
        options={(['preserve', 'cfr'] as const).map((value) => ({
          value,
          label: getVideoTimingModeLabel(value),
        }))}
      />
    </Form.Item>

    {settings.videoTimingMode === 'cfr' ? (
      <Form.Item label={targetFrameRateLabel}>
        <Select
          value={settings.targetFrameRate}
          onChange={setTargetFrameRate}
          options={TARGET_FRAME_RATE_OPTIONS.map((value) => ({
            value,
            label: getTargetFrameRateLabel(value),
          }))}
        />
      </Form.Item>
    ) : null}

    <Form.Item label={destinationFolderLabel}>
      <Space.Compact style={{ width: '100%' }}>
        <Input readOnly value={outputDirectory ?? destinationDefaultLabel} />
        <Button icon={<FolderOpenOutlined />} onClick={selectOutputDirectory}>
          {selectDestinationLabel}
        </Button>
        <Button onClick={clearOutputDirectory} disabled={!outputDirectory}>
          {useDefaultDestinationLabel}
        </Button>
      </Space.Compact>
    </Form.Item>
  </Form>
);
