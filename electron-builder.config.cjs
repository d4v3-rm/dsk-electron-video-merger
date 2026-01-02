const path = require('node:path');

const electronAppConfig = require(path.resolve(__dirname, 'electron.app.config.json'));

module.exports = {
  appId: electronAppConfig.appId,
  productName: electronAppConfig.productName,
  icon: electronAppConfig.builder.iconPng,
  directories: electronAppConfig.builder.directories,
  files: electronAppConfig.builder.files,
  asar: electronAppConfig.builder.asar,
  win: {
    icon: electronAppConfig.builder.iconIco,
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
