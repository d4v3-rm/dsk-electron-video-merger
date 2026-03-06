import type { CSSProperties } from 'react';
import { sitePalette } from '@website/theme/site-theme';

type SiteShotPanelVariant = 'primary' | 'secondary' | 'tertiary';

const siteHeadingFontFamily = "'Space Grotesk', 'Inter', sans-serif";

export const siteShellStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'transparent',
};

export const siteContentStyle: CSSProperties = {
  background: 'transparent',
};

export const createSiteSectionShellStyle = (compact: boolean): CSSProperties => ({
  width: compact ? 'min(100%, calc(100% - 32px))' : 'min(1320px, calc(100% - 48px))',
  margin: '0 auto',
});

export const createHeroStyle = (mobile: boolean): CSSProperties => ({
  minHeight: mobile ? 'auto' : '100vh',
  padding: mobile ? '18px 0 28px' : '22px 0 26px',
});

export const createTopbarStyle = (mobile: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: mobile ? 'flex-start' : 'center',
  justifyContent: 'space-between',
  flexDirection: mobile ? 'column' : 'row',
  gap: 20,
  padding: '4px 0 18px',
});

export const brandBlockStyle: CSSProperties = {
  maxWidth: 420,
};

export const siteTagStyle: CSSProperties = {
  margin: 0,
  padding: '6px 12px',
  borderRadius: 999,
  border: `1px solid ${sitePalette.accentSoft}`,
  background: sitePalette.surfaceAlt,
  color: sitePalette.text,
};

export const siteLabelStyle: CSSProperties = {
  color: sitePalette.accent,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
};

export const topbarCopyStyle: CSSProperties = {
  margin: '4px 0 0',
  lineHeight: 1.55,
  color: sitePalette.textSecondary,
};

export const createHeroGridStyle = (desktop: boolean): CSSProperties => ({
  minHeight: desktop ? 'calc(100vh - 96px)' : 'auto',
});

export const heroCopyStyle: CSSProperties = {
  width: '100%',
  maxWidth: 520,
};

export const createHeroTitleStyle = (wide: boolean): CSSProperties => ({
  margin: '10px 0 0',
  maxWidth: wide ? '10ch' : 'none',
  color: '#ffffff',
  fontFamily: siteHeadingFontFamily,
  lineHeight: 1.04,
  fontSize: 'clamp(2.5rem, 4.3vw, 4.6rem)',
});

export const heroDescriptionStyle: CSSProperties = {
  margin: '12px 0 0',
  lineHeight: 1.65,
  color: sitePalette.textSecondary,
};

export const factListStyle: CSSProperties = {
  display: 'grid',
  width: '100%',
  maxWidth: 480,
};

export const factRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '12px 0 0',
  borderTop: `1px solid ${sitePalette.border}`,
};

export const factValueStyle: CSSProperties = {
  color: sitePalette.text,
  fontWeight: 600,
};

export const createShotStageStyle = (mobile: boolean, desktop: boolean): CSSProperties =>
  mobile
    ? {
        minHeight: 'auto',
        display: 'grid',
        gap: 16,
      }
    : {
        position: 'relative',
        minHeight: desktop ? 680 : 620,
        marginTop: desktop ? 0 : 6,
      };

export const createShotPanelStyle = (variant: SiteShotPanelVariant, mobile: boolean): CSSProperties => {
  const baseStyle: CSSProperties = {
    overflow: 'hidden',
    padding: 12,
    borderRadius: 28,
    border: `1px solid ${sitePalette.border}`,
    background: sitePalette.surface,
  };

  if (mobile) {
    return {
      ...baseStyle,
      position: 'relative',
      width: '100%',
      maxWidth: 'none',
    };
  }

  if (variant === 'primary') {
    return {
      ...baseStyle,
      position: 'absolute',
      top: '2%',
      left: '17%',
      width: '66%',
      zIndex: 3,
    };
  }

  if (variant === 'secondary') {
    return {
      ...baseStyle,
      position: 'absolute',
      top: '35%',
      left: 0,
      width: '54%',
      zIndex: 2,
    };
  }

  return {
    ...baseStyle,
    position: 'absolute',
    top: '48%',
    right: 0,
    width: '56%',
    zIndex: 1,
  };
};

export const siteImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: 18,
};

export const sectionStyle: CSSProperties = {
  padding: '46px 0 10px',
};

export const createSectionHeadingStyle = (tight = false): CSSProperties => ({
  maxWidth: 680,
  marginBottom: tight ? 16 : 22,
});

export const sectionTitleStyle: CSSProperties = {
  margin: '10px 0 0',
  color: '#ffffff',
  fontFamily: siteHeadingFontFamily,
  lineHeight: 1.04,
};

export const sectionParagraphStyle: CSSProperties = {
  color: sitePalette.textSecondary,
};

export const mediaFigureStyle: CSSProperties = {
  overflow: 'hidden',
  padding: 12,
  borderRadius: 28,
  border: `1px solid ${sitePalette.border}`,
  background: sitePalette.surface,
};

export const storyListStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
};

export const storyRowStyle: CSSProperties = {
  paddingTop: 16,
  borderTop: `1px solid ${sitePalette.border}`,
};

export const createSecondaryFiguresStyle = (compact: boolean): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: compact ? '1fr' : 'repeat(2, minmax(0, 1fr))',
  gap: 20,
  marginTop: 20,
});

export const highlightListStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
};

export const createHighlightRowStyle = (mobile: boolean): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: mobile ? '1fr' : '72px minmax(0, 1fr)',
  gap: mobile ? 10 : 16,
  paddingTop: 16,
  borderTop: `1px solid ${sitePalette.border}`,
});

export const footerStyle: CSSProperties = {
  padding: '40px 0 48px',
};

export const footerShellStyle: CSSProperties = {
  display: 'grid',
  gap: 18,
  paddingTop: 22,
  borderTop: `1px solid ${sitePalette.border}`,
};

export const createFooterActionsStyle = (mobile: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: mobile ? 'flex-start' : 'center',
  justifyContent: 'space-between',
  flexDirection: mobile ? 'column' : 'row',
  gap: 18,
});
