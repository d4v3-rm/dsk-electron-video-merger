import { Button, Space, Tag, Typography } from 'antd';

const { Paragraph, Text, Title } = Typography;

export const SiteFooter = () => (
  <footer className="site-footer site-reveal">
    <div className="site-section-shell site-footer-shell">
      <div className="site-footer-meta">
        <Space wrap size={[8, 8]}>
          <Tag className="site-tag">Electron</Tag>
          <Tag className="site-tag">React</Tag>
          <Tag className="site-tag">TypeScript</Tag>
          <Tag className="site-tag">MIT</Tag>
        </Space>
      </div>

      <div className="site-footer-copy">
        <Title level={2}>
          A local desktop studio for teams that need final files, not cloud upload rituals.
        </Title>
        <Paragraph>
          Merge, compress, monitor progress, and reopen artifacts locally. The website now mirrors that same
          restraint by keeping the presentation light and the screenshots central.
        </Paragraph>
      </div>

      <div className="site-footer-actions">
        <Space wrap size="middle">
          <Button type="primary" size="large" href="#top">
            Back to top
          </Button>
          <Button size="large" href="#screens">
            Explore screens
          </Button>
        </Space>

        <Text type="secondary">
          dsk-electron-video-merger | portable desktop workflow | local-first video processing
        </Text>
      </div>
    </div>
  </footer>
);
