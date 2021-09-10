import { Promisable } from 'type-fest';
import {Server, default as WebSocket} from 'ws';
import { NodeIPC } from './node-ipc';
import { ExecutableProcess, ProcessRegistry } from './process-registry';


export module WebSocketServer {
    export type ConnectionState = {

    }

    export function create(port: number, onConnection: (process: ExecutableProcess, socket: WebSocket, state: ConnectionState) => Promisable<(msg: string | Buffer) => Promisable<void>>) {
        const wss = new Server({
            port
        });

        // On new client.
        wss.on('connection', (socket,msg) => {
            console.log("IC:", msg, socket);
            socket.once('message', async (msg: string | Buffer) => {
                
                msg = typeof msg === 'string' ? msg : msg.toString('utf-8');

                if(!/[A-Za-z0-9_-]+:[A-Za-z0-9_-]+/im.test(msg)) {
                    socket.close(403);
                    throw new Error("Invalid format for first message!: " + msg);
                }

                const [id, secret] = msg.split(':');
                if(!(id in ProcessRegistry.processes)) {
                    socket.close(404);
                    throw new Error("Invalid process id: " + msg);
                }

                //TODO: validate secret.
                
                const exec: ExecutableProcess = ProcessRegistry.processes[id];
                const state: ConnectionState = {};
                const messageCallback = await onConnection(exec, socket, state);
                socket.on('message', (msg: string | Buffer) => {
                    messageCallback(msg);
                });
                NodeIPC.print(`SOCKET: ${JSON.stringify(socket, null, 4)}\n\n\n${JSON.stringify(msg,null,4)}`);
            });
        });
    }
}