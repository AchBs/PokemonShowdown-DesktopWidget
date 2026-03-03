const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = 400;
  const winHeight = 600;
  const margin = 16;

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: screenWidth - winWidth - margin,
    y: screenHeight - winHeight - margin,
    alwaysOnTop: true,
    resizable: true,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,          // true OS-level window transparency
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');

  ipcMain.on('minimize-window', () => win.minimize());
  ipcMain.on('close-window',    () => win.close());
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
