import { BehaviorSubject, Observable, Subject } from "rxjs";

import { FrameEvent } from "jank-shared/dist/ipc/events";

import { ipcRendererType, ShellType } from "./electron-types";

const electron = window.require('electron');
const ipcRenderer: typeof ipcRendererType = electron.ipcRenderer;
const shell: ShellType = electron.shell;

export default class Electron {


    private static initialized: boolean = false;
    /**
     * Run at the start, needs to be setup
     * to handle updates, RXJS seems a good idea
     * here.
     */
    static init() {
        if(!Electron.initialized) {

            ipcRenderer.on('frame', (event, { maximized } : {event:"maximization"} & FrameEvent) => {
                Electron.maximized = maximized;
                Electron.maximizationSubject.next(Electron.maximized);
            });

        } else {
            throw "Cannot initialize twice.";
        }
    }

    /**
     * Runs at the end for clean up.
     */
    static destroy() {
        Electron.maximizationSubject.complete();
    }
    
    
    static ipcRenderer: any = ipcRenderer;
    static shell: ShellType = shell;
    
    static maximized: boolean = false;
    static maximizationSubject: BehaviorSubject<boolean> = new BehaviorSubject(Electron.maximized);
    static window = {
        minimize: () => {
            const event: FrameEvent = {
                event: 'minimize'
            }
            ipcRenderer.send('frame', event);
        },
        close: () => {
            const event: FrameEvent = {
                event: 'close'
            }
            ipcRenderer.send('frame', event);
            
        },
        maximize: () => {
            const event: FrameEvent = {
                event: 'maximize'
            }
            ipcRenderer.send('frame', event);
        }
    }



}