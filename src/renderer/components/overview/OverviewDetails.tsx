import { Col, Row, Space, Steps, Tag, Typography } from 'antd';
import type { OverviewDetailsProps } from '@renderer/components/overview/overview.types';

const { Paragraph, Text } = Typography;

export const OverviewDetails = ({ body, chips, toggleHint, currentStep, steps }: OverviewDetailsProps) => (
  <Row gutter={[24, 24]} align="middle">
    <Col xs={24} xl={12}>
      <Space direction="vertical" size="middle" className="overview-copy overview-mode-animate">
        <Paragraph className="overview-text">{body}</Paragraph>

        <Space wrap size={[8, 8]}>
          {chips.map((chip) => (
            <Tag key={chip} bordered={false}>
              {chip}
            </Tag>
          ))}
        </Space>

        <Text type="secondary">{toggleHint}</Text>
      </Space>
    </Col>

    <Col xs={24} xl={12}>
      <div className="overview-steps overview-mode-animate">
        <Steps current={currentStep} responsive items={steps} />
      </div>
    </Col>
  </Row>
);
