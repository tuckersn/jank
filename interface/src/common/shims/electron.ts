import { BehaviorSubject, filter, Observable, Subject } from "rxjs";

import { BrowserViewMessages, FrameMessages, Message, ProcessMessages, RenderMessages } from "jank-shared/dist/communication/render-ipc";

import { ElectronType, IpcRendererType, RemoteType, ShellType } from "./electron-types";
import { nanoid } from "nanoid";
import { Prefixs } from "jank-shared/src/communication/render-ipc";

export const electron: ElectronType = window.require('electron');
export const ipcRenderer: IpcRendererType = electron.ipcRenderer;
export const shell: ShellType = electron.shell;

export module ElectronShim { 


    export function send(channel: Prefixs, msg: RenderMessages) {
        ipcRenderer.send(channel, msg);
    }

 
    export const frameMessages: Observable<{event:any, msg: FrameMessages.MainMessages}> = new Observable((observale) => {
        ipcRenderer.on('frame', (event, msg : FrameMessages.MainMessages) => {
            observale.next({
                event: {

                },
                msg
            });
        });
    });
    export const processMessages: Observable<{event:any, msg: ProcessMessages.MainMessages}> = new Observable((observale) => {
        ipcRenderer.on('process', (event, msg : ProcessMessages.MainMessages) => {
            observale.next({
                event: {

                },
                msg
            });
        });
    });
    export const browserViewMessages: Observable<{event:any, msg: BrowserViewMessages.MainMessages}> = new Observable((observale) => {
        ipcRenderer.on('browser-view', (event, msg : BrowserViewMessages.MainMessages) => {
            observale.next({
                event: {

                },
                msg
            });
        });
    });


    frameMessages.subscribe(({msg}) => {
        switch(msg.type) {
            case 'frame-M-maximize':
                Frame.maximizationSubject.next(msg.payload.maximized);
                return;
            default:
                throw new Error("Unknown message type from main: " + msg.type);
        };
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
        const requestId: string = nanoid();
        const event: ProcessMessages.RSpawn = {
            type: 'process-R-spawn',
            payload: {
                command,
                args,
                requestId
            }
        }
        ipcRenderer.send('process', event);

        console.log("WRPPING UP.")

        if(!promise)
            return;

        return new Promise<string>((res, err) => {
            let subscription = processMessages.pipe(filter(({msg}) => requestId === msg.payload.requestId)).subscribe((_msg) => {
                const msg: ProcessMessages.MSpawnResponse = _msg.msg;
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