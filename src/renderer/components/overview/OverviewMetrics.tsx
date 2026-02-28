import { Card, Col, Row, Statistic } from 'antd';
import type { OverviewMetricsProps } from '@renderer/components/overview/overview.types';
import { statisticTileBodyStyles, summaryTileStyle } from '@renderer/theme/component-styles';

export const OverviewMetrics = ({ metrics }: OverviewMetricsProps) => (
  <Row gutter={[12, 12]} data-overview-animate="true">
    {metrics.map((metric) => (
      <Col xs={12} xl={6} key={metric.key}>
        <Card size="small" style={summaryTileStyle} styles={statisticTileBodyStyles}>
          <Statistic title={metric.title} value={metric.value} prefix={metric.prefix} />
        </Card>
      </Col>
    ))}
  </Row>
);
