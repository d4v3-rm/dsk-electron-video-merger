import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const sourceIconPath = path.join(projectRoot, 'build', 'icon-source.svg');
const generatedSvgPath = path.join(projectRoot, 'build', 'icon.svg');
const buildPngPath = path.join(projectRoot, 'build', 'icon.png');
const buildIcoPath = path.join(projectRoot, 'build', 'icon.ico');
const rendererPublicPngPath = path.join(projectRoot, 'src', 'renderer', 'public', 'icon.png');
const websitePublicPngPath = path.join(projectRoot, 'website', 'public', 'icon.png');

const sourceSvg = await readFile(sourceIconPath, 'utf8');

const renderPng = (size) =>
  new Resvg(sourceSvg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  })
    .render()
    .asPng();

const sizesForIco = [16, 24, 32, 48, 64, 128, 256];
const primaryPng = renderPng(512);

await mkdir(path.dirname(buildPngPath), { recursive: true });
await mkdir(path.dirname(rendererPublicPngPath), { recursive: true });
await mkdir(path.dirname(websitePublicPngPath), { recursive: true });

await copyFile(sourceIconPath, generatedSvgPath);
await writeFile(buildPngPath, primaryPng);
await writeFile(rendererPublicPngPath, primaryPng);
await writeFile(websitePublicPngPath, primaryPng);

const icoBuffer = await pngToIco(sizesForIco.map((size) => renderPng(size)));
await writeFile(buildIcoPath, icoBuffer);
