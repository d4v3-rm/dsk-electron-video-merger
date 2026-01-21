import {
  DashboardOutlined,
  DownOutlined,
  PushpinOutlined,
  UpOutlined,
  VideoCameraOutlined,
  CompressOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Segmented, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { JobMode } from '@shared/types';
import { ThemeSwitcher } from '@renderer/components/ThemeSwitcher';
import type { OverviewHeaderProps } from '@renderer/components/overview/overview.types';

const { Title, Text } = Typography;

export const OverviewHeader = ({
  canHover,
  isExpanded,
  isPinnedOpen,
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
    <div className="overview-topbar">
      <Space size="middle" className="overview-brand">
        <Avatar size={48} shape="square" icon={<DashboardOutlined />} />
        <div className="overview-brand-copy overview-mode-animate">
          <Space wrap size={[8, 8]} className="overview-tags">
            <Tag color="processing">{studioTag}</Tag>
            <Tag>{t('overview.tags.desktop')}</Tag>
            <Tag>{deliveryTag}</Tag>
          </Space>
          <Title level={3} className="overview-title">
            {title}
          </Title>
          <Text className="status-badge">{workspaceStatus}</Text>
        </div>
      </Space>

      <div className="overview-controls overview-mode-animate">
        <Space size="small" wrap className="overview-toolbar">
          <ThemeSwitcher size="small" />
          <Button
            size="small"
            icon={canHover ? <PushpinOutlined /> : isExpanded ? <UpOutlined /> : <DownOutlined />}
            onClick={onToggleOverview}
          >
            {canHover
              ? isPinnedOpen
                ? t('overview.actions.unpin')
                : t('overview.actions.pinOpen')
              : isExpanded
                ? t('overview.actions.collapse')
                : t('overview.actions.expand')}
          </Button>
        </Space>

        <div className="overview-mode-panel">
          <Text type="secondary" className="overview-mode-label">
            {t('overview.modeLabel')}
          </Text>
          <Segmented
            block
            size="large"
            className="overview-mode-switch"
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
