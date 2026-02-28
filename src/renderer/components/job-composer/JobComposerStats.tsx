import { DeploymentUnitOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import type { JobComposerStatsProps } from '@renderer/components/job-composer/job-composer.types';
import { formatBytes } from '@renderer/utils/file-utils';
import { statisticTileBodyStyles, summaryTileStyle } from '@renderer/theme/component-styles';

export const JobComposerStats = ({
  selectedFiles,
  statsLabel,
  stagingSizeLabel,
  deliveryLabel,
  deliveryValue,
}: JobComposerStatsProps) => {
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={8}>
        <Card size="small" style={summaryTileStyle} styles={statisticTileBodyStyles}>
          <Statistic title={statsLabel} value={selectedFiles.length} prefix={<VideoCameraAddOutlined />} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" style={summaryTileStyle} styles={statisticTileBodyStyles}>
          <Statistic title={stagingSizeLabel} value={formatBytes(totalSize)} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" style={summaryTileStyle} styles={statisticTileBodyStyles}>
          <Statistic title={deliveryLabel} value={deliveryValue} prefix={<DeploymentUnitOutlined />} />
        </Card>
      </Col>
    </Row>
  );
};
