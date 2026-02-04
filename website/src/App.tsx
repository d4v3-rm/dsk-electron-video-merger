import { Layout } from 'antd';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { FeatureSection } from '@website/components/FeatureSection';
import { PerformanceSection } from '@website/components/PerformanceSection';
import { SiteFooter } from '@website/components/SiteFooter';
import { SiteHero } from '@website/components/SiteHero';
import { WorkflowSection } from '@website/components/WorkflowSection';

const { Content } = Layout;

gsap.registerPlugin(ScrollTrigger);

function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.site-hero-copy > *',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.12,
        },
      );

      gsap.fromTo(
        '.site-hero-visual .site-panel',
        { autoAlpha: 0, y: 32, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.86,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.18,
        },
      );

      gsap.utils.toArray<HTMLElement>('.site-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.site-stagger').forEach((container) => {
        const targets = Array.from(container.children);
        if (targets.length === 0) {
          return;
        }

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.64,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: container,
              start: 'top 84%',
              once: true,
            },
          },
        );
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Layout className="site-shell" id="top">
      <div className="site-grid" aria-hidden="true" />
      <Content className="site-content">
        <div ref={rootRef} className="site-page-frame">
          <SiteHero />
          <FeatureSection />
          <WorkflowSection />
          <PerformanceSection />
          <SiteFooter />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
