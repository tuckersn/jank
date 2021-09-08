import { Socket } from "net";
import { ElectronMessage, InitializationPayload, LogPayload } from "jank-shared/dist/ipc/process-manager"
import { NodeIPC } from "./node-ipc";


// First payload is args
process.once('message', ({type, payload}: InitializationPayload) => {

    NodeIPC.send({
        type: 'pm-init-response'
    });

    NodeIPC.print("Initializaiton recieved: " + JSON.stringify({type,payload}, null, 4))
    const { httpPort, tcpPort } = payload;
    process.on('message', (_msg: ElectronMessage[]) => {
        const msg = (_msg as any) as ElectronMessage;
        switch(msg.type) {
            case "e-ping":
                NodeIPC.print('pong');
                break;
            case "e-init":
                throw new Error("Aready initialized, shouldn't get here.");
            case "e-spawn-request":
                // actually start a process.
                break;
            default:
                // As any because of never type.
                throw new Error("Unknown message type of: " + (msg as any).type);
        }
    })
})
