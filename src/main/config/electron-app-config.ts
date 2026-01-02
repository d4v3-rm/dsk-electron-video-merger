import fs from 'node:fs';
import path from 'node:path';

export type DevToolsMode = 'right' | 'left' | 'bottom' | 'undocked' | 'detach';

export type ElectronAppConfig = {
  appId: string;
  productName: string;
  runtime: {
    defaultDevServerUrl: string;
    backgroundColor: string;
    rendererIconFile: string;
    window: {
      width: number;
      height: number;
      minWidth: number;
      minHeight: number;
    };
    devTools: {
      mode: DevToolsMode;
      toggleEnvVar: string;
      shortcut: {
        primaryKey: string;
        secondaryKey: string;
        secondaryModifiers: {
          control: boolean;
          shift: boolean;
        };
      };
    };
  };
};

const electronAppConfigPath = path.resolve(__dirname, '../../../electron.app.config.json');

export const electronAppConfig = JSON.parse(
  fs.readFileSync(electronAppConfigPath, 'utf8'),
) as ElectronAppConfig;
