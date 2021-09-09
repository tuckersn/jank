import { Socket } from "net";
import { ElectronMessage, InitializationPayload, LogPayload } from "jank-shared/dist/ipc/process-manager"
import { NodeIPC } from "./node-ipc";
import { ProcessRegistry } from "./process-registry";

// First payload is args
process.once('message', function main({type, payload}: InitializationPayload) {
    NodeIPC.send({
        type: 'pm-init-response'
    });
    NodeIPC.print("Initializaiton recieved: " + JSON.stringify({type,payload}, null, 4))
    
    const { httpPort, tcpPort } = payload;
    const tcpServer = 

    process.on('message', (msg: [ElectronMessage]) => {
       NodeIPC.messageRouting(msg as any);
    });
});
