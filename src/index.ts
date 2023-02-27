import { app, BrowserView, BrowserWindow, globalShortcut, ipcMain, Menu, session } from "electron";
import os from "os";
import path from "path";
import fs from "fs";

import { autoUpdater } from "electron-updater";
import log from "electron-log";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expressServer = require("../server/proxy");

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

export const RESOURCES_PATH = app?.isPackaged
  ? path.join(app.getAppPath(), ".webpack/renderer", "assets") // path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

// const dotenv = fs.readFileSync(path.join(__dirname, '.env.json'));
// console.log(JSON.parse(dotenv.toString())['WEB_URL'], process.env.WEB_URL);
let mainWindow: Electron.BrowserWindow;

const createWindow = async (): Promise<void> => {
  // await expressServer.listen();

  // console.log(path.join(process.resourcesPath, 'assets', 'icon.png'));

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: "Touch Panel",
    resizable: false,
    transparent: false,
    kiosk: false,
    fullscreen: false,
    icon: getAssetPath('icon.png'),
    center: true,
    movable: false,
    frame: false,
    show: false,

    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.platform === "darwin") {
    app.dock.setIcon(getAssetPath("icon.png"));
  }

  ipcMain.handle("ping", (_extraData) => {
    const { Ethernet0, en0, WLAN, eth0 } = os.networkInterfaces();
    const firstInterface = Ethernet0 || eth0 || en0 || WLAN;
    const { mac, address } = firstInterface[0];
    return { mac, addr: address };
  });

  mainWindow.setMenu(null);
  mainWindow.removeMenu();

  mainWindow.on("page-title-updated", (e) => {
    e.preventDefault();
  })

  mainWindow.on("close", () => (mainWindow = null));
  mainWindow.on("ready-to-show", mainWindow.show);

  // and load the index.html of the app.
  const dotenv = fs.readFileSync(path.join(__dirname, '.env.json'));
  const dynamicUrl = JSON.parse(dotenv.toString())["WEB_URL"];
  mainWindow.loadURL(dynamicUrl || process.env.WEB_URL || MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("before-input-event", (event: Event, input: Electron.Input) => {
    if(input.type === "keyUp"){
      console.log(input);
    }
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.insertCSS("h3 a{background: red!important;}");
    // mainWindow.webContents.executeJavaScript("alert('hello, world')");
    mainWindow.webContents.insertText("'test'");
  });

  // mainWindow.webContents.on("before-input-event", (event, input) => {
  //   if (input.key == "F4" && input.alt) {
  //     console.log("Alt+F4 is pressed: Shortcut Disabled");
  //     event.preventDefault();
  //   }

  //   mainWindow.webContents.setIgnoreMenuShortcuts(input.key === "F4" && input.alt);
  // });

  // Remove this if your app does not use auto updates
  new AppUpdater();

  // Set Session
  session.defaultSession.allowNTLMCredentialsForDomains('*')
  session
    .fromPartition("some-partition")
    .setPermissionCheckHandler((_webContents, permission, _requestingOrigin) => {
      if (
        // new URL(requestingOrigin).hostname === 'some-host' &&
        permission === "notifications" ||
        permission === 'hid' ||
        permission === 'serial'
      ) {
        return true; // granted
      }

      return false; // denied
    });
  session
    .fromPartition("some-partition")
    .setPermissionRequestHandler((_webContents, permission, callback) => {
      if (permission === "notifications") {
        return callback(true); // granted.
      }

      callback(false);
    });

  mainWindow.focus();
};

Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.commandLine.appendSwitch('enable-experimental-web-platform-features')
console.log(process.env.PROXY_TO_LOCALHOST);
if (/^(true|1)$/gi.test(process.env.PROXY_TO_LOCALHOST)) {
  app.commandLine.appendSwitch("host-rules", "MAP * 127.0.0.1");
}


app.whenReady().then(createWindow).then(() => {
  app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
      console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register('Alt+CommandOrControl+I', () => {
      console.log('Electron loves global shortcuts, Alt+CommandOrControl+I!')
    });
    globalShortcut.register('CommandOrControl+T', () => {
      console.log('Electron loves global shortcuts, CommandOrControl + T!')
    });
    globalShortcut.register('CommandOrControl+N', () => {
      console.log('Electron loves global shortcuts, CommandOrControl + N!')
    });
    globalShortcut.register('CommandOrControl+W', () => {
      console.log('Electron loves global shortcuts, CommandOrControl + W!')
    });
    globalShortcut.register('CommandOrControl+Q', () => {
      console.log('Electron loves global shortcuts, CommandOrControl + Q!')
    });
    globalShortcut.register("F5", () => {
      console.log("F5 is pressed: Shortcut Disabled");
    });
    globalShortcut.register("CommandOrControl+F5", () => {
      console.log("CommandOrControl+F5 is pressed: Shortcut Disabled");
    });
    // globalShortcut.register("Alt+F4", () => {
    //   console.log("Alt+F4 is pressed: Shortcut Disabled");
    // });
  });
  app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('Alt+CommandOrControl+I');
    globalShortcut.unregister('CommandOrControl+T');
    globalShortcut.unregister('CommandOrControl+N');
    globalShortcut.unregister('CommandOrControl+W');
    globalShortcut.unregister('CommandOrControl+Q');
    globalShortcut.unregister('F5');
    globalShortcut.unregister('CommandOrControl+F5');
    // globalShortcut.unregister('Alt+F4');
  });

  const view = new BrowserView();
  mainWindow.setBrowserView(view);

  const bounds = view.getBounds();
  view.webContents.loadURL("http://localhost:8000/hello-go");
  view.webContents.on("did-finish-load", () =>
    view.setBounds({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    })
  );

  view.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: false,
  });
}).catch(console.error);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0 || !mainWindow) {
    ipcMain.removeHandler("ping");
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
}