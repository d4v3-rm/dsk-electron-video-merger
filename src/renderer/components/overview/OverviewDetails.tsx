import { Col, Row, Space, Steps, Tag, Typography } from 'antd';
import type { OverviewDetailsProps } from '@renderer/components/overview/overview.types';

const { Paragraph, Text } = Typography;

export const OverviewDetails = ({ body, chips, toggleHint, currentStep, steps }: OverviewDetailsProps) => (
  <Row gutter={[24, 24]} align="middle">
    <Col xs={24} xl={12}>
      <Space direction="vertical" size="middle" className="overview-copy" data-overview-animate="true">
        <Paragraph className="overview-text">{body}</Paragraph>

        <Space wrap size={[8, 8]}>
          {chips.map((chip) => (
            <Tag key={chip} bordered={false} className="overview-chip">
              {chip}
            </Tag>
          ))}
        </Space>

        <Text type="secondary">{toggleHint}</Text>
      </Space>
    </Col>

    <Col xs={24} xl={12}>
      <div className="overview-steps" data-overview-animate="true">
        <Steps current={currentStep} responsive={false} direction="vertical" size="small" items={steps} />
      </div>
    </Col>
  </Row>
);
