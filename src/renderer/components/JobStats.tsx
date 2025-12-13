import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { Job } from '@shared/types';

const { Text } = Typography;

type Props = {
  jobs: Job[];
};

const toPercent = (value: number, total: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

export const JobStats = ({ jobs }: Props) => {
  const total = jobs.length;
  const queued = jobs.filter((job) => job.status === 'queued').length;
  const running = jobs.filter((job) => job.status === 'running').length;
  const completed = jobs.filter((job) => job.status === 'completed').length;
  const error = jobs.filter((job) => job.status === 'error').length;

  return (
    <div className="job-stats">
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic title="Totale job" value={total} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Space direction="vertical" size={0}>
              <Text type="secondary">In coda</Text>
              <Statistic value={queued} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
              <Text type="secondary">{toPercent(queued, total)}%</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Space direction="vertical" size={0}>
              <Text type="secondary">In elaborazione</Text>
              <Statistic value={running} valueStyle={{ color: '#13c2c2' }} prefix={<LoadingOutlined />} />
              <Text type="secondary">{toPercent(running, total)}%</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Completati / Errori</Text>
              <Space size="small">
                <Statistic value={completed} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                <Statistic value={error} valueStyle={{ color: '#ff4d4f' }} prefix={<WarningOutlined />} />
              </Space>
              <Text type="secondary">{total === 0 ? '0%' : `${toPercent(completed, total)}% completati`}</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
