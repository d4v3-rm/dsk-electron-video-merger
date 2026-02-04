import {
  DeploymentUnitOutlined,
  RadarChartOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import { featureCards } from '@website/content/site-content';

const { Paragraph, Title } = Typography;

const featureIcons = [
  <DeploymentUnitOutlined key="deployment" />,
  <RadarChartOutlined key="radar" />,
  <ThunderboltOutlined key="thunderbolt" />,
  <SafetyCertificateOutlined key="safety" />,
];

export const FeatureSection = () => (
  <section id="capabilities" className="site-section site-reveal">
    <div className="site-section-heading">
      <Title level={2}>A desktop workflow shaped for operators, not for generic upload forms.</Title>
      <Paragraph>
        The product surface is built around planning, execution, and review. Every major panel exists to
        reduce ambiguity around codecs, destinations, runtime backend choice, and final artifact visibility.
      </Paragraph>
    </div>

    <Row gutter={[20, 20]} className="site-stagger">
      {featureCards.map((feature, index) => (
        <Col key={feature.title} xs={24} md={12}>
          <Card className="site-panel site-feature-card">
            <div className="site-feature-icon">{featureIcons[index]}</div>
            <Title level={4}>{feature.title}</Title>
            <Paragraph>{feature.description}</Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
);
