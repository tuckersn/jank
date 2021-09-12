import { Socket } from "net";
import { ElectronMessage, InitializationPayload, LogPayload } from "jank-shared/src/communication/process-manager-ipc"
import { NodeIPC } from "./node-ipc";
import { ProcessRegistry } from "./processes/process-registry";
import { WebSocketServer } from "./websocket-server";
import { logger } from "./logger";


// process.on('unhandledRejection', (reason) => {
//     logger.error(reason);
// })
// process.on('uncaughtException', (reason) => {
//     logger.error(reason);
// })



// First payload is args
process.once('message', function main({type, payload}: InitializationPayload) {
    console.log("NODE VERSION:", process.version);
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
        exec.output.subscribe((output) => {
            socket.send(output);
        });
        return (msg) => {
            exec.input.next(typeof msg === 'string' ? Buffer.from(msg) : msg);
        };
    });

});
