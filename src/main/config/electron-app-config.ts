import fs from 'node:fs';
import path from 'node:path';
import type { ElectronAppConfig } from '@main/config/electron-app-config.types';

const electronAppConfigPath = path.resolve(__dirname, '../../../electron.app.config.json');

export const electronAppConfig = JSON.parse(
  fs.readFileSync(electronAppConfigPath, 'utf8'),
) as ElectronAppConfig;
