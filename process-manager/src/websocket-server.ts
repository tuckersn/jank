import {Server} from 'ws';
import { NodeIPC } from './node-ipc';

export function createWebSocketServer(port: number) {
    const wss = new Server({
        port
    });

    wss.on('connection', (socket,msg) => {
        // New client.
        NodeIPC.print(`SOCKET: ${JSON.stringify(socket, null, 4)}\n\n\n${JSON.stringify(msg,null,4)}`);
    });
}