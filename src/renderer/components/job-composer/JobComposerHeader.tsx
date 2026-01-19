import { Tag, Space } from 'antd';
import { CodecGuideModal } from '@renderer/components/CodecGuideModal';
import type { JobComposerHeaderProps } from '@renderer/components/job-composer/job-composer.types';

export const JobComposerHeader = ({
  queueTag,
  nvidiaAvailable,
  nvidiaAvailableLabel,
  cpuOnlyLabel,
}: JobComposerHeaderProps) => (
  <Space size="small" wrap>
    <Tag color="processing">{queueTag}</Tag>
    <Tag color={nvidiaAvailable ? 'success' : 'default'}>
      {nvidiaAvailable ? nvidiaAvailableLabel : cpuOnlyLabel}
    </Tag>
    <CodecGuideModal />
  </Space>
);
