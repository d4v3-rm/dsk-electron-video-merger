#!/usr/bin/env node

'use strict';

const path = require('node:path');
const { spawn } = require('node:child_process');
const { URL } = require('node:url');
const waitOn = require('wait-on');

const projectRoot = path.resolve(__dirname, '..');
const electronAppConfig = require(path.join(projectRoot, 'electron.app.config.json'));
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? electronAppConfig.runtime.defaultDevServerUrl;
const devServerHost = new URL(devServerUrl).host;

const runCommand = (command, args, extraEnv = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      env: {
        ...process.env,
        ...extraEnv,
      },
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });

const run = async () => {
  await waitOn({
    resources: [`tcp:${devServerHost}`],
    timeout: 60000,
  });

  await runCommand(npmCommand, ['run', 'build:main']);

  await runCommand(process.execPath, ['./scripts/run-electron.cjs'], {
    NODE_ENV: 'development',
    VITE_DEV_SERVER_URL: devServerUrl,
  });
};

run().catch((error) => {
  console.error('Failed to start Electron main process:', error.message);
  process.exit(1);
});
