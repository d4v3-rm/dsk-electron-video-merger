import { Col, Grid, Row, Typography } from 'antd';
import { highlightRows } from '@website/content/site-content';
import {
  createHighlightRowStyle,
  createSectionHeadingStyle,
  createSiteSectionShellStyle,
  highlightListStyle,
  sectionParagraphStyle,
  sectionStyle,
  sectionTitleStyle,
  siteLabelStyle,
} from '@website/theme/site-styles';

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const EditorialHighlights = () => {
  const screens = useBreakpoint();

  return (
    <section id="highlights" data-site-reveal="true" style={sectionStyle}>
      <div style={createSiteSectionShellStyle(!screens.lg)}>
        <Row gutter={[32, 24]} align="top">
          <Col xs={24} lg={8}>
            <div style={createSectionHeadingStyle(true)}>
              <Text style={siteLabelStyle}>Why it works</Text>
              <Title level={2} style={sectionTitleStyle}>
                Less dashboard theatre, more operational clarity.
              </Title>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div style={highlightListStyle}>
              {highlightRows.map((item) => (
                <article key={item.index} style={createHighlightRowStyle(!screens.md)}>
                  <Text style={siteLabelStyle}>{item.index}</Text>
                  <div>
                    <Title level={4} style={sectionTitleStyle}>
                      {item.title}
                    </Title>
                    <Paragraph style={sectionParagraphStyle}>{item.description}</Paragraph>
                  </div>
                </article>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};
