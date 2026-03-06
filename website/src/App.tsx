import { Layout } from 'antd';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { EditorialHighlights } from '@website/components/EditorialHighlights';
import { LandingHero } from '@website/components/LandingHero';
import { ProductShowcase } from '@website/components/ProductShowcase';
import { SiteFooter } from '@website/components/SiteFooter';
import { siteContentStyle, siteShellStyle } from '@website/theme/site-styles';

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
        '[data-site-animate="true"]',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.76,
          ease: 'power3.out',
          stagger: 0.1,
        },
      );

      gsap.utils.toArray<HTMLElement>('[data-site-panel="true"]').forEach((panel) => {
        const speed = Number(panel.dataset.speed ?? '1');

        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 40, rotate: speed === 2 ? -2 : speed === 3 ? 3 : 0 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: speed === 2 ? -2 : speed === 3 ? 3 : 0,
            duration: 0.88,
            ease: 'power3.out',
            delay: 0.18 + speed * 0.08,
          },
        );

        gsap.to(panel, {
          yPercent: -4 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-site-hero="true"]',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-site-reveal="true"]').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
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
    <Layout style={siteShellStyle}>
      <Content ref={rootRef} style={siteContentStyle}>
        <LandingHero />
        <ProductShowcase />
        <EditorialHighlights />
        <SiteFooter />
      </Content>
    </Layout>
  );
}

export default App;
