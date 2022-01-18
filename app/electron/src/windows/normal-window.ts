import { BrowserWindow } from "electron";
import * as path from "path";
import { onEventProcess } from "../ipc";

import { onEventFrame } from "../ipc/frame";
import { onBrowserViewChannel } from "./browser-views/browser-view-registry";
import { WindowRegistry } from "./window-registry";

export function createNormalWindow() {

    const { id, browserWindow } = WindowRegistry.create({
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload-main.js"),
            nodeIntegration: true,
            contextIsolation: false,
            javascript: true,
            webviewTag: true
        },
        width: 800,
        frame: false,
        //transparent: true,
        autoHideMenuBar: true
    });

    const senderGenerator = (channel: string) => {
        return {
            reply: (data: any) => {
                console.log("SENDING DATA:", data);
                browserWindow.webContents.send(channel, data);
            }
        }
    }

    browserWindow.webContents.addListener('ipc-message', (event, channel, args) => {
        const window = {
            id,
            browserWindow
        };
        switch(channel) {
            case "frame":
                onEventFrame({window, sender: senderGenerator(channel), event: args});
            case "process":
                onEventProcess({window, sender: senderGenerator(channel), event: args});
            case "browser-view":
                onBrowserViewChannel({window, sender: senderGenerator(channel),event:args});
        }      
    });
    
    browserWindow.webContents.on('console-message', async (event, level, msg, line, sourceId) => {
        //console.log("MAIN:", {event,level,msg,line,sourceId});
        browserWindow.webContents.send('console-message', {level,msg,line,sourceId});
    });

    browserWindow.loadFile('./loading.html');
    
    browserWindow.loadURL(`http://localhost:3000`);


    // Open the DevTools.
    browserWindow.webContents.openDevTools();
    
}
