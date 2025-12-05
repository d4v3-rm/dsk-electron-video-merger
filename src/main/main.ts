import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { initializeIpc } from './ipc/ipc-routes';
import { JobService } from './services/job.service';
import { StorageService } from './services/storage.service';
import { FilePickerService } from './services/file-picker.service';
import { FfmpegService } from './services/ffmpeg.service';

const APP_NAME = 'VideoMerger';

let mainWindow: BrowserWindow | null = null;
let jobService: JobService | null = null;

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    title: APP_NAME,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const storageService = new StorageService();
  const ffmpegService = new FfmpegService();
  jobService = new JobService(storageService, ffmpegService);
  jobService.setWindow(mainWindow);
  initializeIpc(jobService, new FilePickerService());

  const isDev = !app.isPackaged;
  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
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
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
