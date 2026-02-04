import {
  ArrowDownOutlined,
  CloudDownloadOutlined,
  CompressOutlined,
  FolderOpenOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Tag, Typography } from 'antd';
import { heroMetrics, heroTags } from '@website/content/site-content';

const { Paragraph, Text, Title } = Typography;

export const SiteHero = () => (
  <section className="site-hero site-reveal">
    <div className="site-hero-backdrop" aria-hidden="true" />
    <Row gutter={[32, 32]} align="middle">
      <Col xs={24} xl={13}>
        <Space direction="vertical" size="large" className="site-hero-copy">
          <Space wrap size={[8, 8]}>
            {heroTags.map((tag) => (
              <Tag key={tag} className="site-tag">
                {tag}
              </Tag>
            ))}
          </Space>

          <div>
            <Text className="site-eyebrow">Video Merger Desktop</Text>
            <Title className="site-hero-title">
              Dark-room control for video merging, compression, and final delivery.
            </Title>
            <Paragraph className="site-hero-description">
              dsk-electron-video-merger is a desktop-first operator console for assembling final masters,
              compressing source batches, and shipping artifacts locally with readable telemetry.
            </Paragraph>
          </div>

          <Space wrap size="middle">
            <Button type="primary" size="large" href="#workflow" icon={<ArrowDownOutlined />}>
              Explore workflow
            </Button>
            <Button size="large" href="#capabilities" icon={<ThunderboltOutlined />}>
              View capabilities
            </Button>
          </Space>

          <div className="site-metric-strip site-stagger">
            {heroMetrics.map((metric) => (
              <Card key={metric.label} className="site-panel site-metric-card" variant="borderless">
                <Text className="site-metric-label">{metric.label}</Text>
                <Title level={4} className="site-metric-value">
                  {metric.value}
                </Title>
              </Card>
            ))}
          </div>
        </Space>
      </Col>

      <Col xs={24} xl={11}>
        <div className="site-hero-visual site-stagger">
          <Card className="site-panel site-console-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="site-console-header">
                <div>
                  <Text className="site-console-kicker">Command surface</Text>
                  <Title level={4} className="site-console-title">
                    Merge Studio Runtime
                  </Title>
                </div>
                <Tag className="site-tag site-tag-accent">Portable</Tag>
              </div>

              <div className="site-console-grid">
                <Card className="site-panel site-console-tile" variant="borderless">
                  <Statistic title="Queued sources" value={24} prefix={<FolderOpenOutlined />} />
                </Card>
                <Card className="site-panel site-console-tile" variant="borderless">
                  <Statistic title="Active job" value="NVENC" prefix={<CompressOutlined />} />
                </Card>
              </div>

              <div className="site-console-log">
                <div className="site-console-log-row">
                  <span>00:00:14</span>
                  <span>Probe source metadata</span>
                </div>
                <div className="site-console-log-row">
                  <span>00:00:23</span>
                  <span>Build concat pipeline and encoder args</span>
                </div>
                <div className="site-console-log-row">
                  <span>00:00:42</span>
                  <span>Emit live progress percentage to renderer</span>
                </div>
                <div className="site-console-log-row site-console-log-row-accent">
                  <span>00:01:03</span>
                  <span>Artifact written to destination folder</span>
                </div>
              </div>

              <div className="site-console-footer">
                <Text>Local outputs only</Text>
                <CloudDownloadOutlined />
              </div>
            </Space>
          </Card>
        </div>
      </Col>
    </Row>
  </section>
);
