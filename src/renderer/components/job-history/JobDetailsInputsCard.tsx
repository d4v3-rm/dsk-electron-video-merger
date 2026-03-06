import { OrderedListOutlined } from '@ant-design/icons';
import { Card, List, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Job } from '@shared/types';
import { HistoryPathText } from '@renderer/components/job-history/HistoryPathText';

interface JobDetailsInputsCardProps {
  job: Job;
}

export const JobDetailsInputsCard = ({ job }: JobDetailsInputsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      title={
        <Space>
          <OrderedListOutlined />
          {t('details.inputTitle')}
        </Space>
      }
    >
      <List
        size="small"
        dataSource={job.files}
        renderItem={(file, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Tag bordered={false}>{index + 1}</Tag>}
              title={file.name}
              description={<HistoryPathText path={file.path} />}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
