import { useEffect, useState } from 'react';

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

const getInitialHoverCapability = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(HOVER_QUERY).matches;
};

export const useCanHover = () => {
  const [canHover, setCanHover] = useState(getInitialHoverCapability);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(HOVER_QUERY);
    const handleChange = (event: { matches: boolean }) => {
      setCanHover(event.matches);
    };

    setCanHover(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return canHover;
};
