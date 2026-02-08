import { Layout } from 'antd';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { FeatureGrid } from '@website/components/FeatureGrid';
import { LandingHero } from '@website/components/LandingHero';
import { ProductShowcase } from '@website/components/ProductShowcase';
import { SiteFooter } from '@website/components/SiteFooter';

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
        '.site-animate',
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
        },
      );

      gsap.utils.toArray<HTMLElement>('.site-shot-card').forEach((card) => {
        const speed = Number(card.dataset.speed ?? '1');

        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40, rotate: speed === 2 ? -3 : speed === 3 ? 4 : 0 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: speed === 2 ? -3 : speed === 3 ? 4 : 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.18 + speed * 0.08,
          },
        );

        gsap.to(card, {
          yPercent: -6 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: '.site-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.site-float-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            delay: 0.42 + index * 0.1,
          },
        );

        gsap.to(card, {
          yPercent: -4 - index * 2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.site-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      gsap.to('.site-hero-copy', {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.site-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.site-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.84,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
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
    <Layout className="site-shell">
      <Content className="site-content" ref={rootRef}>
        <LandingHero />
        <ProductShowcase />
        <FeatureGrid />
        <SiteFooter />
      </Content>
    </Layout>
  );
}

export default App;
