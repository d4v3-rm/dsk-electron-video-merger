import { OrderedListOutlined } from '@ant-design/icons';
import { App as AntdApp, Card, Col, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import {
  JobComposerHeader,
  JobComposerExecutionNotes,
  JobComposerQueuePanel,
  JobComposerSettingsForm,
  JobComposerStats,
} from '@renderer/components/job-composer';
import { getJobComposerModeCopy } from '@renderer/components/job-composer/job-composer.copy';
import { buildJobComposerSetupSummary } from '@renderer/components/job-composer/job-composer-summary.utils';
import { selectJobComposerState } from '@renderer/store/app-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import { useUiStore } from '@renderer/store/use-ui-store';
import {
  getEncoderModeDescription,
  getRequestedEncoderBackendLabel,
  getVideoTimingDescription,
  isNvidiaSupportedOutputFormat,
} from '@renderer/utils/encoder-presentation';

const { Text, Title } = Typography;

export const JobComposer = () => {
  const { t } = useTranslation();
  const { notification } = AntdApp.useApp();
  const {
    jobMode,
    selectedFiles,
    hardwareAccelerationProfile,
    hardwareAccelerationLoaded,
    outputDirectory,
    settings,
    loading,
    setCompression,
    setEncoderBackend,
    setTargetFrameRate,
    setVideoTimingMode,
    setOutputFormat,
    selectVideoFiles,
    selectOutputDirectory,
    clearOutputDirectory,
    clearSelectedFiles,
    removeSelectedFile,
    moveSelectedFile,
    createJob,
  } = useAppStore(useShallow(selectJobComposerState));
  const setActiveWorkspacePanel = useUiStore((state) => state.setActiveWorkspacePanel);

  const isMergeMode = jobMode === 'merge';
  const nvidiaAvailable = hardwareAccelerationProfile.nvidia.available;
  const nvidiaSupportedForFormat = isNvidiaSupportedOutputFormat(settings.outputFormat);
  const encoderModeDescription = getEncoderModeDescription(
    settings.outputFormat,
    settings.encoderBackend,
    hardwareAccelerationProfile,
  );
  const timingModeDescription = getVideoTimingDescription(
    settings.videoTimingMode,
    settings.targetFrameRate,
  );
  const hardwareAlertType = !hardwareAccelerationLoaded
    ? 'info'
    : nvidiaAvailable && nvidiaSupportedForFormat
      ? 'success'
      : settings.outputFormat === 'webm'
        ? 'warning'
        : 'info';
  const modeCopy = getJobComposerModeCopy(t, isMergeMode);
  const setupSummary = buildJobComposerSetupSummary({
    t,
    settings,
    outputDirectory,
    deliveryValue: modeCopy.deliveryValue,
    destinationDefaultLabel: t('composer.destinationDefault'),
  });
  const backendCopy =
    settings.outputFormat === 'webm'
      ? t('composer.backendWebm')
      : nvidiaAvailable
        ? t('composer.backendNvenc')
        : t('composer.backendCpu');
  const destinationCopy = outputDirectory ? t('composer.destinationSelected') : t('composer.destinationAuto');

  const handleCreateJob = async (): Promise<void> => {
    const job = await createJob();
    if (!job) {
      return;
    }

    notification.success({
      placement: 'topRight',
      duration: 3.8,
      className: 'queue-launch-toast',
      message:
        job.mode === 'merge' ? t('composer.queueToast.mergeTitle') : t('composer.queueToast.compressTitle'),
      description:
        job.mode === 'merge'
          ? t('composer.queueToast.mergeDescription', {
              count: job.files.length,
              suffix: job.files.length === 1 ? '' : 's',
            })
          : t('composer.queueToast.compressDescription', {
              count: job.files.length,
              suffix: job.files.length === 1 ? '' : 's',
            }),
      icon: <OrderedListOutlined style={{ color: 'var(--app-accent)' }} />,
    });

    setActiveWorkspacePanel('history');
  };

  return (
    <Card
      title={modeCopy.cardTitle}
      className="modern-card queue-card"
      extra={
        <JobComposerHeader
          queueTag={modeCopy.queueTag}
          nvidiaAvailable={nvidiaAvailable}
          nvidiaAvailableLabel={t('composer.tags.nvidiaAvailable')}
          cpuOnlyLabel={t('composer.tags.cpuOnly')}
        />
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} className="section-title">
            {modeCopy.title}
          </Title>
          <Text type="secondary">{modeCopy.subtitle}</Text>
        </div>

        <JobComposerStats
          selectedFiles={selectedFiles}
          statsLabel={modeCopy.statsLabel}
          stagingSizeLabel={t('composer.stats.stagingSize')}
          deliveryLabel={t('composer.stats.delivery')}
          deliveryValue={modeCopy.deliveryValue}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <Card size="small" className="panel-section-card" title={t('composer.sections.exportProfile')}>
              <JobComposerSettingsForm
                outputDirectory={outputDirectory}
                settings={settings}
                nvidiaAvailable={nvidiaAvailable}
                nvidiaSupportedForFormat={nvidiaSupportedForFormat}
                destinationDefaultLabel={t('composer.destinationDefault')}
                autoPrefersNvidiaLabel={t('composer.autoPrefersNvidia')}
                autoStaysCpuLabel={t('composer.autoStaysCpu')}
                outputFormatLabel={t('composer.fields.outputFormat')}
                compressionLabel={t('composer.fields.compression')}
                backendLabel={t('composer.fields.backend')}
                frameTimingLabel={t('composer.fields.frameTiming')}
                targetFrameRateLabel={t('composer.fields.targetFrameRate')}
                destinationFolderLabel={t('composer.fields.destinationFolder')}
                selectDestinationLabel={t('composer.buttons.selectDestination')}
                useDefaultDestinationLabel={t('composer.buttons.useDefaultDestination')}
                setOutputFormat={setOutputFormat}
                setCompression={setCompression}
                setEncoderBackend={setEncoderBackend}
                setVideoTimingMode={setVideoTimingMode}
                setTargetFrameRate={setTargetFrameRate}
                selectOutputDirectory={selectOutputDirectory}
                clearOutputDirectory={clearOutputDirectory}
              />
            </Card>
          </Col>

          <Col xs={24} xl={10}>
            <JobComposerExecutionNotes
              title={t('composer.sections.executionNotes')}
              orderInfo={modeCopy.orderInfo}
              orderAlertType={modeCopy.orderAlertType}
              hardwareAccelerationLoaded={hardwareAccelerationLoaded}
              hardwareAccelerationProfile={hardwareAccelerationProfile}
              hardwareAlertType={hardwareAlertType}
              hardwareDetectingLabel={t('composer.hardwareDetecting')}
              encoderModeDescription={encoderModeDescription}
              timingModeDescription={timingModeDescription}
              setupSummary={setupSummary}
              backendSelectedLabel={t('composer.backendSelected', {
                backend: getRequestedEncoderBackendLabel(settings.encoderBackend),
              })}
              backendCopy={backendCopy}
              destinationCopy={destinationCopy}
            />
          </Col>
        </Row>

        <JobComposerQueuePanel
          title={modeCopy.queueTitle}
          queueHint={modeCopy.queueHint}
          selectedFilesCount={selectedFiles.length}
          loading={loading}
          addButtonLabel={modeCopy.addButtonLabel}
          clearButtonLabel={modeCopy.clearButtonLabel}
          startButtonLabel={modeCopy.startButtonLabel}
          emptyTitle={modeCopy.emptyTitle}
          emptyDescription={modeCopy.emptyDescription}
          isMergeMode={isMergeMode}
          selectedFiles={selectedFiles}
          selectVideoFiles={selectVideoFiles}
          clearSelectedFiles={clearSelectedFiles}
          createJob={handleCreateJob}
          removeSelectedFile={removeSelectedFile}
          moveSelectedFile={moveSelectedFile}
          moveUpTooltipLabel={t('composer.tooltips.moveUp')}
          moveDownTooltipLabel={t('composer.tooltips.moveDown')}
          removeTooltipLabel={t('composer.tooltips.removeClip')}
          startTagLabel={t('composer.clipTag.start')}
          endTagLabel={t('composer.clipTag.end')}
          startRoleLabel={t('composer.clipRole.start')}
          endRoleLabel={t('composer.clipRole.end')}
          middleRoleLabel={t('composer.clipRole.middle')}
          sourceRoleLabel={t('composer.videoRole.source')}
        />
      </Space>
    </Card>
  );
};
