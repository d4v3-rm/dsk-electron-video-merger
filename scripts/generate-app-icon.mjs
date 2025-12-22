import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const sourceIconPath = path.join(projectRoot, 'build', 'icon-source-material-movie.svg');
const generatedSvgPath = path.join(projectRoot, 'build', 'icon.svg');
const buildPngPath = path.join(projectRoot, 'build', 'icon.png');
const buildIcoPath = path.join(projectRoot, 'build', 'icon.ico');
const publicPngPath = path.join(projectRoot, 'src', 'renderer', 'public', 'icon.png');

const sourceSvg = await readFile(sourceIconPath, 'utf8');
const viewBoxMatch = sourceSvg.match(/viewBox="([^"]+)"/);
const innerMarkup = sourceSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const sourceViewBox = viewBoxMatch?.[1] ?? '0 0 24 24';

const appIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="148" y1="120" x2="896" y2="916" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#08111f" />
      <stop offset="58%" stop-color="#0f2d59" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <radialGradient id="glowPrimary" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(280 240) rotate(47.8) scale(484.673 392.725)">
      <stop stop-color="#38BDF8" stop-opacity="0.34" />
      <stop offset="1" stop-color="#38BDF8" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowSecondary" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(794 816) rotate(180) scale(384 312)">
      <stop stop-color="#7DD3FC" stop-opacity="0.24" />
      <stop offset="1" stop-color="#7DD3FC" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="38" y="46" width="948" height="948" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset dy="20" />
      <feGaussianBlur stdDeviation="34" />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.00784314 0 0 0 0 0.0941176 0 0 0 0 0.266667 0 0 0 0.38 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
    </filter>
  </defs>

  <g filter="url(#shadow)">
    <rect x="92" y="72" width="840" height="840" rx="220" fill="url(#bg)" />
    <rect x="92.5" y="72.5" width="839" height="839" rx="219.5" stroke="#E2E8F0" stroke-opacity="0.18" />
  </g>

  <circle cx="292" cy="230" r="220" fill="url(#glowPrimary)" />
  <circle cx="798" cy="812" r="174" fill="url(#glowSecondary)" />

  <path
    d="M726 790c0 14.359-11.641 26-26 26H324c-14.359 0-26-11.641-26-26s11.641-26 26-26h376c14.359 0 26 11.641 26 26Z"
    fill="#E2E8F0"
    fill-opacity="0.14"
  />
  <path
    d="M648 790c0 14.359-11.641 26-26 26H324c-14.359 0-26-11.641-26-26s11.641-26 26-26h298c14.359 0 26 11.641 26 26Z"
    fill="#38BDF8"
  />

  <g transform="translate(232 214) scale(23.3333333333)" fill="#F8FAFC">
    <svg viewBox="${sourceViewBox}" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="#F8FAFC">
        ${innerMarkup}
      </g>
    </svg>
  </g>
</svg>
`;

const renderPng = (size) =>
  new Resvg(appIconSvg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  })
    .render()
    .asPng();

const sizesForIco = [16, 24, 32, 48, 64, 128, 256];

await mkdir(path.dirname(buildPngPath), { recursive: true });
await mkdir(path.dirname(publicPngPath), { recursive: true });

await writeFile(generatedSvgPath, appIconSvg, 'utf8');
await writeFile(buildPngPath, renderPng(512));
await writeFile(publicPngPath, renderPng(512));

const icoBuffer = await pngToIco(sizesForIco.map((size) => renderPng(size)));
await writeFile(buildIcoPath, icoBuffer);
