import { ArrowDownOutlined, HighlightOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { heroFacts, heroTags } from '@website/content/site-content';
import { productScreens } from '@website/content/site-media';

const { Paragraph, Text, Title } = Typography;

export const LandingHero = () => (
  <section className="site-hero" id="top">
    <div className="site-hero-inner">
      <header className="site-topbar site-animate">
        <div className="site-brand-block">
          <Text className="site-brand-label">Video Merger Desktop</Text>
          <Paragraph className="site-topbar-copy">
            Local video operations for merge, compression, and final file delivery.
          </Paragraph>
        </div>

        <Space wrap size="small">
          <Tag className="site-tag">MIT licensed</Tag>
          <Tag className="site-tag">Full dark UI</Tag>
        </Space>
      </header>

      <Row gutter={[40, 40]} align="middle" className="site-hero-grid">
        <Col xs={24} xl={9}>
          <div className="site-hero-copy">
            <Space wrap size={[8, 8]} className="site-animate">
              {heroTags.map((tag) => (
                <Tag key={tag} className="site-tag">
                  {tag}
                </Tag>
              ))}
            </Space>

            <div className="site-animate">
              <Text className="site-kicker">Desktop merge and compression studio</Text>
              <Title className="site-hero-title">Merge timelines. Compress sources. Stay local.</Title>
              <Paragraph className="site-hero-description">
                Built for operators who need explicit ordering, technical export control, live runtime
                progress, and direct access to the final artifact path.
              </Paragraph>
            </div>

            <div className="site-fact-list site-animate">
              {heroFacts.map((fact) => (
                <div key={fact.label} className="site-fact-row">
                  <Text className="site-fact-label">{fact.label}</Text>
                  <Text className="site-fact-value">{fact.value}</Text>
                </div>
              ))}
            </div>

            <Space wrap size="middle" className="site-animate">
              <Button type="primary" size="large" href="#screens" icon={<ArrowDownOutlined />}>
                Explore screens
              </Button>
              <Button size="large" href="#highlights" icon={<HighlightOutlined />}>
                Why it works
              </Button>
            </Space>
          </div>
        </Col>

        <Col xs={24} xl={15}>
          <div className="site-shot-stage">
            <figure className="site-shot-panel site-shot-panel-primary" data-speed="1">
              <img src={productScreens[0].src} alt={productScreens[0].alt} className="site-shot-image" />
            </figure>

            <figure className="site-shot-panel site-shot-panel-secondary" data-speed="2">
              <img src={productScreens[1].src} alt={productScreens[1].alt} className="site-shot-image" />
            </figure>

            <figure className="site-shot-panel site-shot-panel-tertiary" data-speed="3">
              <img src={productScreens[2].src} alt={productScreens[2].alt} className="site-shot-image" />
            </figure>

            <div className="site-inline-note site-inline-note-left">Output planning stays readable.</div>
            <div className="site-inline-note site-inline-note-right">
              History and review stay in the same flow.
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </section>
);
