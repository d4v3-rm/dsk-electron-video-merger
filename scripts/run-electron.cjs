#!/usr/bin/env node

'use strict';

const path = require('node:path');
const { spawn } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const electronCliPath = path.join(projectRoot, 'node_modules', 'electron', 'cli.js');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(process.execPath, [electronCliPath, '.'], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error('Failed to start Electron:', error.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (typeof code === 'number') {
    process.exit(code);
  }

  if (signal) {
    process.exit(1);
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    child.kill(signal);
  });
}
