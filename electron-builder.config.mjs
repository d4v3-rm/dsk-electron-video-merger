import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const electronAppConfig = require(path.resolve(__dirname, 'electron.app.config.json'));

export default {
  appId: electronAppConfig.appId,
  productName: electronAppConfig.productName,
  icon: electronAppConfig.builder.iconPng,
  directories: electronAppConfig.builder.directories,
  files: electronAppConfig.builder.files,
  asar: electronAppConfig.builder.asar,
  win: {
    icon: electronAppConfig.builder.iconIco,
    signAndEditExecutable: false,
    target: [
      {
        target: 'portable',
        arch: electronAppConfig.builder.winArch,
      },
    ],
  },
  portable: {
    artifactName: electronAppConfig.builder.portableArtifactName,
  },
};
