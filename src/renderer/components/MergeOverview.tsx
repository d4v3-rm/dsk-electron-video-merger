import {
  ApiOutlined,
  CheckCircleOutlined,
  CompressOutlined,
  DashboardOutlined,
  PushpinOutlined,
  RadarChartOutlined,
  ThunderboltOutlined,
  UpOutlined,
  VideoCameraOutlined,
  DownOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { gsap } from 'gsap';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '@renderer/components/ThemeSwitcher';
import { useCanHover } from '@renderer/hooks/use-can-hover';
import { useAppStore } from '@renderer/store/use-app-store';
import {
  getCompressionPresetTechnicalLabel,
  getRequestedEncoderBackendLabel,
} from '@renderer/utils/encoder-presentation';

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
  const settings = useAppStore((state) => state.settings);
  const hardwareAccelerationProfile = useAppStore((state) => state.hardwareAccelerationProfile);
  const canHover = useCanHover();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [isPinnedOpen, setIsPinnedOpen] = useState(() => !canHover);
  const [isHoverActive, setIsHoverActive] = useState(false);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const activeJob = jobs.find((job) => job.status === 'running') ?? null;
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
        prefix: <RadarChartOutlined />,
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
        prefix: <CheckCircleOutlined />,
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
          <Space size="large" className="overview-brand">
            <Avatar size={64} shape="square" icon={<DashboardOutlined />} />
            <div>
              <Text className="panel-kicker">{t('overview.kicker')}</Text>

              <Space wrap size={[8, 8]} className="signal-pills overview-tags">
                <Tag>{t('overview.tags.studio')}</Tag>
                <Tag>{t('overview.tags.desktop')}</Tag>
                <Tag>{t('overview.tags.singleOutput')}</Tag>
              </Space>

              <Title level={2} className="overview-title display-face">
                {t('overview.title')}
              </Title>
              <Paragraph className="overview-text">{t('overview.body')}</Paragraph>
            </div>
          </Space>

          <Space direction="vertical" size="middle" align="end" className="overview-command-rail">
            <ThemeSwitcher size="small" />
            <Space wrap size={[10, 10]}>
              <Text className="status-badge">{workspaceStatus}</Text>
              <Button
                size="small"
                icon={canHover ? <PushpinOutlined /> : isExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setIsPinnedOpen((current) => !current)}
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
          </Space>
        </div>

        <Row gutter={[14, 14]} className="overview-kpi-grid">
          {metrics.map((metric) => (
            <Col xs={12} xl={6} key={metric.key}>
              <div className="metric-tile">
                <Statistic title={metric.title} value={metric.value} prefix={metric.prefix} />
              </div>
            </Col>
          ))}
        </Row>

        <div ref={detailsRef} className="overview-details">
          <Row gutter={[16, 16]} className="overview-detail-grid">
            <Col xs={24} xl={8}>
              <div className="overview-panel">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text className="panel-kicker">{t('overview.missionTitle')}</Text>
                    <Title level={5} className="section-heading">
                      {t('overview.missionHeading')}
                    </Title>
                  </div>

                  <Paragraph className="overview-text overview-panel-text">
                    {t('overview.missionText')}
                  </Paragraph>

                  <Space wrap size={[8, 8]} className="signal-pills">
                    <Tag bordered={false}>{t('overview.chips.explicitOrder')}</Tag>
                    <Tag bordered={false}>{t('overview.chips.guidedCompression')}</Tag>
                    <Tag bordered={false}>{t('overview.chips.localHistory')}</Tag>
                    <Tag bordered={false}>{t('overview.chips.singleOutput')}</Tag>
                  </Space>

                  <Text type="secondary">
                    {canHover ? t('overview.hoverHint') : t('overview.toggleHint')}
                  </Text>
                </Space>
              </div>
            </Col>

            <Col xs={24} xl={8}>
              <div className="overview-panel">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text className="panel-kicker">{t('overview.routeTitle')}</Text>
                    <Title level={5} className="section-heading">
                      {t('overview.liveTitle')}
                    </Title>
                  </div>

                  <Progress
                    percent={activeJob?.progress ?? 0}
                    status={activeJob ? 'active' : 'normal'}
                    format={(value) => `${value ?? 0}%`}
                  />

                  <Text type="secondary">{activeJob?.message ?? t('overview.signalIdle')}</Text>

                  <div className="overview-progress-rail">
                    <Descriptions
                      column={1}
                      size="small"
                      items={[
                        {
                          key: 'step',
                          label: t('overview.progressLabel'),
                          children: `${currentStep + 1} / 3`,
                        },
                        {
                          key: 'queued',
                          label: t('overview.metrics.queued'),
                          children: queuedJobs,
                        },
                        {
                          key: 'running',
                          label: t('overview.metrics.running'),
                          children: runningJobs,
                        },
                      ]}
                    />
                  </div>
                </Space>
              </div>
            </Col>

            <Col xs={24} xl={8}>
              <div className="overview-panel">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text className="panel-kicker">{t('overview.systemTitle')}</Text>
                    <Title level={5} className="section-heading">
                      {t('overview.systemHeading')}
                    </Title>
                  </div>

                  <Descriptions
                    column={1}
                    size="small"
                    items={[
                      {
                        key: 'format',
                        label: t('overview.systemLabels.format'),
                        children: settings.outputFormat.toUpperCase(),
                      },
                      {
                        key: 'compression',
                        label: t('overview.systemLabels.compression'),
                        children: getCompressionPresetTechnicalLabel(settings.compression),
                      },
                      {
                        key: 'backend',
                        label: t('overview.systemLabels.backend'),
                        children: getRequestedEncoderBackendLabel(settings.encoderBackend),
                      },
                      {
                        key: 'acceleration',
                        label: t('overview.systemLabels.acceleration'),
                        children: hardwareAccelerationProfile.nvidia.available
                          ? t('overview.accelerationOnline')
                          : t('overview.accelerationOffline'),
                      },
                    ]}
                  />

                  <Space wrap size={[8, 8]} className="signal-pills">
                    <Tag
                      bordered={false}
                      color={hardwareAccelerationProfile.nvidia.available ? 'success' : 'default'}
                    >
                      <ThunderboltOutlined /> {hardwareAccelerationProfile.nvidia.encoder ?? 'CPU'}
                    </Tag>
                    <Tag bordered={false} color="blue">
                      <ApiOutlined /> {settings.outputFormat.toUpperCase()}
                    </Tag>
                  </Space>

                  <Text type="secondary" className="overview-system-description">
                    {hardwareAccelerationProfile.nvidia.reason}
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};
