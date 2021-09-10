export interface Message {
    type: string,
    payload: Object
}

export module FrameMessages {

    export interface RClose extends Message {
        type: 'frame-close'
    }
    
    export interface RMinimize extends Message {
        type: 'frame-minimize'
    }
    
    export interface RMaximize extends Message {
        type: 'frame-maximize'
    }

    export interface MMaximized extends Message {
        type: 'frame-maximized',
        payload: {
            maximized: boolean
        }
    }

    export type RenderMessages = RClose | RMinimize | RMaximize;
    export type MainMessages = MMaximized;
    export type AnyMessage = RenderMessages | MainMessages;
}

export module ProcessMessages {
    export interface RSpawn extends Message {
        type: 'process-spawn',
        payload: {
            request_id?: string,
            command: string
        }
    }

    export interface MSpawnResponse extends Message {
        type: 'process-spawn-response',
        payload: {
            request_id?: string
        }
    }

    export type RenderMessages = RSpawn;
    export type MainMessages = MSpawnResponse;
    export type AnyMessage = RenderMessages | MainMessages;
}


export type RenderMessages = FrameMessages.RenderMessages | ProcessMessages.RenderMessages;
export type MainMessages = FrameMessages.MainMessages | FrameMessages.MainMessages;
export type AnyMessage = RenderMessages | MainMessages;
