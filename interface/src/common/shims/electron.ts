import { BehaviorSubject, Observable, Subject } from "rxjs";

import { FrameMessages, ProcessMessages } from "jank-shared/src/communication/render-ipc";

import { ElectronType, IpcRendererType, RemoteType, ShellType } from "./electron-types";
import { nanoid } from "nanoid";

export const electron: ElectronType = window.require('electron');
export const ipcRenderer: IpcRendererType = electron.ipcRenderer;
export const shell: ShellType = electron.shell;

export module ElectronShim { 

    ipcRenderer.on('frame', (event: any, msg: FrameMessages.MainMessages) => {
        switch(msg.type) {
            case 'frame-maximized':
                Frame.maximizationSubject.next(msg.payload.maximized);
                return;
            default:
                throw new Error("Unknown message type from main: " + msg.type);
        }
    });

    ipcRenderer.on('process', (event: any, msg: ProcessMessages.MainMessages) => {
        switch(msg.type) {
            case 'process-spawn-response':

        }
    });


    export function destroy() {
        Frame.maximizationSubject.complete();
    }

    export async function spawnProcess(command: string) {
        const request_id: string = nanoid();
        const event: ProcessMessages.RSpawn = {
            type: 'process-spawn',
            payload: {
                command,
                request_id
            }
        }
        ipcRenderer.send('process', event);
    }


    export class Frame {
        
        static maximized: boolean = false;
        static maximizationSubject: BehaviorSubject<boolean> = new BehaviorSubject(Frame.maximized);
        
        static minimize() {
            const event: FrameMessages.RMinimize = {
                type: 'frame-minimize',
                payload: {}
            }
            ipcRenderer.send('frame', event);
        };
        static close() {
            const event: FrameMessages.RClose = {
                type: 'frame-close',
                payload: {}
            }
            ipcRenderer.send('frame', event);
            
        };
        static maximize() {
            const event: FrameMessages.RMaximize = {
                type: 'frame-maximize',
                payload: {}
            }
            ipcRenderer.send('frame', event);
        };
    }


}