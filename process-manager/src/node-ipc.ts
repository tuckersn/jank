import { LogPayload, ProcessManagerMessage } from "jank-shared/dist/ipc/process-manager";

export module NodeIPC {

    export function send(msg: ProcessManagerMessage) {
        return process.send!(msg);
    }

    export function print(text: string) {
        return NodeIPC.send({
            type: 'pm-log',
            payload: {
                type: 'info',
                text: `PM: ${text}`
            }
        } as LogPayload);
    }
}