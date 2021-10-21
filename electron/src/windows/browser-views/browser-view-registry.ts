import { BrowserView } from "electron";
import { BrowserViewConstructorOptions } from "electron/main";
import { BrowserViewMessages, Message } from "jank-shared/dist/communication/render-ipc";
import { nanoid } from "nanoid";
import { OnIpcEventFunction } from "../../ipc";
import { IWindowItem } from "../window-registry";

function sendToBrowserViewIpc(window: IWindowItem, msg: BrowserViewMessages.MainMessages) {
    window.browserWindow.webContents.send(BrowserViewMessages.PREFIX, msg);
}

export interface IBrowserViewItem {
    id: Readonly<string>;
    window: IWindowItem,
    view: BrowserView,
    attachedTo: string[],
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
        if(!view.attachedTo.includes(window.id))
            view.attachedTo.push(window.id);
    }

    export function create(id: string, window: IWindowItem, options: BrowserViewConstructorOptions) {
        const view = new BrowserView(Object.assign(({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        }) as BrowserViewConstructorOptions, options || {}));

        view.setBackgroundColor('#ffffff');

        view.webContents.on('did-fail-load', (event, listener) => {
            console.log("BV failed:", event);
        });
        
        view.webContents.loadURL('https://google.com').then((e) => {
            console.log("going to google?", e);
        });

        view.webContents.on('did-navigate', (event, url, httpCode, httpStatusText) => {
            console.log("NAVIGATED");
            const message: BrowserViewMessages.MNavigated = {
                type: 'browser-view-M-navigated',
                payload: {
                    id,
                    url,
                    title: view.webContents.getTitle()
                }
            };
            sendToBrowserViewIpc(window, message);
        });

     
        _regisrty[id] = {
            id,
            window,
            view,
            attachedTo: []
        }

        attach(_regisrty[id], window);
        return _regisrty[id];
    }
}


async function spawn({ id, requestId }: BrowserViewMessages.RSpawn['payload'], window: IWindowItem, reply: (msg: BrowserViewMessages.MSpawnResponse) => void) {
    if(id) {
        if(id in BrowserViewRegistry.registry()) {
            const view = BrowserViewRegistry.get(id);
            BrowserViewRegistry.attach(view, window);
            return await reply({
                type: 'browser-view-M-spawn-response',
                payload: {
                    id: view.id,
                    requestId
                }
            });
        }
    }

    const view = BrowserViewRegistry.create(id || nanoid(), window, {
        
    });

    return await reply({
        type: 'browser-view-M-spawn-response',
        payload: {
            id: view.id,
            requestId
        }
    });
}

async function navigate({requestId, url, target, replyWhenFinished} : BrowserViewMessages.RNavigate['payload'], window: IWindowItem, reply: (msg: BrowserViewMessages.MNavigated) => void) {
    
    if('id' in target) {
        const viewItem = BrowserViewRegistry.get(target.id);
        console.log("URL:", url, target, viewItem);
        if(viewItem.view) {
            if(url && url !== '')
                viewItem.view.webContents.loadURL(url);
        }
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
            await spawn(payload as BrowserViewMessages.RSpawn['payload'], window, reply);
        }
        break;
        
        case 'browser-view-R-navigate': {
            await navigate(payload as BrowserViewMessages.RNavigate['payload'], window, reply);
        }
        break;

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
        }
        break;
        case "browser-view-R-destroy": {
            const {
                target,
                requestId
            } = (payload as BrowserViewMessages.RDestroy['payload']);
            if('all' in target) {
                const browserViewIds = Object.keys(BrowserViewRegistry.registry());
                for(let id of browserViewIds) {
                    BrowserViewRegistry.destroy(id);
                }
                console.log("ALL:", BrowserViewRegistry.registry());
            } else {
                //TODO: destroy a single view
            }

            
        }
        break;
        case "browser-view-R-attach": {
            const { id } = (payload as BrowserViewMessages.RAttach['payload']).target;
            if(id) {
                if(id in BrowserViewRegistry.registry()) {
                    const view = BrowserViewRegistry.get(id);
                    BrowserViewRegistry.attach(view, window);
                }
            }
        }
        break;
        case "browser-view-R-detach": {
            const {id} = (payload as BrowserViewMessages.RDetach['payload']).target;
            console.log("DETACHING:", id)
            const {
                target
            } = (payload as BrowserViewMessages.RDetach['payload']);
            if(target.id in BrowserViewRegistry.registry()) {
                const bv = BrowserViewRegistry.get(target.id);
                window.browserWindow.removeBrowserView(bv.view);
                
                if(bv.attachedTo.includes(window.id)) {
                    bv.attachedTo.splice(bv.attachedTo.indexOf(window.id),1);
                } else {
                    throw new Error('Trying to detach from BrowserView that doesn\'t exist.');
                }

                console.log("DETACHING:", target.id);
            } 
        }
        break;
    }
};