import { BrowserWindow, BrowserWindowConstructorOptions, WebContents } from "electron";
import { MainMessages } from "jank-shared/src/communication/render-ipc";
import {nanoid} from "nanoid";

export type WindowTypes = 'browserWindow' | 'browserView';

export interface IWindowItem {
    id: string;
    browserWindow: BrowserWindow;
}


export module WindowRegistry {
    export const windows: {[id: string]: IWindowItem} = {};
    
    export function get(id: string): IWindowItem {
        if(id in windows) {
            return windows[id];
        } else {
            throw new Error("Invalid window id: " + id);
        }
    }

    export function create(options : BrowserWindowConstructorOptions): IWindowItem {
        const id = nanoid();

        const browserWindow = new BrowserWindow(Object.assign({

        } as BrowserWindowConstructorOptions, options));

        windows[id] = {
            id,
            browserWindow
        };
        return windows[id];
    }


    export function broadcast(event: string, payload: MainMessages) {
        for(let window of Object.values(windows)) {
            window.browserWindow.webContents.send(event, payload);
        }
    };
}