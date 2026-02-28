import { Col, Row, Space, Steps, Tag, Typography } from 'antd';
import type { OverviewDetailsProps } from '@renderer/components/overview/overview.types';
import { overviewChipStyle, overviewStepsStyle, overviewTextStyle } from '@renderer/theme/component-styles';

const { Paragraph, Text } = Typography;

export const OverviewDetails = ({ body, chips, toggleHint, currentStep, steps }: OverviewDetailsProps) => (
  <Row gutter={[24, 24]} align="middle">
    <Col xs={24} xl={12}>
      <Space direction="vertical" size="middle" data-overview-animate="true">
        <Paragraph style={overviewTextStyle}>{body}</Paragraph>

        <Space wrap size={[8, 8]}>
          {chips.map((chip) => (
            <Tag key={chip} bordered={false} style={overviewChipStyle}>
              {chip}
            </Tag>
          ))}
        </Space>

        <Text type="secondary">{toggleHint}</Text>
      </Space>
    </Col>

    <Col xs={24} xl={12}>
      <div data-overview-animate="true" style={overviewStepsStyle}>
        <Steps current={currentStep} responsive={false} direction="vertical" size="small" items={steps} />
      </div>
    </Col>
  </Row>
);
