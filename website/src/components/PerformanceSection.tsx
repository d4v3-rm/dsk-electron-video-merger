import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { capabilityColumns, performanceHighlights } from '@website/content/site-content';

const { Paragraph, Text, Title } = Typography;

export const PerformanceSection = () => (
  <section className="site-section site-reveal">
    <Row gutter={[24, 24]} align="stretch">
      <Col xs={24} xl={10}>
        <div className="site-section-heading site-section-heading-compact">
          <Title level={2}>
            The stack stays intentional from the runtime shell down to the release artifact.
          </Title>
          <Paragraph>
            Electron handles the desktop shell, Node.js owns filesystem and FFmpeg orchestration, React
            renders the workspace, and Vite keeps both the app and the presentation site fast in development.
          </Paragraph>
        </div>

        <Space direction="vertical" size="middle" className="site-highlight-stack site-stagger">
          {performanceHighlights.map((highlight) => (
            <Card key={highlight.label} className="site-panel site-highlight-card">
              <Text className="site-highlight-label">{highlight.label}</Text>
              <Title level={4}>{highlight.value}</Title>
              <Paragraph>{highlight.caption}</Paragraph>
            </Card>
          ))}
        </Space>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="site-panel site-capability-card">
          <div className="site-capability-header">
            <div>
              <Text className="site-console-kicker">Operational coverage</Text>
              <Title level={3}>What the product already exposes in the desktop workspace.</Title>
            </div>
          </div>

          <div className="site-capability-grid site-stagger">
            {capabilityColumns.map((column) => (
              <div key={column.title} className="site-capability-column">
                <Title level={4}>{column.title}</Title>
                <Space direction="vertical" size="small">
                  {column.items.map((item) => (
                    <div key={item} className="site-capability-item">
                      <span className="site-capability-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </Space>
              </div>
            ))}
          </div>

          <div className="site-capability-stats">
            <Card className="site-panel site-mini-stat" variant="borderless">
              <Statistic title="Runtime modes" value={2} suffix="lanes" />
            </Card>
            <Card className="site-panel site-mini-stat" variant="borderless">
              <Statistic title="Output containers" value={4} suffix="formats" />
            </Card>
            <Card className="site-panel site-mini-stat" variant="borderless">
              <Statistic title="Data model" value="0 DB" />
            </Card>
          </div>
        </Card>
      </Col>
    </Row>
  </section>
);
