import { Card, List, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { InputFileDTO, JobMode } from '@shared/types';
import { listContainerStyle, sectionCardStyle, sectionCardStyles } from '@renderer/theme/component-styles';

const { Text } = Typography;

interface PreviewInputsCardProps {
  selectedFiles: InputFileDTO[];
  previewMode: JobMode;
}

export const PreviewInputsCard = ({ selectedFiles, previewMode }: PreviewInputsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      size="small"
      title={t('preview.sections.inputs')}
      style={sectionCardStyle}
      styles={sectionCardStyles}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text type="secondary">
          {previewMode === 'merge' ? t('preview.currentOrder') : t('preview.selectedVideos')}
        </Text>
        <List
          style={listContainerStyle}
          size="small"
          dataSource={selectedFiles.slice(0, 4)}
          renderItem={(file, index) => (
            <List.Item>
              <Space size="middle">
                <Tag bordered={false}>{index + 1}</Tag>
                <Text>{file.name}</Text>
              </Space>
            </List.Item>
          )}
        />
        {selectedFiles.length > 4 ? (
          <Text type="secondary">{t('preview.moreVideos', { count: selectedFiles.length - 4 })}</Text>
        ) : null}
      </Space>
    </Card>
  );
};
