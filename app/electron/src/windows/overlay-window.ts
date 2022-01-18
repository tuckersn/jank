import { BrowserWindow } from "electron";
import * as path from "path";


export function createOverlayWindow() {
    const overlayWindow = new BrowserWindow({
        height: 1920,
        width: 1080,
        webPreferences: {
        nodeIntegration: true
        },
        frame: false,
        transparent: true,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        focusable: false
    });

    overlayWindow.setIgnoreMouseEvents(true, {forward: true});
    overlayWindow.setAlwaysOnTop(true, 'normal');

    overlayWindow.loadFile(path.join(__dirname, "../overlay.html"));
    overlayWindow.webContents.openDevTools();
}