import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Modal, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import type { JobComposerExecutionNotesProps } from '@renderer/components/job-composer/job-composer.types';
import { JobComposerAlerts } from '@renderer/components/job-composer/JobComposerAlerts';
import { selectExecutionNotesModalState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';
import {
  APP_MODAL_BODY_STYLE,
  APP_MODAL_MEDIUM_WIDTH,
  APP_MODAL_TOP_OFFSET,
} from '@renderer/utils/modal-presentation';

const { Text } = Typography;

export const JobComposerExecutionNotes = ({
  title,
  orderInfo,
  orderAlertType,
  hardwareAccelerationLoaded,
  hardwareAccelerationProfile,
  hardwareAlertType,
  hardwareDetectingLabel,
  encoderModeDescription,
  timingModeDescription,
  setupSummary,
  backendSelectedLabel,
  backendCopy,
  destinationCopy,
}: JobComposerExecutionNotesProps) => {
  const { t } = useTranslation();
  const { executionNotesModalOpen, setExecutionNotesModalOpen } = useUiStore(
    useShallow(selectExecutionNotesModalState),
  );

  return (
    <>
      <Card size="small" className="panel-section-card" title={title}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="panel-action-bar">
            <div className="panel-action-copy">
              <Text type="secondary">{t('composer.executionNotesPreview')}</Text>
            </div>

            <Button icon={<InfoCircleOutlined />} onClick={() => setExecutionNotesModalOpen(true)}>
              {t('composer.buttons.openExecutionNotes')}
            </Button>
          </div>

          <Text type="secondary">
            {backendSelectedLabel} {backendCopy}
          </Text>
        </Space>
      </Card>

      <Modal
        className="app-flat-modal"
        destroyOnHidden
        footer={null}
        onCancel={() => setExecutionNotesModalOpen(false)}
        open={executionNotesModalOpen}
        style={{ top: APP_MODAL_TOP_OFFSET }}
        styles={{ body: APP_MODAL_BODY_STYLE }}
        title={title}
        width={APP_MODAL_MEDIUM_WIDTH}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text type="secondary">{t('composer.executionNotesModalSubtitle')}</Text>

          <JobComposerAlerts
            orderInfo={orderInfo}
            orderAlertType={orderAlertType}
            hardwareAccelerationLoaded={hardwareAccelerationLoaded}
            hardwareAccelerationProfile={hardwareAccelerationProfile}
            hardwareAlertType={hardwareAlertType}
            hardwareDetectingLabel={hardwareDetectingLabel}
            encoderModeDescription={encoderModeDescription}
            timingModeDescription={timingModeDescription}
          />

          <Descriptions column={1} size="small" items={setupSummary} />

          <Text type="secondary">
            {backendSelectedLabel} {backendCopy}
          </Text>

          <Text type="secondary">{destinationCopy}</Text>
        </Space>
      </Modal>
    </>
  );
};
