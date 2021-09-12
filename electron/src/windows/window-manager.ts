import { BrowserWindow, WebContents } from "electron";
import { MainMessages } from "jank-shared/src/communication/render-ipc";
import {nanoid} from "nanoid";

export module WindowManager {
    export const windows: {[id: string]: {
        id: string;
        browserWindow?: BrowserWindow; 
        webContents: WebContents;
    }} = {};

    export function register({
        webContents,
        browserWindow
    } : {
        webContents: WebContents,
        browserWindow?: BrowserWindow; 
    }) {
        const id = nanoid();
        windows[id] = {
            id,
            browserWindow,
            webContents
        };
        return windows[id];
    }


    export function broadcast(event: string, payload: MainMessages) {
        for(let window of Object.values(windows)) {
            window.webContents.send(event, payload);
        }
    };
}