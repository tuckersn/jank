import { BehaviorSubject, filter, Observable, Subject } from "rxjs";

import { FrameMessages, ProcessMessages } from "jank-shared/src/communication/render-ipc";

import { ElectronType, IpcRendererType, RemoteType, ShellType } from "./electron-types";
import { nanoid } from "nanoid";

export const electron: ElectronType = window.require('electron');
export const ipcRenderer: IpcRendererType = electron.ipcRenderer;
export const shell: ShellType = electron.shell;

export module ElectronShim { 

    ipcRenderer.on('frame', (event: any, msg: FrameMessages.MainMessages) => {
        switch(msg.type) {
            case 'frame-M-maximize':
                Frame.maximizationSubject.next(msg.payload.maximized);
                return;
            default:
                throw new Error("Unknown message type from main: " + msg.type);
        }
    });


    const processMessages = new Subject<ProcessMessages.MainMessages>();
    ipcRenderer.on('process', (event: any, msg: ProcessMessages.MainMessages) => {
        switch(msg.type) {
            case 'process-M-spawn-response':
                processMessages.next(msg);
        }
    });


    export function destroy() {
        Frame.maximizationSubject.complete();
    }

    export async function spawnProcess(command: string, {
        args = [],
        timeout = 10000,
        promise = true
    } : {
        args?: string[],
        timeout?: number,
        /** Whether or not to create a promise. True = make promise*/
        promise?: boolean
    } = {}) {
        const request_id: string = nanoid();
        const event: ProcessMessages.RSpawn = {
            type: 'process-R-spawn',
            payload: {
                command,
                args,
                request_id
            }
        }
        ipcRenderer.send('process', event);

        console.log("WRPPING UP.")

        if(!promise)
            return;

        return new Promise<string>((res, err) => {
            let subscription = processMessages.pipe(filter(msg => request_id === msg.payload.request_id)).subscribe((msg: ProcessMessages.MSpawnResponse) => {
                res(msg.payload.id);
                subscription.unsubscribe();
            });

            //TODO: options for this
            setTimeout(() => {
                if(!subscription.closed) {
                    subscription.unsubscribe();
                    err("Timed out");
                }
            }, timeout);
        });

    }


    export class Frame {
        
        static maximized: boolean = false;
        static maximizationSubject: BehaviorSubject<boolean> = new BehaviorSubject(Frame.maximized);
        
        static minimize() {
            const event: FrameMessages.RMinimize = {
                type: 'frame-R-minimize',
                payload: {}
            }
            ipcRenderer.send('frame', event);
        };
        static close() {
            const event: FrameMessages.RClose = {
                type: 'frame-R-close',
                payload: {}
            }
            ipcRenderer.send('frame', event);
            
        };
        static maximize() {
            const event: FrameMessages.RMaximize = {
                type: 'frame-R-maximize',
                payload: {}
            }
            ipcRenderer.send('frame', event);
        };
    }


}