import { Button, Card, Space, Tag, Typography } from 'antd';

const { Paragraph, Text, Title } = Typography;

export const SiteFooter = () => (
  <footer className="site-footer site-reveal">
    <Card className="site-panel site-footer-card">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap size={[8, 8]}>
          <Tag className="site-tag">MIT licensed</Tag>
          <Tag className="site-tag">Desktop-first</Tag>
          <Tag className="site-tag">Portable release</Tag>
        </Space>

        <Title level={2}>
          Ship local video operations without turning the workflow into a browser upload funnel.
        </Title>
        <Paragraph>
          Use the desktop app for real work. Use this website to present the product, the stack, and the
          operating model clearly before distribution.
        </Paragraph>

        <Space wrap size="middle">
          <Button type="primary" size="large" href="#top">
            Back to top
          </Button>
          <Button size="large" href="https://opensource.org/license/mit" target="_blank" rel="noreferrer">
            Read MIT license
          </Button>
        </Space>

        <Text type="secondary">
          dsk-electron-video-merger | full local pipeline | Electron + Vite + React + TypeScript
        </Text>
      </Space>
    </Card>
  </footer>
);
