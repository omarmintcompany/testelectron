"use strict";

// src-electron/electron-preload.ts
var import_electron = require("electron");
var import_remote = require("@electron/remote");
import_electron.contextBridge.exposeInMainWorld("myWindowAPI", {
  minimize() {
    var _a;
    console.group("aaaaa");
    (_a = import_remote.BrowserWindow.getFocusedWindow()) == null
      ? void 0
      : _a.minimize();
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
  },
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLXByZWxvYWQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGNvbnRleHRCcmlkZ2UgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBCcm93c2VyV2luZG93IH0gZnJvbSAnQGVsZWN0cm9uL3JlbW90ZSc7XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ215V2luZG93QVBJJywge1xuICBtaW5pbWl6ZSgpIHtcbiAgICBjb25zb2xlLmdyb3VwKCdhYWFhYScpO1xuICAgIEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpPy5taW5pbWl6ZSgpO1xuICB9LFxuXG4gIHRvZ2dsZU1heGltaXplKCkge1xuICAgIGNvbnN0IHdpbiA9IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXG4gICAgaWYgKHdpbi5pc01heGltaXplZCgpKSB7XG4gICAgICB3aW4udW5tYXhpbWl6ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW4ubWF4aW1pemUoKTtcbiAgICB9XG4gIH0sXG5cbiAgY2xvc2UoKSB7XG4gICAgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCkuY2xvc2UoKTtcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7O0FBQUEsc0JBQThCO0FBQzlCLG9CQUE4QjtBQUU5Qiw4QkFBYyxrQkFBa0IsZUFBZTtBQUFBLEVBQzdDLFdBQVc7QUFKYjtBQUtJLFlBQVEsTUFBTSxPQUFPO0FBQ3JCLHNDQUFjLGlCQUFpQixNQUEvQixtQkFBa0M7QUFBQSxFQUNwQztBQUFBLEVBRUEsaUJBQWlCO0FBQ2YsVUFBTSxNQUFNLDRCQUFjLGlCQUFpQjtBQUUzQyxRQUFJLElBQUksWUFBWSxHQUFHO0FBQ3JCLFVBQUksV0FBVztBQUFBLElBQ2pCLE9BQU87QUFDTCxVQUFJLFNBQVM7QUFBQSxJQUNmO0FBQUEsRUFDRjtBQUFBLEVBRUEsUUFBUTtBQUNOLGdDQUFjLGlCQUFpQixFQUFFLE1BQU07QUFBQSxFQUN6QztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
