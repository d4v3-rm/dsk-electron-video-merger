import { Card, Descriptions, Space, Typography } from 'antd';
import type { JobComposerExecutionNotesProps } from '@renderer/components/job-composer/job-composer.types';
import { JobComposerAlerts } from '@renderer/components/job-composer/JobComposerAlerts';

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
}: JobComposerExecutionNotesProps) => (
  <Card size="small" className="panel-section-card" title={title}>
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
  </Card>
);
