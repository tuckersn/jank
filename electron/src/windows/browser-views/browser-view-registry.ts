import { BrowserView } from "electron";
import { BrowserViewConstructorOptions } from "electron/main";
import { BrowserViewMessages, Message } from "jank-shared/src/communication/render-ipc";
import { nanoid } from "nanoid";
import { OnIpcEventFunction } from "../../ipc";
import { IWindowItem } from "../window-registry";

export interface IBrowserViewItem {
    id: Readonly<string>;
    window: IWindowItem,
    view: BrowserView,
    attached: boolean,
    onDestroy?: (bv: IBrowserViewItem) => void
}

export module BrowserViewRegistry {
    
    const _regisrty: {[id: string]: IBrowserViewItem} = {};
    
    export function registry() {
        return _regisrty as Readonly<typeof _regisrty>;
    }

    export function get(id: string): IBrowserViewItem | null {
        return _regisrty[id] || null;
    }

    export function destroy(id: string) {
        const bv = _regisrty[id];
        if(bv.onDestroy) {
            bv.onDestroy(bv);
        }
        bv.view.webContents.delete();
        bv.window.browserWindow.removeBrowserView(bv.view);
        delete _regisrty[bv.id];
    }

    export function attach(view: IBrowserViewItem, window: IWindowItem) {
        window.browserWindow.addBrowserView(view.view);
        view.attached = true;
    }

    export function create(id: string, window: IWindowItem, options: BrowserViewConstructorOptions) {
        const view = new BrowserView(Object.assign(({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        }) as BrowserViewConstructorOptions, options || {}));

        view.setBackgroundColor('black');

        view.webContents.on('did-fail-load', (event, listener) => {
            console.log("BV failed:", event);
        });
        
        view.webContents.loadURL('https://google.com').then((e) => {
            console.log("going to google?", e);
        });

        

     
        _regisrty[id] = {
            id,
            window,
            view,
            attached: false
        }

        attach(_regisrty[id], window);
        return _regisrty[id];
    }
}


/**
 * IPC channel 
 */
export const onBrowserViewChannel: OnIpcEventFunction<BrowserViewMessages.RenderMessages> = async ({
    sender: {
        reply
    },
    window,
    event: {
        payload,
        type
    }
}) => {
    switch(type) {
        case 'browser-view-R-spawn': {
            const {
                requestId,
                id
            } = (payload as BrowserViewMessages.RSpawn["payload"]);
            
            

            if(id) {
                if(id in BrowserViewRegistry.registry()) {
                    const view = BrowserViewRegistry.get(id);
                    BrowserViewRegistry.attach(view, window);
                    await reply({
                        type: 'browser-view-M-spawn-response',
                        payload: {
                            id: view.id,
                            requestId
                        }
                    } as BrowserViewMessages.MSpawnResponse)
                    break;
                }
            }

            const view = BrowserViewRegistry.create(id || nanoid(), window, {
                
            });

            await reply({
                type: 'browser-view-M-spawn-response',
                payload: {
                    id: view.id,
                    requestId
                }
            } as BrowserViewMessages.MSpawnResponse)
            break;
        }
        case 'browser-view-R-position': {


            const {
                id,
                x,
                y,
                h,
                w
            } = (payload as BrowserViewMessages.RPosition['payload']);

            if(id in BrowserViewRegistry.registry()) {
                const browserView = BrowserViewRegistry.registry()[id];
                browserView.view.setBounds({
                    x,
                    y,
                    height: h,
                    width: w
                });
            }
            break;
        }
        case "browser-view-R-destroy": {
            const {
                target,
                requestId
            } = (payload as BrowserViewMessages.RDestroy['payload']);
            console.log("BROWSERVIEW DESTRUCTION:", target);
            if('all' in target) {
                const browserViewIds = Object.keys(BrowserViewRegistry.registry());
                for(let id of browserViewIds) {
                    BrowserViewRegistry.destroy(id);
                }
                console.log("ALL:", BrowserViewRegistry.registry());
            } else {
                //TODO: destroy a single view
            }

            break;
        }
        case "browser-view-R-detach": {
            const {
                target
            } = (payload as BrowserViewMessages.RDetach['payload']);
            if(target.id in BrowserViewRegistry.registry()) {
                const bv = BrowserViewRegistry.get(target.id);
                window.browserWindow.removeBrowserView(bv.view);
                bv.attached = false;
                console.log("DETACHING")
            }

            break;
        }
    }
};