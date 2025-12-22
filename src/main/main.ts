import { app, BrowserWindow, type Input } from 'electron';
import path from 'node:path';
import { initializeIpc } from './ipc/ipc-routes';
import { JobService } from './services/job.service';
import { StorageService } from './services/storage.service';
import { FilePickerService } from './services/file-picker.service';
import { FfmpegService } from './services/ffmpeg.service';

const APP_NAME = 'VideoMerger';
const DEFAULT_BACKGROUND_COLOR = '#0f172a';
const DEFAULT_DEV_SERVER_URL = 'http://127.0.0.1:5173';

let mainWindow: BrowserWindow | null = null;
let jobService: JobService | null = null;

const getDevServerUrl = (): string => process.env.VITE_DEV_SERVER_URL ?? DEFAULT_DEV_SERVER_URL;
const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
const shouldOpenDevTools = (): boolean => process.env.ELECTRON_OPEN_DEVTOOLS === 'true';
const getWindowIconPath = (): string =>
  isDevelopment()
    ? path.resolve(app.getAppPath(), 'src/renderer/public/icon.png')
    : path.resolve(__dirname, '../renderer/icon.png');

const isDevToolsShortcut = (input: Input): boolean => {
  const key = input.key.toLowerCase();
  return key === 'f12' || (input.control && input.shift && key === 'i');
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

    window.webContents.openDevTools({ mode: 'right' });
  });
};

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    title: APP_NAME,
    icon: getWindowIconPath(),
    show: false,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
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
      mainWindow.webContents.openDevTools({ mode: 'right' });
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
