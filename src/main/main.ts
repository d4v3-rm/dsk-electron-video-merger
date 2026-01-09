import { app, BrowserWindow, type Input } from 'electron';
import path from 'node:path';
import { electronAppConfig } from '@main/config/electron-app-config';
import { initializeIpc } from '@main/ipc/ipc-routes';
import { MainProcessServices } from '@main/services/main-process-services';

let mainWindow: BrowserWindow | null = null;

const services = MainProcessServices.getInstance();

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
    autoHideMenuBar: !isDevelopment(),
    backgroundColor: electronAppConfig.runtime.backgroundColor,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (!isDevelopment()) {
    mainWindow.removeMenu();
    mainWindow.setMenuBarVisibility(false);
  }

  wireDevelopmentShortcuts(mainWindow);

  services.jobService.setWindow(mainWindow);
  initializeIpc(services.jobService, services.filePickerService);

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
    services.jobService.setWindow(null);
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
