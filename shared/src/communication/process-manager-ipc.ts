/*****
 * Tools for communication between /electron and /process-manager
 */


/**
 * One-time payload sent by electron right at the start of ProcessManager.
 */
export type InitializationPayload = {
    type: 'e-init',
    payload: {
        httpPort: number;
        tcpPort: number;
    }
}
/**
 * One-time payload sent as a response to Electron at the start of ProcessManager.
 */
export type InitializationResponsePayload = {
    type: 'pm-init-response'
}

export type LogPayload = {
    type: 'pm-log',
    payload: {
        type: 'info' | 'err',
        text: string
    }
}




export type SpawnRequestPayload = {
    type: 'e-spawn-request',
    payload: {
        command: string,
        name?: string,
        program?: string,
        /** 
         * Used when you need to wait for the process
         * to be spawned on the Electron side.
         */
        request_id?: string,
        encoding?: BufferEncoding
    }
}

export type SpawnResponsePayload = {
    type: 'pm-spawn-response',
    payload: {
        id: string,
        /** 
         * Comes from SpawnRequestPayload
         */
        request_id?: string
    }
}


export type EPingPayload = {
    type: 'e-ping',
    payload: undefined
}

export type PPingPayload = {
    type: 'pm-ping',
    payload: undefined
}


// Message from Electron
export type ElectronMessage = InitializationPayload | SpawnRequestPayload | EPingPayload;

// Message from Process Manager
export type ProcessManagerMessage = InitializationResponsePayload | LogPayload | SpawnResponsePayload | PPingPayload;