import { Alert, Space } from 'antd';
import type { JobComposerAlertsProps } from '@renderer/components/job-composer/job-composer.types';

export const JobComposerAlerts = ({
  orderInfo,
  orderAlertType,
  hardwareAccelerationLoaded,
  hardwareAccelerationProfile,
  hardwareAlertType,
  hardwareDetectingLabel,
  encoderModeDescription,
  timingModeDescription,
}: JobComposerAlertsProps) => (
  <Space direction="vertical" size={12} style={{ width: '100%' }}>
    <Alert type={orderAlertType} showIcon message={orderInfo} />
    <Alert
      type={hardwareAlertType}
      showIcon
      message={
        hardwareAccelerationLoaded ? hardwareAccelerationProfile.nvidia.reason : hardwareDetectingLabel
      }
      description={encoderModeDescription}
    />
    <Alert type="info" showIcon message={timingModeDescription} />
  </Space>
);
