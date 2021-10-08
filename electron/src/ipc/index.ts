import { BrowserWindow } from "electron/main";
import { Message } from "jank-shared/src/communication/render-ipc";
import { Promisable } from "type-fest/source/promisable";
import { IWindowItem } from "../windows/window-registry";

export * from "./frame";
export * from "./process";

export type OnIpcEventFunction<MESSAGE extends Message<any,any>> = (input:{
    sender: {
        /**
         * Short hand for replying back over the IPC,
         * the other side is not expected to wait for a response
         * so this is not a contextual reply.
         */
        reply: (data: any) => Promisable<void>;
    },
    window: IWindowItem, 
    event: MESSAGE
}) => void | Promise<void>;