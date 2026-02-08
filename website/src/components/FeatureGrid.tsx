import { Card, Col, Row, Typography } from 'antd';
import { featureCards } from '@website/content/site-content';

const { Paragraph, Text, Title } = Typography;

export const FeatureGrid = () => (
  <section className="site-section site-reveal" id="highlights">
    <div className="site-section-shell">
      <div className="site-section-heading site-section-heading-narrow">
        <Text className="site-kicker">Why it feels focused</Text>
        <Title level={2}>
          The product is opinionated about clarity, not about adding more dashboard noise.
        </Title>
      </div>

      <Row gutter={[20, 20]}>
        {featureCards.map((feature) => (
          <Col key={feature.title} xs={24} md={8}>
            <Card className="site-feature-card site-panel site-reveal">
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);
