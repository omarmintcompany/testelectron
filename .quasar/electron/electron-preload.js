"use strict";

// src-electron/electron-preload.ts
var import_electron = require("electron");
var import_remote = require("@electron/remote");
import_electron.contextBridge.exposeInMainWorld("myWindowAPI", {
  minimize() {
    var _a;
    console.group("aaaaa");
    (_a = import_remote.BrowserWindow.getFocusedWindow()) == null ? void 0 : _a.minimize();
  },
  toggleMaximize() {
    const win = import_remote.BrowserWindow.getFocusedWindow();
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },
  close() {
    import_remote.BrowserWindow.getFocusedWindow().close();
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLXByZWxvYWQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGNvbnRleHRCcmlkZ2UgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3cgfSBmcm9tIFwiQGVsZWN0cm9uL3JlbW90ZVwiO1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwibXlXaW5kb3dBUElcIiwge1xuICBtaW5pbWl6ZSgpIHtcbiAgICBjb25zb2xlLmdyb3VwKFwiYWFhYWFcIik7XG4gICAgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk/Lm1pbmltaXplKCk7XG4gIH0sXG5cbiAgdG9nZ2xlTWF4aW1pemUoKSB7XG4gICAgY29uc3Qgd2luID0gQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cbiAgICBpZiAod2luLmlzTWF4aW1pemVkKCkpIHtcbiAgICAgIHdpbi51bm1heGltaXplKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbi5tYXhpbWl6ZSgpO1xuICAgIH1cbiAgfSxcblxuICBjbG9zZSgpIHtcbiAgICBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKS5jbG9zZSgpO1xuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7QUFBQSxzQkFBOEI7QUFDOUIsb0JBQThCO0FBRTlCLDhCQUFjLGtCQUFrQixlQUFlO0FBQUEsRUFDN0MsV0FBVztBQUpiO0FBS0ksWUFBUSxNQUFNLE9BQU87QUFDckIsc0NBQWMsaUJBQWlCLE1BQS9CLG1CQUFrQztBQUFBLEVBQ3BDO0FBQUEsRUFFQSxpQkFBaUI7QUFDZixVQUFNLE1BQU0sNEJBQWMsaUJBQWlCO0FBRTNDLFFBQUksSUFBSSxZQUFZLEdBQUc7QUFDckIsVUFBSSxXQUFXO0FBQUEsSUFDakIsT0FBTztBQUNMLFVBQUksU0FBUztBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxRQUFRO0FBQ04sZ0NBQWMsaUJBQWlCLEVBQUUsTUFBTTtBQUFBLEVBQ3pDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
