export interface Message<TYPE_KEY extends string, PAYLOAD extends Object = {}> {
    type: TYPE_KEY
    payload: PAYLOAD
}

export module FrameMessages {
    type TypePrefix = 'frame';

    export type RClose = Message<`${TypePrefix}-R-close`>;
    export type RMinimize = Message<`${TypePrefix}-R-minimize`>;
    export type RMaximize = Message<`${TypePrefix}-R-maximize`>;
    export type MMaximized = Message<`${TypePrefix}-M-maximize`, {
        maximized: boolean
    }>;

    export type RenderMessages = RClose | RMinimize | RMaximize;
    export type MainMessages = MMaximized;
    export type AnyMessage = RenderMessages | MainMessages;
}

export module ProcessMessages {
    type TypePrefix = 'process';

    export type RSpawn = Message<`${TypePrefix}-R-spawn`, {
        request_id?: string,
        command: string,
        args?: string[]
    }>;
    export type MSpawnResponse = Message<`${TypePrefix}-M-spawn-response`, {
        id: string,
        request_id?: string
    }>;

    export type RenderMessages = RSpawn;
    export type MainMessages = MSpawnResponse;
    export type AnyMessage = RenderMessages | MainMessages;
}

export module BrowserViewMessages {

    type TypePrefix = 'browser-view';

    export type RSpawn = Message<`${TypePrefix}-R-spawn`, {
        request_id?: string,
    }>;

    export type MSpawnResponse = Message<`${TypePrefix}-M-spawn-response`, {
        id: string,
        request_id?: string
    }>;

    export type RPosition = Message<`${TypePrefix}-R-position`, {
        id: string,
        x: number,
        y: number,
        w: number,
        h: number
    }>;

    export type RenderMessage = RSpawn | RPosition;
    export type MainMessage = MSpawnResponse;
    export type AnyMessage = RenderMessage | MainMessages;
}

export type RenderMessages = FrameMessages.RenderMessages | 
    ProcessMessages.RenderMessages |
    BrowserViewMessages.RenderMessage;
export type MainMessages = FrameMessages.MainMessages | 
    ProcessMessages.MainMessages |
    BrowserViewMessages.MainMessage;
export type AnyMessage = RenderMessages | MainMessages;
