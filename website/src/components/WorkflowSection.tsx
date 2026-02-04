import { CheckCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import { workflowSteps } from '@website/content/site-content';

const { Paragraph, Title } = Typography;

export const WorkflowSection = () => (
  <section id="workflow" className="site-section site-reveal">
    <div className="site-section-heading">
      <Title level={2}>
        A three-lane operating model that stays readable from staging to artifact output.
      </Title>
      <Paragraph>
        The desktop app separates setup, output planning, and historical review. The website mirrors that
        logic so the product pitch stays aligned with the actual runtime experience.
      </Paragraph>
    </div>

    <Row gutter={[20, 20]} className="site-stagger">
      {workflowSteps.map((step, index) => (
        <Col key={step.title} xs={24} lg={8}>
          <Card className="site-panel site-workflow-card">
            <Tag className="site-step-badge">0{index + 1}</Tag>
            <Title level={4}>{step.title}</Title>
            <Paragraph>{step.description}</Paragraph>
            <Space direction="vertical" size="small" className="site-workflow-list">
              {step.details.map((detail) => (
                <div key={detail} className="site-workflow-item">
                  <CheckCircleOutlined />
                  <span>{detail}</span>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
);
