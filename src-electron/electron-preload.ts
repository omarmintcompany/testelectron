import { contextBridge } from 'electron';
import { BrowserWindow } from '@electron/remote';

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    console.group('aaaaa');
    BrowserWindow.getFocusedWindow()?.minimize();
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow();

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },

  close() {
    BrowserWindow.getFocusedWindow().close();
  },
});
