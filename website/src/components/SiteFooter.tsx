import { Button, Card, Space, Tag, Typography } from 'antd';

const { Paragraph, Text, Title } = Typography;

export const SiteFooter = () => (
  <footer className="site-footer site-reveal">
    <div className="site-section-shell">
      <Card className="site-footer-card site-panel">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space wrap size={[8, 8]}>
            <Tag className="site-tag">Electron</Tag>
            <Tag className="site-tag">React</Tag>
            <Tag className="site-tag">TypeScript</Tag>
            <Tag className="site-tag">MIT</Tag>
          </Space>

          <Title level={2}>
            A local desktop studio for teams that need final files, not cloud upload rituals.
          </Title>
          <Paragraph>
            Use the app to merge, compress, inspect progress, and reopen artifacts locally. Use the website to
            present the product with the real interface instead of decorative mockups.
          </Paragraph>

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
        </Space>
      </Card>
    </div>
  </footer>
);
