import * as ip from "ip";
import { Socket } from "net";
import { parse } from "url";


export module TCP {
    /**
     * Checks if a given port is open
     * 
     * Loosely based on: https://github.com/stdarg/tcp-port-used
     */
    export function check(port: number, host: string = "127.0.0.1"): Promise<boolean> {
        try {
            const client = new Socket();

            function cleanUp() {
                client.removeAllListeners('connect');
                client.removeAllListeners('error');
                client.end();
                client.destroy();
                client.unref();
            }

            return new Promise(async (res, err) => {
                client.once('connect', () => {
                    res(true);
                });

                client.once('error', (error: {code:string} & Error) => {
                    if (error.code !== 'ECONNREFUSED') {
                        err(error);
                    } else {
                        res(false);
                    }
                    cleanUp();
                });

                client.connect({
                    port: port,
                    host: host
                });
            });
        } catch(e: any) {
            const msg = "Failed to check TCP port:" + (e.stack || e);
            console.error(msg);
            throw new Error(msg);
        }
    }
}