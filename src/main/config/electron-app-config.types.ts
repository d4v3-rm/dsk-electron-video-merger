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
