import { Socket } from "net";
import { ElectronMessage, InitializationPayload, LogPayload } from "jank-shared/src/communication/process-manager-ipc"
import { NodeIPC } from "./node-ipc";
import { ProcessRegistry } from "./processes/process-registry";
import { WebSocketServer } from "./websocket-server";
import { logger } from "./logger";
import { ProcessManagerWS } from "jank-shared/dist/communication/process-manager-ws";

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
            socket.send("out:" + output);
        });
        return (msg) => {
            const {starting,data} = ProcessManagerWS.split(msg.toString('utf-8'));
            switch(starting) {
                case "in":
                    exec.input.next(Buffer.from(data));
                    break;
                case "kill":
                    exec.shutdown.next({code:0});
                    break;
                case "resize":
                    const size: {cols:number,rows:number} = JSON.parse(data);
                    //TODO: needs to be keep track of each client's size and then use the minimum.
                    //TODO: send it back, maybe to all OTHER clients.
                    exec.size.next(size);
                    break;
            }
            
        };
    });

});
