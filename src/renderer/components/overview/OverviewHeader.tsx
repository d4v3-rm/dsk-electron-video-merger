import {
  CompressOutlined,
  DashboardOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Segmented, Space, Tag, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { JobMode } from '@shared/types';
import { ThemeSwitcher } from '@renderer/components/ThemeSwitcher';
import type { OverviewHeaderProps } from '@renderer/components/overview/overview.types';
import {
  overviewBrandCopyStyle,
  overviewBrandStyle,
  overviewControlsStyle,
  overviewModeLabelStyle,
  overviewModePanelStyle,
  overviewTagStyle,
  overviewTitleStyle,
  overviewToolbarStyle,
  overviewTopbarStyle,
  statusBadgeStyle,
} from '@renderer/theme/component-styles';

const { Title, Text } = Typography;

export const OverviewHeader = ({
  isExpanded,
  jobMode,
  workspaceStatus,
  title,
  studioTag,
  deliveryTag,
  onToggleOverview,
  onModeChange,
}: OverviewHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div style={overviewTopbarStyle}>
      <Space size="middle" style={overviewBrandStyle}>
        <Avatar
          size={48}
          shape="square"
          icon={<DashboardOutlined />}
          style={{
            background: 'var(--app-avatar-bg)',
            border: '1px solid var(--app-border-strong)',
            color: 'var(--app-accent)',
          }}
        />
        <div data-overview-animate="true" style={overviewBrandCopyStyle}>
          <Space wrap size={[8, 8]}>
            <Tag style={overviewTagStyle}>{studioTag}</Tag>
            <Tag style={overviewTagStyle}>{t('overview.tags.desktop')}</Tag>
            <Tag style={overviewTagStyle}>{deliveryTag}</Tag>
          </Space>
          <Title level={3} style={overviewTitleStyle}>
            {title}
          </Title>
          <Text style={statusBadgeStyle}>{workspaceStatus}</Text>
        </div>
      </Space>

      <div data-overview-animate="true" style={overviewControlsStyle}>
        <Space size="small" wrap style={overviewToolbarStyle}>
          <ThemeSwitcher size="small" />
          <Tooltip title={isExpanded ? t('overview.actions.collapse') : t('overview.actions.expand')}>
            <Button
              ghost
              shape="circle"
              icon={isExpanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={onToggleOverview}
            />
          </Tooltip>
        </Space>

        <div style={overviewModePanelStyle}>
          <Text type="secondary" style={overviewModeLabelStyle}>
            {t('overview.modeLabel')}
          </Text>
          <Segmented
            block
            size="large"
            value={jobMode}
            onChange={(value) => onModeChange(value as JobMode)}
            options={[
              {
                label: (
                  <Space size={6}>
                    <VideoCameraOutlined />
                    {t('modes.merge')}
                  </Space>
                ),
                value: 'merge',
              },
              {
                label: (
                  <Space size={6}>
                    <CompressOutlined />
                    {t('modes.compress')}
                  </Space>
                ),
                value: 'compress',
              },
            ]}
          />
          <Text type="secondary">{t('overview.modeHint')}</Text>
        </div>
      </div>
    </div>
  );
};
