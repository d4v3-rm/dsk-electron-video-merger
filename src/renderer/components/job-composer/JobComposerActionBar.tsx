import { ClearOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import type { JobComposerActionBarProps } from '@renderer/components/job-composer/job-composer.types';

export const JobComposerActionBar = ({
  selectedFilesCount,
  loading,
  addButtonLabel,
  clearButtonLabel,
  startButtonLabel,
  selectVideoFiles,
  clearSelectedFiles,
  createJob,
}: JobComposerActionBarProps) => (
  <Space size="middle" wrap>
    <Button icon={<UploadOutlined />} onClick={selectVideoFiles} size="large">
      {addButtonLabel}
    </Button>
    <Button
      icon={<ClearOutlined />}
      danger
      onClick={clearSelectedFiles}
      disabled={selectedFilesCount === 0}
      size="large"
    >
      {clearButtonLabel}
    </Button>
    <Button
      type="primary"
      icon={<PlayCircleOutlined />}
      loading={loading}
      disabled={selectedFilesCount === 0}
      size="large"
      onClick={createJob}
    >
      {startButtonLabel}
    </Button>
  </Space>
);
