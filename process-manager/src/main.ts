import { Socket } from "net";
import { ElectronMessage, InitializationPayload, LogPayload } from "jank-shared/src/communication/process-manager-ipc"
import { NodeIPC } from "./node-ipc";
import { ProcessRegistry } from "./process-registry";
import { WebSocketServer } from "./websocket-server";

// First payload is args
process.once('message', function main({type, payload}: InitializationPayload) {
    
    //TODO: simple verifictaion of initialization payload.
    NodeIPC.send({
        type: 'pm-init-response'
    });
    NodeIPC.print("Initializaiton recieved: " + JSON.stringify({type,payload}, null, 4))
    process.on('message', (msg: [ElectronMessage]) => {
       NodeIPC.messageRouting(msg as any);
    });

    const { httpPort } = payload;
    const webServer = WebSocketServer.create(httpPort, (exec, socket, state) => {
        exec.stdout.subscribe((out) => {
            socket.send(out);
        });
        return (msg) => {
            exec.stdin.next(typeof msg === 'string' ? msg : msg.toString('utf-8'));
        };
    });

});
