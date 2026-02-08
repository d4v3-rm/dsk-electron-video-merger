import { ArrowDownOutlined, HighlightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { heroStats, heroTags } from '@website/content/site-content';
import { productScreens } from '@website/content/site-media';

const { Paragraph, Text, Title } = Typography;

export const LandingHero = () => (
  <section className="site-hero" id="top">
    <div className="site-hero-inner">
      <div className="site-topbar site-animate">
        <div>
          <Text className="site-brand">dsk-electron-video-merger</Text>
          <Paragraph className="site-topbar-copy">
            Desktop video operations without the web-app overhead.
          </Paragraph>
        </div>

        <Space wrap size="small">
          <Tag className="site-tag">MIT licensed</Tag>
          <Tag className="site-tag">Full dark UI</Tag>
        </Space>
      </div>

      <Row gutter={[32, 32]} align="middle" className="site-hero-grid">
        <Col xs={24} xl={10}>
          <Space direction="vertical" size="large" className="site-hero-copy">
            <Space wrap size={[8, 8]} className="site-animate">
              {heroTags.map((tag) => (
                <Tag key={tag} className="site-tag">
                  {tag}
                </Tag>
              ))}
            </Space>

            <div className="site-animate">
              <Text className="site-kicker">Video Merger Desktop</Text>
              <Title className="site-hero-title">
                Merge timelines and compress source videos in one local desktop studio.
              </Title>
              <Paragraph className="site-hero-description">
                Built for practical media operations: explicit ordering, technical output planning, readable
                runtime progress, and direct control over the destination folder.
              </Paragraph>
            </div>

            <Space wrap size="middle" className="site-animate">
              <Button type="primary" size="large" href="#screens" icon={<ArrowDownOutlined />}>
                Explore screens
              </Button>
              <Button size="large" href="#highlights" icon={<HighlightOutlined />}>
                Read highlights
              </Button>
            </Space>

            <div className="site-stat-rail site-animate">
              {heroStats.map((stat) => (
                <Card key={stat.label} className="site-stat-card site-panel">
                  <Text className="site-stat-label">{stat.label}</Text>
                  <Title level={4} className="site-stat-value">
                    {stat.value}
                  </Title>
                </Card>
              ))}
            </div>
          </Space>
        </Col>

        <Col xs={24} xl={14}>
          <div className="site-shot-rail">
            <Card className="site-shot-card site-shot-card-primary site-panel" data-speed="1">
              <img src={productScreens[0].src} alt={productScreens[0].alt} className="site-shot-image" />
            </Card>

            <Card className="site-shot-card site-shot-card-secondary site-panel" data-speed="2">
              <img src={productScreens[1].src} alt={productScreens[1].alt} className="site-shot-image" />
            </Card>

            <Card className="site-shot-card site-shot-card-tertiary site-panel" data-speed="3">
              <img src={productScreens[2].src} alt={productScreens[2].alt} className="site-shot-image" />
            </Card>

            <Card className="site-float-card site-float-card-left site-panel">
              <Text className="site-float-label">Output planning</Text>
              <Title level={5}>Format, profile, backend, and destination stay visible.</Title>
            </Card>

            <Card className="site-float-card site-float-card-right site-panel">
              <Text className="site-float-label">Runtime clarity</Text>
              <Title level={5}>Progress, logs, and history remain in the same language.</Title>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  </section>
);
