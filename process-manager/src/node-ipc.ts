import { ElectronMessage, LogPayload, ProcessManagerMessage } from "jank-shared/dist/ipc/process-manager";
import { ProcessRegistry } from "./process-registry";

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

    export function messageRouting(msg: ElectronMessage) {
        switch(msg.type) {
            case "e-ping":
                NodeIPC.print('pong');
                break;
            case "e-init":
                throw new Error("Aready initialized, shouldn't get here.");
            case "e-spawn-request":
                const spawnedProcess = ProcessRegistry.spawn(msg.payload.command, {
                    name: msg.payload.name,
                    program: msg.payload.program,
                    encoding: msg.payload.encoding
                });
                NodeIPC.send({
                    type: 'pm-spawn-response',
                    payload: {
                        id: spawnedProcess.id,
                        response_key: msg.payload.response_key
                    }
                });
                break;
            default:
                // As any because of never type.
                throw new Error("Unknown message type of: " + (msg as any).type);
        }
    }
}



