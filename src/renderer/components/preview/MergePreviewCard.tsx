import { Card, Col, Empty, Row, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { PreviewArtifactCard } from '@renderer/components/preview/PreviewArtifactCard';
import { PreviewInputsCard } from '@renderer/components/preview/PreviewInputsCard';
import { PreviewPacketCard } from '@renderer/components/preview/PreviewPacketCard';
import { PreviewRuntimeCard } from '@renderer/components/preview/PreviewRuntimeCard';
import { PreviewSummary } from '@renderer/components/preview/PreviewSummary';
import { buildPreviewMetrics, buildPreviewModel } from '@renderer/components/preview/preview.utils';
import { selectPreviewState } from '@renderer/store/app-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import { fullHeightCardStyle } from '@renderer/theme/component-styles';
import { getJobModeLabel } from '@renderer/utils/job-presentation';

export const MergePreviewCard = () => {
  const { t } = useTranslation();
  const previewState = useAppStore(useShallow(selectPreviewState));
  const previewModel = buildPreviewModel(previewState, t);
  const previewMetrics = buildPreviewMetrics(previewModel, t);

  return (
    <Card
      style={fullHeightCardStyle}
      title={t('preview.cardTitle')}
      extra={
        <Space size="small" wrap>
          <Tag>{getJobModeLabel(previewModel.activeJob?.mode ?? previewModel.previewMode)}</Tag>
          <Tag color={previewModel.activeJob ? 'processing' : 'default'}>{previewModel.previewStatus}</Tag>
        </Space>
      }
    >
      {previewState.selectedFiles.length === 0 &&
      !previewModel.activeJob &&
      !previewModel.latestCompletedJob ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('preview.emptyDescription')} />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <PreviewSummary metrics={previewMetrics} />

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
              <PreviewPacketCard previewModel={previewModel} selectedFiles={previewState.selectedFiles} />
            </Col>

            <Col xs={24} xl={10}>
              <PreviewRuntimeCard
                activeJob={previewModel.activeJob}
                selectedFilesCount={previewState.selectedFiles.length}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {previewState.selectedFiles.length > 0 ? (
              <Col xs={24} xl={previewModel.latestOutputPath ? 12 : 24}>
                <PreviewInputsCard
                  selectedFiles={previewState.selectedFiles}
                  previewMode={previewModel.previewMode}
                />
              </Col>
            ) : null}

            {previewModel.latestOutputPath ? (
              <Col xs={24} xl={previewState.selectedFiles.length > 0 ? 12 : 24}>
                <PreviewArtifactCard latestOutputPath={previewModel.latestOutputPath} />
              </Col>
            ) : null}
          </Row>
        </Space>
      )}
    </Card>
  );
};
