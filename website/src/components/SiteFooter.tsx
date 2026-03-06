import { Button, Grid, Space, Tag, Typography } from 'antd';
import {
  createFooterActionsStyle,
  createSiteSectionShellStyle,
  footerShellStyle,
  footerStyle,
  sectionParagraphStyle,
  sectionTitleStyle,
  siteTagStyle,
} from '@website/theme/site-styles';

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const SiteFooter = () => {
  const screens = useBreakpoint();

  return (
    <footer data-site-reveal="true" style={footerStyle}>
      <div style={{ ...createSiteSectionShellStyle(!screens.lg), ...footerShellStyle }}>
        <div>
          <Space wrap size={[8, 8]}>
            <Tag style={siteTagStyle}>Electron</Tag>
            <Tag style={siteTagStyle}>React</Tag>
            <Tag style={siteTagStyle}>TypeScript</Tag>
            <Tag style={siteTagStyle}>MIT</Tag>
          </Space>
        </div>

        <div>
          <Title level={2} style={sectionTitleStyle}>
            A local desktop studio for teams that need final files, not cloud upload rituals.
          </Title>
          <Paragraph style={sectionParagraphStyle}>
            Merge, compress, monitor progress, and reopen artifacts locally. The website now mirrors that same
            restraint by keeping the presentation light and the screenshots central.
          </Paragraph>
        </div>

        <div style={createFooterActionsStyle(!screens.md)}>
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
};
