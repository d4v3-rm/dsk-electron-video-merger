module.exports = {
  appId: 'com.videomerger.desktop',
  productName: 'VideoMerger',
  icon: 'icon.png',
  directories: {
    output: 'dist/packaged',
    buildResources: 'build',
  },
  files: ['dist/main/**/*', 'dist/shared/**/*', 'dist/renderer/**/*', 'package.json'],
  asar: true,
  win: {
    icon: 'icon.ico',
    target: [
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
  },
  portable: {
    artifactName: 'VideoMerger-${version}-portable.exe',
  },
};
