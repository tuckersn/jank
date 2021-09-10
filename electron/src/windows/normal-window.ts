import { BrowserWindow } from "electron";
import * as path from "path";

import { onEventFrame } from "../ipc/frame";

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

    mainWindow.webContents.addListener('ipc-message', (event, channel, args) => {
        switch(channel) {
            case "frame":
                onEventFrame({window: mainWindow, event: args});
    
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
