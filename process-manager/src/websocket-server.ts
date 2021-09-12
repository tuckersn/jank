import { Promisable } from 'type-fest';
import {Server, default as WebSocket} from 'ws';
import { NodeIPC } from './node-ipc';
import { ExecutableProcess, ProcessRegistry } from './processes/process-registry';


export module WebSocketServer {
    export type ConnectionState = {

    }

    export function create(port: number, onConnection: (process: ExecutableProcess, socket: WebSocket, state: ConnectionState) => Promisable<(msg: string | Buffer) => Promisable<void>>) {
        const wss = new Server({
            port
        });

        // On new client.
        wss.on('connection', (socket,msg) => {

            socket.on('close', () => {
                console.log("SOCKET CLOSED");
            }) 

            //console.log("Incoming websocket connection:", msg, socket);
            socket.once('message', async (msg: string | Buffer) => {
                try {
                    console.log("GOT LOGIN:", msg);
                    
                    msg = typeof msg === 'string' ? msg : msg.toString('utf-8');

                    if(!/[A-Za-z0-9_-]+:[A-Za-z0-9_-]+/im.test(msg)) {
                        socket.close(4003);
                        throw new Error("Invalid format for first message!: " + msg);
                    }

                    const [id, secret] = msg.split(':');
                    if(!(id in ProcessRegistry.processes)) {
                        socket.close(4004);
                        throw new Error("Invalid process id: " + msg);
                    }


                    //TODO: validate secret.
                    console.log("PASSED LOGIN CHECKS.")
                    const exec: ExecutableProcess = ProcessRegistry.processes[id];
                    const state: ConnectionState = {};

                    const shutdownSubscription = exec.shutdown.subscribe(() => {
                        //socket.removeAllListeners();
                        socket.close(4000);
                        shutdownSubscription.unsubscribe();
                    });

                    const messageCallback = await onConnection(exec, socket, state);
                    socket.on('message', (msg: string | Buffer) => {
                        //console.log("WS DIRECT:", msg, messageCallback.toString());
                        messageCallback(msg);
                    });
                    NodeIPC.print(`SOCKET CONNECTED`);
                } catch(e: any) {
                    console.error(`[WS FATAL]: ${e.stack || e}`);
                }
            });
        });
    }
}