

export interface Message<MESSAGE_TYPE extends string, PAYLOAD extends Object = {}> {
    type: MESSAGE_TYPE,
    payload: PAYLOAD
}

export module FrameMessages {
    export const PREFIX = 'frame';

    export type RClose = Message<`${typeof PREFIX}-R-close`>;
    export type RMinimize = Message<`${typeof PREFIX}-R-minimize`>;
    export type RMaximize = Message<`${typeof PREFIX}-R-maximize`>;
    export type MMaximized = Message<`${typeof PREFIX}-M-maximize`, {
        maximized: boolean
    }>;

    export type RenderMessages = RClose | RMinimize | RMaximize;
    export type MainMessages = MMaximized;
    export type AnyMessage = RenderMessages | MainMessages;
}

export module ProcessMessages {
    export const PREFIX = 'process';

    export type RSpawn = Message<`${typeof PREFIX}-R-spawn`, {
        requestId?: string,
        command: string,
        args?: string[]
    }>;
    export type MSpawnResponse = Message<`${typeof PREFIX}-M-spawn-response`, {
        id: string,
        requestId?: string
    }>;

    export type RenderMessages = RSpawn;
    export type MainMessages = MSpawnResponse;
    export type AnyMessage = RenderMessages | MainMessages;
}

export module BrowserViewMessages {
    export const PREFIX = 'browser-view';

    export type RSpawn = Message<`${typeof PREFIX}-R-spawn`, {
        requestId?: string,
    }>;

    export type RDestroy = Message<`${typeof PREFIX}-R-destroy`, {
        requestId?: string,
        target: {
            id: string
        } | {
            // If all is true, erase destroy all views for this window.
            all: true
        }
    }>;

    export type MSpawnResponse = Message<`${typeof PREFIX}-M-spawn-response`, {
        id: string,
        requestId?: string
    }>;

    export type MDestroyResponse = Message<`${typeof PREFIX}-M-spawn-response`, {
        id: string,
        requestId?: string
    }>;

    export type RPosition = Message<`${typeof PREFIX}-R-position`, {
        id: string,
        x: number,
        y: number,
        w: number,
        h: number
    }>;

    export type RenderMessages = RSpawn | RDestroy | RPosition;
    export type MainMessages = MSpawnResponse | MDestroyResponse;
    export type AnyMessage = RenderMessages | MainMessages;
}


export type Prefixs = typeof FrameMessages.PREFIX |
    typeof ProcessMessages.PREFIX |
    typeof BrowserViewMessages.PREFIX;
export type RenderMessages = FrameMessages.RenderMessages | 
    ProcessMessages.RenderMessages |
    BrowserViewMessages.RenderMessages;
export type MainMessages = FrameMessages.MainMessages | 
    ProcessMessages.MainMessages |
    BrowserViewMessages.MainMessages;
export type AnyMessage = RenderMessages | MainMessages;
