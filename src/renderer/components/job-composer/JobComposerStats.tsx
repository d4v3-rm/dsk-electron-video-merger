import { VideoCameraAddOutlined } from '@ant-design/icons';
import { Statistic } from 'antd';
import type { JobComposerStatsProps } from '@renderer/components/job-composer/job-composer.types';
import { formatBytes } from '@renderer/utils/file-utils';

export const JobComposerStats = ({ selectedFiles, statsLabel, stagingSizeLabel }: JobComposerStatsProps) => {
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="queue-stats">
      <div className="queue-stat-tile">
        <Statistic title={statsLabel} value={selectedFiles.length} prefix={<VideoCameraAddOutlined />} />
      </div>
      <div className="queue-stat-tile">
        <Statistic title={stagingSizeLabel} value={formatBytes(totalSize)} />
      </div>
    </div>
  );
};
