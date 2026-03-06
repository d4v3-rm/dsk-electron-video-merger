export interface SiteScreen {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
}

import screen1 from '../../../assets/screen-1.png';
import screen2 from '../../../assets/screen-2.png';
import screen3 from '../../../assets/screen-3.png';

export const productScreens: SiteScreen[] = [
  {
    src: screen1,
    alt: 'Merge workspace with overview, switcher, and setup panel',
    eyebrow: 'Merge workspace',
    title: 'The full merge surface stays readable from overview to export controls.',
    description:
      'Hero, workspace switcher, runtime counters, and setup panels remain in one coherent dark UI.',
  },
  {
    src: screen2,
    alt: 'Merge setup with export profile and execution notes',
    eyebrow: 'Export planning',
    title: 'Formats, compression profile, backend, and destination are visible before launch.',
    description:
      'The setup flow exposes output routing and technical compression labels without hiding the operational detail.',
  },
  {
    src: screen3,
    alt: 'Compression workspace with job history panel',
    eyebrow: 'History and review',
    title: 'Compression mode reuses the same workspace language with a different output model.',
    description:
      'The history board keeps progress, status, and output references accessible from a single panel.',
  },
];
