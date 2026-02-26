import { gsap } from 'gsap';
import { useLayoutEffect, type MutableRefObject, type RefObject } from 'react';
import type { JobMode } from '@shared/types';

interface UseOverviewAnimationsOptions {
  shellRef: RefObject<HTMLDivElement | null>;
  detailsRef: RefObject<HTMLDivElement | null>;
  previousModeRef: MutableRefObject<JobMode>;
  isExpanded: boolean;
  jobMode: JobMode;
}

export const useOverviewAnimations = ({
  shellRef,
  detailsRef,
  previousModeRef,
  isExpanded,
  jobMode,
}: UseOverviewAnimationsOptions): void => {
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
  }, [detailsRef, isExpanded, shellRef]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return undefined;
    }

    const direction = previousModeRef.current === jobMode ? 0 : jobMode === 'compress' ? 1 : -1;
    const ctx = gsap.context(() => {
      const targets = shell.querySelectorAll('.overview-mode-animate');
      gsap.killTweensOf(targets);
      gsap.fromTo(
        targets,
        {
          autoAlpha: 0,
          x: direction * 18,
          y: 8,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.28,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
      );
    }, shell);

    previousModeRef.current = jobMode;

    return () => {
      ctx.revert();
    };
  }, [jobMode, previousModeRef, shellRef]);
};
