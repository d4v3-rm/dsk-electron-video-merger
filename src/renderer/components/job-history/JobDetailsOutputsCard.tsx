import { FileDoneOutlined } from '@ant-design/icons';
import { Card, Empty, List, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { HistoryPathText } from '@renderer/components/job-history/HistoryPathText';
import { getFileName } from '@renderer/utils/file-utils';

interface JobDetailsOutputsCardProps {
  job: Job;
}

export const JobDetailsOutputsCard = ({ job }: JobDetailsOutputsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      title={
        <Space>
          <FileDoneOutlined />
          {t('details.outputTitle')}
        </Space>
      }
    >
      {job.outputPaths.length > 0 ? (
        <List
          size="small"
          dataSource={job.outputPaths}
          renderItem={(outputPath) => (
            <List.Item>
              <List.Item.Meta
                title={getFileName(outputPath)}
                description={<HistoryPathText path={outputPath} />}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('details.outputPending')} />
      )}
    </Card>
  );
};
