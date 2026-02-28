import { Card, Col, Row, Statistic } from 'antd';
import type { JobHistoryMetric } from '@renderer/components/job-history/job-history.types';
import { statisticTileBodyStyles, summaryTileStyle } from '@renderer/theme/component-styles';

interface JobBoardSummaryProps {
  metrics: JobHistoryMetric[];
}

export const JobBoardSummary = ({ metrics }: JobBoardSummaryProps) => (
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
