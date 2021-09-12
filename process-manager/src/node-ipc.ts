import { ElectronMessage, LogPayload, ProcessManagerMessage } from "jank-shared/src/communication/process-manager-ipc";
import { merge } from "rxjs";
import { logger } from "./logger";
import { ProcessRegistry } from "./processes/process-registry";

export module NodeIPC {

    export function send(msg: ProcessManagerMessage) {
        return process.send!(msg);
    }

    export function print(text: string) {
        const payload = {
            type: 'pm-log',
            payload: {
                type: 'info',
                text: `PM: ${text}`
            }
        } as LogPayload;
        logger.info(`Sending Node IPC print:`, payload);
        return NodeIPC.send(payload);
    }

    export function messageRouting(msg: ElectronMessage) {
        switch(msg.type) {
            case "e-ping":
                NodeIPC.print('pong');
                break;
            case "e-init":
                throw new Error("Aready initialized, shouldn't get here.");
            case "e-spawn-request":
                NodeIPC.print("Recieved spawn process request.");
                const spawnedProcess = ProcessRegistry.spawn(msg.payload.command, {
                    name: msg.payload.name,
                    args: msg.payload.args,
                    programName: msg.payload.program,
                    encoding: msg.payload.encoding
                });
                NodeIPC.send({
                    type: 'pm-spawn-response',
                    payload: {
                        id: spawnedProcess.id,
                        request_id: msg.payload.request_id
                    }
                });
                break;
            default:
                // As any because of never type.
                throw new Error("Unknown message type of: " + (msg as any).type);
        }
    }
}



