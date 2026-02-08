import { Col, Row, Typography } from 'antd';
import { productScreens } from '@website/content/site-media';

const { Paragraph, Text, Title } = Typography;

export const ProductShowcase = () => (
  <section className="site-section site-reveal" id="screens">
    <div className="site-section-shell">
      <Row gutter={[32, 32]} align="top">
        <Col xs={24} lg={14}>
          <figure className="site-feature-figure">
            <img src={productScreens[0].src} alt={productScreens[0].alt} className="site-screen-image" />
          </figure>
        </Col>

        <Col xs={24} lg={10}>
          <div className="site-section-heading site-section-heading-tight">
            <Text className="site-kicker">Product screens</Text>
            <Title level={2}>The interface does the explaining.</Title>
            <Paragraph>
              The product pitch is now built around the actual desktop surfaces instead of decorative card
              stacks. Screenshot context sits next to the image instead of competing with it.
            </Paragraph>
          </div>

          <div className="site-story-list">
            {productScreens.map((screen) => (
              <article key={screen.title} className="site-story-row">
                <Text className="site-screen-eyebrow">{screen.eyebrow}</Text>
                <Title level={4}>{screen.title}</Title>
                <Paragraph>{screen.description}</Paragraph>
              </article>
            ))}
          </div>
        </Col>
      </Row>

      <div className="site-secondary-figures">
        {productScreens.slice(1).map((screen) => (
          <figure key={screen.title} className="site-secondary-figure site-reveal">
            <img src={screen.src} alt={screen.alt} className="site-screen-image" />
          </figure>
        ))}
      </div>
    </div>
  </section>
);
