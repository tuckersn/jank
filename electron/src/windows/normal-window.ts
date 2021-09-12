import { BrowserWindow } from "electron";
import * as path from "path";
import { onEventProcess } from "../ipc";

import { onEventFrame } from "../ipc/frame";
import { WindowManager } from "./window-manager";

export function createNormalWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, "preload-main.js"),
        nodeIntegration: true,
        contextIsolation: false,
        javascript: true
        },
        width: 800,
        frame: false,
        //transparent: true,
        autoHideMenuBar: true
    });

    WindowManager.register({
        browserWindow: mainWindow,
        webContents: mainWindow.webContents
    });

    mainWindow.webContents.addListener('ipc-message', (event, channel, args) => {
        switch(channel) {
            case "frame":
                onEventFrame({window: mainWindow, event: args});
            case "process":
                onEventProcess({window: mainWindow, event: args});
        }      
    });
    
    mainWindow.webContents.on('console-message', async (event, level, msg, line, sourceId) => {
        //console.log("MAIN:", {event,level,msg,line,sourceId});
        mainWindow.webContents.send('console-message', {level,msg,line,sourceId});
    });
    
    mainWindow.loadURL(`http://localhost:3000`);


    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    
}
