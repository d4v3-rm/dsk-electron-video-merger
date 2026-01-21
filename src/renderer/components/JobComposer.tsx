import { Card, Col, Descriptions, Flex, Row, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import {
  CompressionSelectionList,
  JobComposerActionBar,
  JobComposerAlerts,
  JobComposerEmptyState,
  JobComposerHeader,
  JobComposerSettingsForm,
  JobComposerStats,
  MergeSelectionList,
} from '@renderer/components/job-composer';
import { selectJobComposerState } from '@renderer/store/app-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  getCompressionPresetTechnicalLabel,
  getEncoderModeDescription,
  getRequestedEncoderBackendLabel,
  isNvidiaSupportedOutputFormat,
} from '@renderer/utils/encoder-presentation';

const { Text, Title } = Typography;

export const JobComposer = () => {
  const { t } = useTranslation();
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
    setOutputFormat,
    selectVideoFiles,
    selectOutputDirectory,
    clearOutputDirectory,
    clearSelectedFiles,
    removeSelectedFile,
    moveSelectedFile,
    createJob,
  } = useAppStore(useShallow(selectJobComposerState));

  const isMergeMode = jobMode === 'merge';
  const nvidiaAvailable = hardwareAccelerationProfile.nvidia.available;
  const nvidiaSupportedForFormat = isNvidiaSupportedOutputFormat(settings.outputFormat);
  const encoderModeDescription = getEncoderModeDescription(
    settings.outputFormat,
    settings.encoderBackend,
    hardwareAccelerationProfile,
  );
  const hardwareAlertType = !hardwareAccelerationLoaded
    ? 'info'
    : nvidiaAvailable && nvidiaSupportedForFormat
      ? 'success'
      : settings.outputFormat === 'webm'
        ? 'warning'
        : 'info';

  const modeCopy = isMergeMode
    ? {
        cardTitle: t('composer.cardTitle.merge'),
        queueTag: t('composer.tags.orderedQueue'),
        title: t('composer.title.merge'),
        subtitle: t('composer.subtitle.merge'),
        orderInfo: t('composer.orderInfo.merge'),
        orderAlertType: 'info' as const,
        statsLabel: t('composer.stats.clips'),
        addButtonLabel: t('composer.buttons.addClips'),
        clearButtonLabel: t('composer.buttons.clearQueue'),
        startButtonLabel: t('composer.buttons.startMerge'),
        emptyTitle: t('composer.empty.mergeTitle'),
        emptyDescription: t('composer.empty.mergeDescription'),
        queueTitle: t('composer.sections.queueMerge'),
        queueHint: t('composer.queueHint.merge'),
        deliveryValue: t('composer.delivery.merge'),
      }
    : {
        cardTitle: t('composer.cardTitle.compress'),
        queueTag: t('composer.tags.batchCompression'),
        title: t('composer.title.compress'),
        subtitle: t('composer.subtitle.compress'),
        orderInfo: t('composer.orderInfo.compress'),
        orderAlertType: 'warning' as const,
        statsLabel: t('composer.stats.videos'),
        addButtonLabel: t('composer.buttons.addVideos'),
        clearButtonLabel: t('composer.buttons.clearSelection'),
        startButtonLabel: t('composer.buttons.startCompression'),
        emptyTitle: t('composer.empty.compressTitle'),
        emptyDescription: t('composer.empty.compressDescription'),
        queueTitle: t('composer.sections.queueCompress'),
        queueHint: t('composer.queueHint.compress'),
        deliveryValue: t('composer.delivery.compress'),
      };

  const setupSummary = [
    {
      key: 'format',
      label: t('composer.fields.outputFormat'),
      children: settings.outputFormat.toUpperCase(),
    },
    {
      key: 'compression',
      label: t('composer.fields.compression'),
      children: getCompressionPresetTechnicalLabel(settings.compression),
    },
    {
      key: 'backend',
      label: t('composer.fields.backend'),
      children: getRequestedEncoderBackendLabel(settings.encoderBackend),
    },
    {
      key: 'destination',
      label: t('composer.fields.destinationFolder'),
      children: outputDirectory ?? t('composer.destinationDefault'),
    },
    {
      key: 'delivery',
      label: t('composer.fields.delivery'),
      children: modeCopy.deliveryValue,
    },
  ];

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
                destinationFolderLabel={t('composer.fields.destinationFolder')}
                selectDestinationLabel={t('composer.buttons.selectDestination')}
                useDefaultDestinationLabel={t('composer.buttons.useDefaultDestination')}
                setOutputFormat={setOutputFormat}
                setCompression={setCompression}
                setEncoderBackend={setEncoderBackend}
                selectOutputDirectory={selectOutputDirectory}
                clearOutputDirectory={clearOutputDirectory}
              />
            </Card>
          </Col>

          <Col xs={24} xl={10}>
            <Card size="small" className="panel-section-card" title={t('composer.sections.executionNotes')}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <JobComposerAlerts
                  orderInfo={modeCopy.orderInfo}
                  orderAlertType={modeCopy.orderAlertType}
                  hardwareAccelerationLoaded={hardwareAccelerationLoaded}
                  hardwareAccelerationProfile={hardwareAccelerationProfile}
                  hardwareAlertType={hardwareAlertType}
                  hardwareDetectingLabel={t('composer.hardwareDetecting')}
                  encoderModeDescription={encoderModeDescription}
                />

                <Descriptions column={1} size="small" items={setupSummary} />

                <Text type="secondary">
                  {t('composer.backendSelected', {
                    backend: getRequestedEncoderBackendLabel(settings.encoderBackend),
                  })}{' '}
                  {settings.outputFormat === 'webm'
                    ? t('composer.backendWebm')
                    : nvidiaAvailable
                      ? t('composer.backendNvenc')
                      : t('composer.backendCpu')}
                </Text>

                <Text type="secondary">
                  {outputDirectory ? t('composer.destinationSelected') : t('composer.destinationAuto')}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card
          size="small"
          className="panel-list-card"
          title={modeCopy.queueTitle}
          extra={<Tag color="processing">{selectedFiles.length}</Tag>}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Flex className="panel-action-bar" align="center" justify="space-between" gap={16} wrap>
              <Text type="secondary" className="panel-action-copy">
                {modeCopy.queueHint}
              </Text>
              <JobComposerActionBar
                selectedFilesCount={selectedFiles.length}
                loading={loading}
                addButtonLabel={modeCopy.addButtonLabel}
                clearButtonLabel={modeCopy.clearButtonLabel}
                startButtonLabel={modeCopy.startButtonLabel}
                selectVideoFiles={selectVideoFiles}
                clearSelectedFiles={clearSelectedFiles}
                createJob={createJob}
              />
            </Flex>

            {selectedFiles.length === 0 ? (
              <JobComposerEmptyState title={modeCopy.emptyTitle} description={modeCopy.emptyDescription} />
            ) : isMergeMode ? (
              <MergeSelectionList
                selectedFiles={selectedFiles}
                moveSelectedFile={moveSelectedFile}
                removeSelectedFile={removeSelectedFile}
                moveUpTooltipLabel={t('composer.tooltips.moveUp')}
                moveDownTooltipLabel={t('composer.tooltips.moveDown')}
                removeTooltipLabel={t('composer.tooltips.removeClip')}
                startTagLabel={t('composer.clipTag.start')}
                endTagLabel={t('composer.clipTag.end')}
                startRoleLabel={t('composer.clipRole.start')}
                endRoleLabel={t('composer.clipRole.end')}
                middleRoleLabel={t('composer.clipRole.middle')}
              />
            ) : (
              <CompressionSelectionList
                selectedFiles={selectedFiles}
                removeSelectedFile={removeSelectedFile}
                removeTooltipLabel={t('composer.tooltips.removeClip')}
                sourceRoleLabel={t('composer.videoRole.source')}
              />
            )}
          </Space>
        </Card>
      </Space>
    </Card>
  );
};
