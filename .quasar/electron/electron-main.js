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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgbmF0aXZlVGhlbWUgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBpbml0aWFsaXplLCBlbmFibGUgfSBmcm9tICdAZWxlY3Ryb24vcmVtb3RlL21haW4nOyAvLyA8LS0gYWRkIHRoaXNcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcblxuaW5pdGlhbGl6ZSgpOyAvLyA8LS0gYWRkIHRoaXNcblxuLy8gbmVlZGVkIGluIGNhc2UgcHJvY2VzcyBpcyB1bmRlZmluZWQgdW5kZXIgTGludXhcbmNvbnN0IHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybSB8fCBvcy5wbGF0Zm9ybSgpO1xuXG50cnkge1xuICBpZiAocGxhdGZvcm0gPT09ICd3aW4zMicgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSkge1xuICAgIHJlcXVpcmUoJ2ZzJykudW5saW5rU3luYyhcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aCgndXNlckRhdGEnKSwgJ0RldlRvb2xzIEV4dGVuc2lvbnMnKVxuICAgICk7XG4gIH1cbn0gY2F0Y2ggKF8pIHt9XG5cbmxldCBtYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG4gICAqL1xuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHdpZHRoOiAxMDAwLFxuICAgIGhlaWdodDogNjAwLFxuICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxuICAgIGZyYW1lOiBmYWxzZSwgLy8gPC0tIGFkZCB0aGlzXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIHNhbmRib3g6IGZhbHNlLFxuICAgICAgcHJlbG9hZDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2VsZWN0cm9uLXByZWxvYWQuanMnKSxcbiAgICB9LFxuICB9KTtcblxuICBlbmFibGUobWFpbldpbmRvdy53ZWJDb250ZW50cyk7IC8vIDwtLSBhZGQgdGhpc1xuXG4gIG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKSB7XG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbignZGV2dG9vbHMtb3BlbmVkJywgKCkgPT4ge1xuICAgICAgbWFpbldpbmRvdz8ud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpbldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgIG1haW5XaW5kb3cgPSB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG5hcHAud2hlblJlYWR5KCkudGhlbihjcmVhdGVXaW5kb3cpO1xuXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICBpZiAocGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gIGlmIChtYWluV2luZG93ID09PSB1bmRlZmluZWQpIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBZ0Q7QUFDaEQsa0JBQW1DO0FBQ25DLGtCQUFpQjtBQUNqQixnQkFBZTtBQUFBLElBRWYsd0JBQVc7QUFHWCxJQUFNLFdBQVcsUUFBUSxZQUFZLFVBQUFBLFFBQUcsU0FBUztBQUVqRCxJQUFJO0FBQ0YsTUFBSSxhQUFhLFdBQVcsNEJBQVksd0JBQXdCLE1BQU07QUFDcEUsWUFBUSxNQUFNO0FBQUEsTUFDWixZQUFBQyxRQUFLLEtBQUssb0JBQUksUUFBUSxVQUFVLEdBQUcscUJBQXFCO0FBQUEsSUFDMUQ7QUFBQSxFQUNGO0FBQ0YsU0FBUyxHQUFQO0FBQVc7QUFFYixJQUFJO0FBRUosU0FBUyxlQUFlO0FBSXRCLGVBQWEsSUFBSSw4QkFBYztBQUFBLElBQzdCLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLGdCQUFnQjtBQUFBLElBQ2hCLE9BQU87QUFBQSxJQUNQLGdCQUFnQjtBQUFBLE1BQ2QsU0FBUztBQUFBLE1BQ1QsU0FBUyxZQUFBQSxRQUFLLEtBQUssV0FBVyxxQkFBcUI7QUFBQSxJQUNyRDtBQUFBLEVBQ0YsQ0FBQztBQUVELDBCQUFPLFdBQVcsV0FBVztBQUU3QixhQUFXLFFBQVEsdUJBQW1CO0FBRXRDLE1BQUksTUFBdUI7QUFFekIsZUFBVyxZQUFZLGFBQWE7QUFBQSxFQUN0QyxPQUFPO0FBRUwsZUFBVyxZQUFZLEdBQUcsbUJBQW1CLE1BQU07QUFDakQsK0NBQVksWUFBWTtBQUFBLElBQzFCLENBQUM7QUFBQSxFQUNIO0FBRUEsYUFBVyxHQUFHLFVBQVUsTUFBTTtBQUM1QixpQkFBYTtBQUFBLEVBQ2YsQ0FBQztBQUNIO0FBRUEsb0JBQUksVUFBVSxFQUFFLEtBQUssWUFBWTtBQUVqQyxvQkFBSSxHQUFHLHFCQUFxQixNQUFNO0FBQ2hDLE1BQUksYUFBYSxVQUFVO0FBQ3pCLHdCQUFJLEtBQUs7QUFBQSxFQUNYO0FBQ0YsQ0FBQztBQUVELG9CQUFJLEdBQUcsWUFBWSxNQUFNO0FBQ3ZCLE1BQUksZUFBZSxRQUFXO0FBQzVCLGlCQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbIm9zIiwgInBhdGgiXQp9Cg==
