import { app, BrowserWindow, type Input } from 'electron';
import path from 'node:path';
import electronAppConfigJson from '../../electron.app.config.json';
import { initializeIpc } from './ipc/ipc-routes';
import { JobService } from './services/job.service';
import { StorageService } from './services/storage.service';
import { FilePickerService } from './services/file-picker.service';
import { FfmpegService } from './services/ffmpeg.service';

type DevToolsMode = 'right' | 'left' | 'bottom' | 'undocked' | 'detach';

type ElectronAppConfig = {
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

const electronAppConfig = electronAppConfigJson as ElectronAppConfig;

let mainWindow: BrowserWindow | null = null;
let jobService: JobService | null = null;

const getDevServerUrl = (): string =>
  process.env.VITE_DEV_SERVER_URL ?? electronAppConfig.runtime.defaultDevServerUrl;
const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
const shouldOpenDevTools = (): boolean =>
  process.env[electronAppConfig.runtime.devTools.toggleEnvVar] === 'true';
const getWindowIconPath = (): string =>
  isDevelopment()
    ? path.resolve(app.getAppPath(), 'src/renderer/public', electronAppConfig.runtime.rendererIconFile)
    : path.resolve(__dirname, '../renderer', electronAppConfig.runtime.rendererIconFile);

const isDevToolsShortcut = (input: Input): boolean => {
  const key = input.key.toLowerCase();
  const { primaryKey, secondaryKey, secondaryModifiers } = electronAppConfig.runtime.devTools.shortcut;

  return (
    key === primaryKey ||
    (Boolean(secondaryModifiers.control) === input.control &&
      Boolean(secondaryModifiers.shift) === input.shift &&
      key === secondaryKey)
  );
};

const wireDevelopmentShortcuts = (window: BrowserWindow): void => {
  if (!isDevelopment()) {
    return;
  }

  window.webContents.on('before-input-event', (event, input) => {
    if (!isDevToolsShortcut(input)) {
      return;
    }

    event.preventDefault();

    if (window.webContents.isDevToolsOpened()) {
      window.webContents.closeDevTools();
      return;
    }

    window.webContents.openDevTools({ mode: electronAppConfig.runtime.devTools.mode });
  });
};

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    width: electronAppConfig.runtime.window.width,
    height: electronAppConfig.runtime.window.height,
    minWidth: electronAppConfig.runtime.window.minWidth,
    minHeight: electronAppConfig.runtime.window.minHeight,
    title: electronAppConfig.productName,
    icon: getWindowIconPath(),
    show: false,
    backgroundColor: electronAppConfig.runtime.backgroundColor,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  wireDevelopmentShortcuts(mainWindow);

  const storageService = new StorageService();
  const ffmpegService = new FfmpegService();
  jobService = new JobService(storageService, ffmpegService);
  jobService.setWindow(mainWindow);
  initializeIpc(jobService, new FilePickerService());

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDevelopment()) {
    await mainWindow.loadURL(getDevServerUrl());

    if (shouldOpenDevTools()) {
      mainWindow.webContents.openDevTools({ mode: electronAppConfig.runtime.devTools.mode });
    }
  } else {
    const htmlPath = path.resolve(__dirname, '../renderer/index.html');
    await mainWindow.loadFile(htmlPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    jobService?.setWindow(null);
  });
};

app.whenReady().then(() => {
  void createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
