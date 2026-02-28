import { ArrowDownOutlined, GithubOutlined, HighlightOutlined } from '@ant-design/icons';
import { Button, Col, Grid, Row, Space, Tag, Typography } from 'antd';
import { githubUrl, heroFacts, heroTags } from '@website/content/site-content';
import { productScreens } from '@website/content/site-media';
import {
  brandBlockStyle,
  createHeroGridStyle,
  createHeroStyle,
  createHeroTitleStyle,
  createShotPanelStyle,
  createShotStageStyle,
  createSiteSectionShellStyle,
  createTopbarStyle,
  factListStyle,
  factRowStyle,
  factValueStyle,
  heroCopyStyle,
  heroDescriptionStyle,
  siteImageStyle,
  siteLabelStyle,
  siteTagStyle,
  topbarCopyStyle,
} from '@website/theme/site-styles';

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const LandingHero = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isWide = Boolean(screens.xl);

  return (
    <section id="top" data-site-hero="true" style={createHeroStyle(isMobile)}>
      <div style={createSiteSectionShellStyle(!screens.lg)}>
        <header data-site-animate="true" style={createTopbarStyle(isMobile)}>
          <div style={brandBlockStyle}>
            <Text style={siteLabelStyle}>Video Merger Desktop</Text>
            <Paragraph style={topbarCopyStyle}>
              Local video operations for merge, compression, and final file delivery.
            </Paragraph>
          </div>

          <Space wrap size="small">
            <Tag style={siteTagStyle}>MIT licensed</Tag>
            <Tag style={siteTagStyle}>Full dark UI</Tag>
          </Space>
        </header>

        <Row gutter={[32, 32]} align="middle" style={createHeroGridStyle(Boolean(screens.xl))}>
          <Col xs={24} xl={9}>
            <Space direction="vertical" size={24} style={heroCopyStyle}>
              <Space wrap size={[8, 8]} data-site-animate="true">
                {heroTags.map((tag) => (
                  <Tag key={tag} style={siteTagStyle}>
                    {tag}
                  </Tag>
                ))}
              </Space>

              <div data-site-animate="true">
                <Text style={siteLabelStyle}>Desktop merge and compression studio</Text>
                <Title style={createHeroTitleStyle(isWide)}>
                  Merge timelines. Compress sources. Stay local.
                </Title>
                <Paragraph style={heroDescriptionStyle}>
                  Built for operators who need explicit ordering, technical export control, live runtime
                  progress, and direct access to the final artifact path.
                </Paragraph>
              </div>

              <div data-site-animate="true" style={factListStyle}>
                {heroFacts.map((fact) => (
                  <div key={fact.label} style={factRowStyle}>
                    <Text style={siteLabelStyle}>{fact.label}</Text>
                    <Text style={factValueStyle}>{fact.value}</Text>
                  </div>
                ))}
              </div>

              <Space wrap size="middle" data-site-animate="true">
                <Button type="primary" size="large" href="#screens" icon={<ArrowDownOutlined />}>
                  Explore screens
                </Button>
                <Button size="large" href="#highlights" icon={<HighlightOutlined />}>
                  Why it works
                </Button>
                <Button
                  size="large"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  icon={<GithubOutlined />}
                >
                  GitHub
                </Button>
              </Space>
            </Space>
          </Col>

          <Col xs={24} xl={15}>
            <div style={createShotStageStyle(isMobile, Boolean(screens.lg))}>
              <figure data-site-panel="true" data-speed="1" style={createShotPanelStyle('primary', isMobile)}>
                <img src={productScreens[0].src} alt={productScreens[0].alt} style={siteImageStyle} />
              </figure>

              <figure
                data-site-panel="true"
                data-speed="2"
                style={createShotPanelStyle('secondary', isMobile)}
              >
                <img src={productScreens[1].src} alt={productScreens[1].alt} style={siteImageStyle} />
              </figure>

              <figure
                data-site-panel="true"
                data-speed="3"
                style={createShotPanelStyle('tertiary', isMobile)}
              >
                <img src={productScreens[2].src} alt={productScreens[2].alt} style={siteImageStyle} />
              </figure>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};
