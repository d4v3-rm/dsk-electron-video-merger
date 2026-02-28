import { Card, Col, Row, Statistic } from 'antd';
import type { PreviewMetric } from '@renderer/components/preview/preview.types';
import { statisticTileBodyStyles, summaryTileStyle } from '@renderer/theme/component-styles';

interface PreviewSummaryProps {
  metrics: PreviewMetric[];
}

export const PreviewSummary = ({ metrics }: PreviewSummaryProps) => (
  <Row gutter={[12, 12]}>
    {metrics.map((item) => (
      <Col xs={24} md={12} xl={6} key={item.key}>
        <Card size="small" style={summaryTileStyle} styles={statisticTileBodyStyles}>
          <Statistic title={item.title} value={item.value} prefix={item.prefix} />
        </Card>
      </Col>
    ))}
  </Row>
);
