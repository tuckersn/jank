

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

    export type RAttach = Message<`${typeof PREFIX}-R-attach`, {
        target: {
            id: string
        }
    }>;

    export type RDetach = Message<`${typeof PREFIX}-R-detach`, {
        target: {
            id: string
        }
    }>;

    /**
     * Sent when the renderer wants
     */
    export type RSpawn = Message<`${typeof PREFIX}-R-spawn`, {
        // UUID for waiting for a response message
        requestId?: string,
        // Preset browserViewId, set this if you already have an id.
        id?: string
    }>;

    export type MSpawnResponse = Message<`${typeof PREFIX}-M-spawn-response`, {
        id: string,
        requestId?: string
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

    /**
     * Sent when the renderer wants to change the URL of the BrowserView.
     */
    export type RNavigate = Message<`${typeof PREFIX}-R-navigate`, {
        requestId?: string,
        /**
         * Reply when the page finishes navigation instead.
         */
        replyWhenFinished?: boolean,
        target: {
            id: string
        },
        url: string
    }>;
    export type MNavigated = Message<`${typeof PREFIX}-M-navigated`, {
        requestId?: string,
        id: string,
        url: string,
        title: string
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

    export type RenderMessages = RSpawn | RDetach | RDestroy | RPosition | RAttach | RNavigate;
    export type MainMessages = MSpawnResponse | MDestroyResponse | MNavigated;
    export type AnyMessage = RenderMessages | MainMessages;
}


export type Prefixes = typeof FrameMessages.PREFIX |
    typeof ProcessMessages.PREFIX |
    typeof BrowserViewMessages.PREFIX;
export type RenderMessages = FrameMessages.RenderMessages | 
    ProcessMessages.RenderMessages |
    BrowserViewMessages.RenderMessages;
export type MainMessages = FrameMessages.MainMessages | 
    ProcessMessages.MainMessages |
    BrowserViewMessages.MainMessages;
export type AnyMessage = RenderMessages | MainMessages;
