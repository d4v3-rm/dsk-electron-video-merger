import { Card, Col, Row, Typography } from 'antd';
import { productScreens } from '@website/content/site-media';

const { Paragraph, Text, Title } = Typography;

export const ProductShowcase = () => (
  <section className="site-section site-reveal" id="screens">
    <div className="site-section-shell">
      <div className="site-section-heading">
        <Text className="site-kicker">Product screens</Text>
        <Title level={2}>Real interface surfaces, not concept renders.</Title>
        <Paragraph>
          The presentation site now leans on the actual desktop product. The gallery is intentionally sparse
          so the visuals carry the explanation.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={14}>
          <Card className="site-screen-card site-screen-card-feature site-panel site-reveal">
            <img src={productScreens[0].src} alt={productScreens[0].alt} className="site-screen-image" />
            <div className="site-screen-copy">
              <Text className="site-screen-eyebrow">{productScreens[0].eyebrow}</Text>
              <Title level={3}>{productScreens[0].title}</Title>
              <Paragraph>{productScreens[0].description}</Paragraph>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <div className="site-screen-stack">
            {productScreens.slice(1).map((screen) => (
              <Card key={screen.title} className="site-screen-card site-panel site-reveal">
                <img src={screen.src} alt={screen.alt} className="site-screen-image" />
                <div className="site-screen-copy">
                  <Text className="site-screen-eyebrow">{screen.eyebrow}</Text>
                  <Title level={4}>{screen.title}</Title>
                  <Paragraph>{screen.description}</Paragraph>
                </div>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  </section>
);
