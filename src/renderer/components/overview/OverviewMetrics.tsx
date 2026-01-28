import { Col, Row, Statistic } from 'antd';
import type { OverviewMetricsProps } from '@renderer/components/overview/overview.types';

export const OverviewMetrics = ({ metrics }: OverviewMetricsProps) => (
  <Row gutter={[12, 12]} className="overview-kpi-grid overview-mode-animate">
    {metrics.map((metric) => (
      <Col xs={12} xl={6} key={metric.key}>
        <div className="overview-kpi">
          <Statistic
            className="metric-stat"
            title={metric.title}
            value={metric.value}
            prefix={metric.prefix}
          />
        </div>
      </Col>
    ))}
  </Row>
);
