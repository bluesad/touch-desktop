import { app, BrowserWindow, globalShortcut } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import log from "electron-log";

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    resizable: false,
    transparent: false,
    kiosk: false,
    center: true,
    fullscreen: false,
    // frame: false,
    movable: false,
    show: false,

    icon: 'src/images/AppIconGenerator.png',

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenu(null);
  mainWindow.removeMenu();

  const startUrl = process.env.WEB_URL || path.join(__dirname, "../index.html");

  // and load the index.html of the app.
  mainWindow.loadFile(startUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("close", () => (mainWindow = null));

  mainWindow.on("ready-to-show", mainWindow.show);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0 || mainWindow === null)
      createWindow();
  });

  app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
      console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register("F5", () => {
      console.log("F5 is pressed: Shortcut Disabled");
    });
    globalShortcut.register("CommandOrControl+F5", () => {
      console.log("CommandOrControl+F5 is pressed: Shortcut Disabled");
    });
  });
  app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
    globalShortcut.unregister('CommandOrControl+F5');
  });

}).catch(console.log);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
}