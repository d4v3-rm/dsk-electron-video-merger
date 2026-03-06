import { Card, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { PreviewPathText } from '@renderer/components/preview/PreviewPathText';

const { Text } = Typography;

interface PreviewArtifactCardProps {
  latestOutputPath: string;
}

export const PreviewArtifactCard = ({ latestOutputPath }: PreviewArtifactCardProps) => {
  const { t } = useTranslation();

  return (
    <Card size="small" className="panel-list-card" title={t('preview.sections.artifact')}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text type="secondary">{t('preview.lastOutput')}</Text>
        <PreviewPathText path={latestOutputPath} />
      </Space>
    </Card>
  );
};
