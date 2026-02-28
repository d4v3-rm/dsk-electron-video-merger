import { Col, Grid, Row, Typography } from 'antd';
import { productScreens } from '@website/content/site-media';
import {
  createSecondaryFiguresStyle,
  createSectionHeadingStyle,
  createSiteSectionShellStyle,
  mediaFigureStyle,
  sectionParagraphStyle,
  sectionStyle,
  sectionTitleStyle,
  siteImageStyle,
  siteLabelStyle,
  storyListStyle,
  storyRowStyle,
} from '@website/theme/site-styles';

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const ProductShowcase = () => {
  const screens = useBreakpoint();

  return (
    <section id="screens" data-site-reveal="true" style={sectionStyle}>
      <div style={createSiteSectionShellStyle(!screens.lg)}>
        <Row gutter={[32, 32]} align="top">
          <Col xs={24} lg={14}>
            <figure style={mediaFigureStyle}>
              <img src={productScreens[0].src} alt={productScreens[0].alt} style={siteImageStyle} />
            </figure>
          </Col>

          <Col xs={24} lg={10}>
            <div style={createSectionHeadingStyle(true)}>
              <Text style={siteLabelStyle}>Product screens</Text>
              <Title level={2} style={sectionTitleStyle}>
                The interface does the explaining.
              </Title>
              <Paragraph style={sectionParagraphStyle}>
                The product pitch is now built around the actual desktop surfaces instead of decorative card
                stacks. Screenshot context sits next to the image instead of competing with it.
              </Paragraph>
            </div>

            <div style={storyListStyle}>
              {productScreens.map((screen) => (
                <article key={screen.title} style={storyRowStyle}>
                  <Text style={siteLabelStyle}>{screen.eyebrow}</Text>
                  <Title level={4} style={sectionTitleStyle}>
                    {screen.title}
                  </Title>
                  <Paragraph style={sectionParagraphStyle}>{screen.description}</Paragraph>
                </article>
              ))}
            </div>
          </Col>
        </Row>

        <div style={createSecondaryFiguresStyle(!screens.lg)}>
          {productScreens.slice(1).map((screen) => (
            <figure key={screen.title} data-site-reveal="true" style={mediaFigureStyle}>
              <img src={screen.src} alt={screen.alt} style={siteImageStyle} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
