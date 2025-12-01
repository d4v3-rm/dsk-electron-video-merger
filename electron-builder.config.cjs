module.exports = {
  appId: 'com.videomerger.desktop',
  productName: 'VideoMerger',
  directories: {
    output: 'dist/packaged',
    buildResources: 'build'
  },
  files: [
    'dist/main/**/*',
    'dist/renderer/**/*',
    'package.json'
  ],
  asar: true,
  win: {
    target: [
      {
        target: 'portable',
        arch: ['x64']
      }
    ]
  },
  portable: {
    artifactName: 'VideoMerger-${version}-portable.exe'
  }
};
