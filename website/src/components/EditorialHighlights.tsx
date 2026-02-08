import { Col, Row, Typography } from 'antd';
import { highlightRows } from '@website/content/site-content';

const { Paragraph, Text, Title } = Typography;

export const EditorialHighlights = () => (
  <section className="site-section site-reveal" id="highlights">
    <div className="site-section-shell">
      <Row gutter={[32, 24]} align="top">
        <Col xs={24} lg={8}>
          <div className="site-section-heading site-section-heading-tight">
            <Text className="site-kicker">Why it works</Text>
            <Title level={2}>Less dashboard theatre, more operational clarity.</Title>
          </div>
        </Col>

        <Col xs={24} lg={16}>
          <div className="site-highlight-list">
            {highlightRows.map((item) => (
              <article key={item.index} className="site-highlight-row">
                <Text className="site-highlight-index">{item.index}</Text>
                <div>
                  <Title level={4}>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
                </div>
              </article>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  </section>
);
