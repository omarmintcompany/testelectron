"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src-electron/electron-main.ts
var import_electron = require("electron");
var import_main = require("@electron/remote/main");
var import_path = __toESM(require("path"));
var import_os = __toESM(require("os"));
(0, import_main.initialize)();
var platform = process.platform || import_os.default.platform();
try {
  if (platform === "win32" && import_electron.nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      import_path.default.join(import_electron.app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {
}
var mainWindow;
function createWindow() {
  mainWindow = new import_electron.BrowserWindow({
    width: 1e3,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      sandbox: false,
      preload: import_path.default.join(__dirname, "electron-preload.js")
    }
  });
  (0, import_main.enable)(mainWindow.webContents);
  mainWindow.loadURL("http://localhost:9300");
  if (true) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow == null ? void 0 : mainWindow.webContents.closeDevTools();
    });
  }
  mainWindow.on("closed", () => {
    mainWindow = void 0;
  });
}
import_electron.app.whenReady().then(createWindow);
import_electron.app.commandLine.appendSwitch("ignore-certificate-errors", "true");
import_electron.app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (mainWindow === void 0) {
    createWindow();
  }
});
function checkForUpdates() {
  import_electron.autoUpdater.setFeedURL({
    url: "https://github.com/tu-usuario/tu-repo/releases/latest",
    private: false
  });
  import_electron.autoUpdater.checkForUpdates();
  import_electron.autoUpdater.on("update-available", () => {
  });
  import_electron.autoUpdater.on("update-not-available", () => {
  });
  import_electron.autoUpdater.on("download-progress", (progressObj) => {
    const { percent } = progressObj;
    console.log(`Descargando: ${percent}%`);
  });
  import_electron.autoUpdater.on("update-downloaded", () => {
    import_electron.autoUpdater.quitAndInstall();
  });
  import_electron.autoUpdater.on("error", (err) => {
    console.error("Error durante la actualizaci\xF3n:", err.message);
  });
}
import_electron.app.whenReady().then(() => {
  checkForUpdates();
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgbmF0aXZlVGhlbWUsIGF1dG9VcGRhdGVyICB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZSwgZW5hYmxlIH0gZnJvbSBcIkBlbGVjdHJvbi9yZW1vdGUvbWFpblwiOyAvLyA8LS0gYWRkIHRoaXNcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XG5cbmluaXRpYWxpemUoKTsgLy8gPC0tIGFkZCB0aGlzXG5cbi8vIG5lZWRlZCBpbiBjYXNlIHByb2Nlc3MgaXMgdW5kZWZpbmVkIHVuZGVyIExpbnV4XG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKTtcblxudHJ5IHtcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSkge1xuICAgIHJlcXVpcmUoXCJmc1wiKS51bmxpbmtTeW5jKFxuICAgICAgcGF0aC5qb2luKGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIiksIFwiRGV2VG9vbHMgRXh0ZW5zaW9uc1wiKVxuICAgICk7XG4gIH1cbn0gY2F0Y2ggKF8pIHt9XG5cbmxldCBtYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG4gICAqL1xuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHdpZHRoOiAxMDAwLFxuICAgIGhlaWdodDogNjAwLFxuICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxuICAgIGZyYW1lOiBmYWxzZSwgLy8gPC0tIGFkZCB0aGlzXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIHNhbmRib3g6IGZhbHNlLFxuICAgICAgcHJlbG9hZDogcGF0aC5qb2luKF9fZGlybmFtZSwgXCJlbGVjdHJvbi1wcmVsb2FkLmpzXCIpLFxuICAgIH0sXG4gIH0pO1xuXG4gIGVuYWJsZShtYWluV2luZG93LndlYkNvbnRlbnRzKTsgLy8gPC0tIGFkZCB0aGlzXG5cbiAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpIHtcbiAgICAvLyBpZiBvbiBERVYgb3IgUHJvZHVjdGlvbiB3aXRoIGRlYnVnIGVuYWJsZWRcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICB9IGVsc2Uge1xuICAgIC8vIHdlJ3JlIG9uIHByb2R1Y3Rpb247IG5vIGFjY2VzcyB0byBkZXZ0b29scyBwbHNcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKFwiZGV2dG9vbHMtb3BlbmVkXCIsICgpID0+IHtcbiAgICAgIG1haW5XaW5kb3c/LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT4ge1xuICAgIG1haW5XaW5kb3cgPSB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG5hcHAud2hlblJlYWR5KCkudGhlbihjcmVhdGVXaW5kb3cpO1xuYXBwLmNvbW1hbmRMaW5lLmFwcGVuZFN3aXRjaCgnaWdub3JlLWNlcnRpZmljYXRlLWVycm9ycycsICd0cnVlJyk7XG5cblxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT4ge1xuICBpZiAocGxhdGZvcm0gIT09IFwiZGFyd2luXCIpIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKFwiYWN0aXZhdGVcIiwgKCkgPT4ge1xuICBpZiAobWFpbldpbmRvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gIH1cbn0pO1xuXG5cbmZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlcygpIHtcbiAgLy8gQ29uZmlndXJhIGxhIFVSTCBkZWwgc2Vydmlkb3IgZGUgYWN0dWFsaXphY2lvbmVzIGVuIHR1IGVsZWN0cm9uLWJ1aWxkZXIueW1sXG4gIGF1dG9VcGRhdGVyLnNldEZlZWRVUkwoe1xuICAgIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS90dS11c3VhcmlvL3R1LXJlcG8vcmVsZWFzZXMvbGF0ZXN0JyxcbiAgICBwcml2YXRlOiBmYWxzZSwgLy8gT3BjaW9uYWwsIGRlcGVuZGllbmRvIGRlIHR1IGNvbmZpZ3VyYWNpXHUwMEYzbiBkZSByZWxlYXNlc1xuICB9KTtcblxuXG4gIC8vIENvbXBydWViYSBhY3R1YWxpemFjaW9uZXNcbiAgYXV0b1VwZGF0ZXIuY2hlY2tGb3JVcGRhdGVzKCk7XG5cbiAgYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1hdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgLy8gSGF5IHVuYSBhY3R1YWxpemFjaVx1MDBGM24gZGlzcG9uaWJsZSwgcHVlZGVzIG5vdGlmaWNhciBhbCB1c3VhcmlvIG8gdG9tYXIgYWNjaW9uZXMgYWRpY2lvbmFsZXNcbiAgfSk7XG5cbiAgYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1ub3QtYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgIC8vIE5vIGhheSBhY3R1YWxpemFjaW9uZXMgZGlzcG9uaWJsZXNcbiAgfSk7XG5cbiAgYXV0b1VwZGF0ZXIub24oJ2Rvd25sb2FkLXByb2dyZXNzJywgKHByb2dyZXNzT2JqOiBhbnkpID0+IHtcbiAgICAvLyBQcm9ncmVzbyBkZSBsYSBkZXNjYXJnYVxuICAgIGNvbnN0IHsgcGVyY2VudCB9ID0gcHJvZ3Jlc3NPYmo7XG4gICAgY29uc29sZS5sb2coYERlc2NhcmdhbmRvOiAke3BlcmNlbnR9JWApO1xuICB9KTtcblxuXG4gIGF1dG9VcGRhdGVyLm9uKCd1cGRhdGUtZG93bmxvYWRlZCcsICgpID0+IHtcbiAgICAvLyBMYSBhY3R1YWxpemFjaVx1MDBGM24gaGEgc2lkbyBkZXNjYXJnYWRhIGNvbXBsZXRhbWVudGVcbiAgICAvLyBQdWVkZXMgbm90aWZpY2FyIGFsIHVzdWFyaW8geSBwZWRpcmxlIHF1ZSByZWluaWNpZSBsYSBhcGxpY2FjaVx1MDBGM24gcGFyYSBhcGxpY2FyIGxhIGFjdHVhbGl6YWNpXHUwMEYzblxuICAgIGF1dG9VcGRhdGVyLnF1aXRBbmRJbnN0YWxsKCk7XG4gIH0pO1xuXG4gIGF1dG9VcGRhdGVyLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAvLyBNYW5lamEgZXJyb3JlcyBkZSBhY3R1YWxpemFjaVx1MDBGM25cbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJhbnRlIGxhIGFjdHVhbGl6YWNpXHUwMEYzbjonLCBlcnIubWVzc2FnZSk7XG4gIH0pO1xufVxuXG4vLyBMbGFtYSBhIGxhIGZ1bmNpXHUwMEYzbiBjdWFuZG8gbGEgYXBsaWNhY2lcdTAwRjNuIGVzdFx1MDBFOSBsaXN0YVxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICBjaGVja0ZvclVwZGF0ZXMoKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQThEO0FBQzlELGtCQUFtQztBQUNuQyxrQkFBaUI7QUFDakIsZ0JBQWU7QUFBQSxJQUVmLHdCQUFXO0FBR1gsSUFBTSxXQUFXLFFBQVEsWUFBWSxVQUFBQSxRQUFHLFNBQVM7QUFFakQsSUFBSTtBQUNGLE1BQUksYUFBYSxXQUFXLDRCQUFZLHdCQUF3QixNQUFNO0FBQ3BFLFlBQVEsTUFBTTtBQUFBLE1BQ1osWUFBQUMsUUFBSyxLQUFLLG9CQUFJLFFBQVEsVUFBVSxHQUFHLHFCQUFxQjtBQUFBLElBQzFEO0FBQUEsRUFDRjtBQUNGLFNBQVMsR0FBUDtBQUFXO0FBRWIsSUFBSTtBQUVKLFNBQVMsZUFBZTtBQUl0QixlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixnQkFBZ0I7QUFBQSxJQUNoQixPQUFPO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxNQUNkLFNBQVM7QUFBQSxNQUNULFNBQVMsWUFBQUEsUUFBSyxLQUFLLFdBQVcscUJBQXFCO0FBQUEsSUFDckQ7QUFBQSxFQUNGLENBQUM7QUFFRCwwQkFBTyxXQUFXLFdBQVc7QUFFN0IsYUFBVyxRQUFRLHVCQUFtQjtBQUV0QyxNQUFJLE1BQXVCO0FBRXpCLGVBQVcsWUFBWSxhQUFhO0FBQUEsRUFDdEMsT0FBTztBQUVMLGVBQVcsWUFBWSxHQUFHLG1CQUFtQixNQUFNO0FBQ2pELCtDQUFZLFlBQVk7QUFBQSxJQUMxQixDQUFDO0FBQUEsRUFDSDtBQUVBLGFBQVcsR0FBRyxVQUFVLE1BQU07QUFDNUIsaUJBQWE7QUFBQSxFQUNmLENBQUM7QUFDSDtBQUVBLG9CQUFJLFVBQVUsRUFBRSxLQUFLLFlBQVk7QUFDakMsb0JBQUksWUFBWSxhQUFhLDZCQUE2QixNQUFNO0FBR2hFLG9CQUFJLEdBQUcscUJBQXFCLE1BQU07QUFDaEMsTUFBSSxhQUFhLFVBQVU7QUFDekIsd0JBQUksS0FBSztBQUFBLEVBQ1g7QUFDRixDQUFDO0FBRUQsb0JBQUksR0FBRyxZQUFZLE1BQU07QUFDdkIsTUFBSSxlQUFlLFFBQVc7QUFDNUIsaUJBQWE7QUFBQSxFQUNmO0FBQ0YsQ0FBQztBQUdELFNBQVMsa0JBQWtCO0FBRXpCLDhCQUFZLFdBQVc7QUFBQSxJQUNyQixLQUFLO0FBQUEsSUFDTCxTQUFTO0FBQUEsRUFDWCxDQUFDO0FBSUQsOEJBQVksZ0JBQWdCO0FBRTVCLDhCQUFZLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxFQUV6QyxDQUFDO0FBRUQsOEJBQVksR0FBRyx3QkFBd0IsTUFBTTtBQUFBLEVBRTdDLENBQUM7QUFFRCw4QkFBWSxHQUFHLHFCQUFxQixDQUFDLGdCQUFxQjtBQUV4RCxVQUFNLEVBQUUsUUFBUSxJQUFJO0FBQ3BCLFlBQVEsSUFBSSxnQkFBZ0IsVUFBVTtBQUFBLEVBQ3hDLENBQUM7QUFHRCw4QkFBWSxHQUFHLHFCQUFxQixNQUFNO0FBR3hDLGdDQUFZLGVBQWU7QUFBQSxFQUM3QixDQUFDO0FBRUQsOEJBQVksR0FBRyxTQUFTLENBQUMsUUFBUTtBQUUvQixZQUFRLE1BQU0sc0NBQW1DLElBQUksT0FBTztBQUFBLEVBQzlELENBQUM7QUFDSDtBQUdBLG9CQUFJLFVBQVUsRUFBRSxLQUFLLE1BQU07QUFDekIsa0JBQWdCO0FBQ2xCLENBQUM7IiwKICAibmFtZXMiOiBbIm9zIiwgInBhdGgiXQp9Cg==
