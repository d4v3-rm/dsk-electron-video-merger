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
import { useCanHover } from '../hooks/use-can-hover';
import { useAppStore } from '../store/use-app-store';
import { ThemeSwitcher } from './ThemeSwitcher';

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
  const jobs = useAppStore((state) => state.jobs);
  const selectedFiles = useAppStore((state) => state.selectedFiles);
  const canHover = useCanHover();
  const shellRef = useRef(null);
  const detailsRef = useRef(null);
  const [isPinnedOpen, setIsPinnedOpen] = useState(() => !canHover);
  const [isHoverActive, setIsHoverActive] = useState(false);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const currentStep = getCurrentStep(selectedFiles.length, runningJobs, completedJobs);
  const isExpanded = canHover ? isPinnedOpen || isHoverActive : isPinnedOpen;
  const workspaceStatus =
    runningJobs > 0 ? 'Merge in corso' : selectedFiles.length > 0 ? 'Pronto al merge' : 'Studio locale';

  const metrics = useMemo(
    () => [
      {
        key: 'clips',
        title: 'Clip in staging',
        value: selectedFiles.length,
        prefix: <VideoCameraOutlined />,
      },
      {
        key: 'queued',
        title: 'Merge in coda',
        value: queuedJobs,
        prefix: <ProfileOutlined />,
      },
      {
        key: 'running',
        title: 'In lavorazione',
        value: runningJobs,
        prefix: <CompressOutlined />,
      },
      {
        key: 'completed',
        title: 'Completati',
        value: completedJobs,
        prefix: <PlayCircleOutlined />,
      },
    ],
    [completedJobs, queuedJobs, runningJobs, selectedFiles.length],
  );

  useEffect(() => {
    setIsPinnedOpen(!canHover);
    setIsHoverActive(false);
  }, [canHover]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const details = detailsRef.current;

    if (!(shell instanceof HTMLElement) || !(details instanceof HTMLElement)) {
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
                <Tag color="processing">Merge Studio</Tag>
                <Tag>Desktop</Tag>
                <Tag>Output unico</Tag>
              </Space>
              <Title level={3} className="overview-title">
                Ordina i clip e genera un master finale coerente senza perdere il controllo del flusso.
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
              {canHover ? (isPinnedOpen ? 'Sblocca' : 'Blocca aperto') : isExpanded ? 'Compatta' : 'Espandi'}
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
                <Paragraph className="overview-text">
                  La hero resta compatta quando stai lavorando sul merge e si apre solo quando serve contesto:
                  branding, stato workspace, tema e guida operativa sono raccolti qui, senza rubare spazio
                  alla queue.
                </Paragraph>

                <Space wrap size={[8, 8]}>
                  <Tag bordered={false}>Ordine esplicito</Tag>
                  <Tag bordered={false}>Compressione guidata</Tag>
                  <Tag bordered={false}>Storico locale</Tag>
                  <Tag bordered={false}>Output unico</Tag>
                </Space>

                <Text type="secondary">
                  {canHover
                    ? 'Passa il mouse sulla hero per leggere il contesto completo o bloccarla aperta se stai configurando il workspace.'
                    : 'Usa il toggle per comprimere o riaprire il pannello introduttivo.'}
                </Text>
              </Space>
            </Col>

            <Col xs={24} xl={12}>
              <div className="overview-steps">
                <Steps
                  current={currentStep}
                  responsive
                  items={[
                    {
                      title: 'Queue clip',
                      description: 'Seleziona e ordina la timeline',
                      icon: <VideoCameraOutlined />,
                    },
                    {
                      title: 'Merge',
                      description: 'Transcodifica e compressione',
                      icon: <CompressOutlined />,
                    },
                    {
                      title: 'Output',
                      description: 'Verifica e riusa il risultato',
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
