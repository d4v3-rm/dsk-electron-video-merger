import {
  CompressOutlined,
  DashboardOutlined,
  DownOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  PushpinOutlined,
  UpOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Space, Statistic, Steps, Tag, Typography } from 'antd';
import { gsap } from 'gsap';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCanHover } from '@renderer/hooks/use-can-hover';
import { useAppStore } from '@renderer/store/use-app-store';
import { ThemeSwitcher } from '@renderer/components/ThemeSwitcher';

const { Title, Text, Paragraph } = Typography;

const getCurrentStep = (selectedFilesCount: number, runningJobsCount: number, completedJobsCount: number) => {
  if (runningJobsCount > 0) {
    return 1;
  }

  if (completedJobsCount > 0 && selectedFilesCount === 0) {
    return 2;
  }

  return 0;
};

export const MergeOverview = () => {
  const { t } = useTranslation();
  const jobs = useAppStore((state) => state.jobs);
  const selectedFiles = useAppStore((state) => state.selectedFiles);
  const canHover = useCanHover();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [isPinnedOpen, setIsPinnedOpen] = useState(() => !canHover);
  const [isHoverActive, setIsHoverActive] = useState(false);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const currentStep = getCurrentStep(selectedFiles.length, runningJobs, completedJobs);
  const isExpanded = canHover ? isPinnedOpen || isHoverActive : isPinnedOpen;
  const workspaceStatus =
    runningJobs > 0
      ? t('overview.status.running')
      : selectedFiles.length > 0
        ? t('overview.status.ready')
        : t('overview.status.idle');

  const metrics = useMemo(
    () => [
      {
        key: 'clips',
        title: t('overview.metrics.clips'),
        value: selectedFiles.length,
        prefix: <VideoCameraOutlined />,
      },
      {
        key: 'queued',
        title: t('overview.metrics.queued'),
        value: queuedJobs,
        prefix: <ProfileOutlined />,
      },
      {
        key: 'running',
        title: t('overview.metrics.running'),
        value: runningJobs,
        prefix: <CompressOutlined />,
      },
      {
        key: 'completed',
        title: t('overview.metrics.completed'),
        value: completedJobs,
        prefix: <PlayCircleOutlined />,
      },
    ],
    [completedJobs, queuedJobs, runningJobs, selectedFiles.length, t],
  );

  useEffect(() => {
    setIsPinnedOpen(!canHover);
    setIsHoverActive(false);
  }, [canHover]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const details = detailsRef.current;

    if (!shell || !details) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.killTweensOf([shell, details]);

      if (isExpanded) {
        gsap.set(details, { display: 'block' });
        gsap.fromTo(
          details,
          { height: 0, autoAlpha: 0, y: -16 },
          {
            height: 'auto',
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            ease: 'power2.out',
            clearProps: 'height',
          },
        );

        gsap.fromTo(shell, { y: 10 }, { y: 0, duration: 0.34, ease: 'power2.out', overwrite: 'auto' });
        return;
      }

      gsap.to(details, {
        height: 0,
        autoAlpha: 0,
        y: -10,
        duration: 0.24,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(details, { display: 'none' });
        },
      });

      gsap.to(shell, { y: 0, duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
    }, shell);

    return () => {
      ctx.revert();
    };
  }, [isExpanded]);

  const toggleOverview = () => {
    setIsPinnedOpen((current) => !current);
  };

  return (
    <Card
      className={`modern-card overview-card ${isExpanded ? 'overview-card-expanded' : 'overview-card-collapsed'}`}
      variant="borderless"
    >
      <div
        ref={shellRef}
        className="overview-shell"
        onMouseEnter={canHover ? () => setIsHoverActive(true) : undefined}
        onMouseLeave={canHover ? () => setIsHoverActive(false) : undefined}
      >
        <div className="overview-topbar">
          <Space size="middle" className="overview-brand">
            <Avatar size={48} shape="square" icon={<DashboardOutlined />} />
            <div>
              <Space wrap size={[8, 8]} className="overview-tags">
                <Tag color="processing">{t('overview.tags.studio')}</Tag>
                <Tag>{t('overview.tags.desktop')}</Tag>
                <Tag>{t('overview.tags.singleOutput')}</Tag>
              </Space>
              <Title level={3} className="overview-title">
                {t('overview.title')}
              </Title>
            </div>
          </Space>

          <Space size="small" wrap className="overview-actions">
            <ThemeSwitcher size="small" />
            <Text className="status-badge">{workspaceStatus}</Text>
            <Button
              size="small"
              icon={canHover ? <PushpinOutlined /> : isExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={toggleOverview}
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
        </div>

        <Row gutter={[12, 12]} className="overview-kpi-grid">
          {metrics.map((metric) => (
            <Col xs={12} xl={6} key={metric.key}>
              <div className="overview-kpi">
                <Statistic title={metric.title} value={metric.value} prefix={metric.prefix} />
              </div>
            </Col>
          ))}
        </Row>

        <div ref={detailsRef} className="overview-details">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} xl={12}>
              <Space direction="vertical" size="middle" className="overview-copy">
                <Paragraph className="overview-text">{t('overview.body')}</Paragraph>

                <Space wrap size={[8, 8]}>
                  <Tag bordered={false}>{t('overview.chips.explicitOrder')}</Tag>
                  <Tag bordered={false}>{t('overview.chips.guidedCompression')}</Tag>
                  <Tag bordered={false}>{t('overview.chips.localHistory')}</Tag>
                  <Tag bordered={false}>{t('overview.chips.singleOutput')}</Tag>
                </Space>

                <Text type="secondary">{canHover ? t('overview.hoverHint') : t('overview.toggleHint')}</Text>
              </Space>
            </Col>

            <Col xs={24} xl={12}>
              <div className="overview-steps">
                <Steps
                  current={currentStep}
                  responsive
                  items={[
                    {
                      title: t('overview.steps.queueTitle'),
                      description: t('overview.steps.queueDescription'),
                      icon: <VideoCameraOutlined />,
                    },
                    {
                      title: t('overview.steps.mergeTitle'),
                      description: t('overview.steps.mergeDescription'),
                      icon: <CompressOutlined />,
                    },
                    {
                      title: t('overview.steps.outputTitle'),
                      description: t('overview.steps.outputDescription'),
                      icon: <PlayCircleOutlined />,
                    },
                  ]}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};
