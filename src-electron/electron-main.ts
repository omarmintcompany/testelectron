import { app, BrowserWindow, nativeTheme, autoUpdater  } from "electron";
import { initialize, enable } from "@electron/remote/main"; // <-- add this
import path from "path";
import os from "os";

initialize(); // <-- add this

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false, // <-- add this
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, "electron-preload.js"),
    },
  });

  enable(mainWindow.webContents); // <-- add this

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');


app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});


function checkForUpdates() {
  // Configura la URL del servidor de actualizaciones en tu electron-builder.yml
  autoUpdater.setFeedURL({
    url: 'https://github.com/omarmintcompany/testelectron',
    private: false, // Opcional, dependiendo de tu configuración de releases
  });


  // Comprueba actualizaciones
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', () => {
    // Hay una actualización disponible, puedes notificar al usuario o tomar acciones adicionales
  });

  autoUpdater.on('update-not-available', () => {
    // No hay actualizaciones disponibles
  });

  autoUpdater.on('download-progress', (progressObj: any) => {
    // Progreso de la descarga
    const { percent } = progressObj;
    console.log(`Descargando: ${percent}%`);
  });


  autoUpdater.on('update-downloaded', () => {
    // La actualización ha sido descargada completamente
    // Puedes notificar al usuario y pedirle que reinicie la aplicación para aplicar la actualización
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (err) => {
    // Maneja errores de actualización
    console.error('Error durante la actualización:', err.message);
  });
}

// Llama a la función cuando la aplicación esté lista
app.whenReady().then(() => {
  checkForUpdates();
});
