import { ChildProcess, ChildProcessByStdio, fork } from "child_process";
import * as process from "process";
import { ElectronMessage, ProcessManagerMessage, InitializationPayload, InitializationResponsePayload, SpawnRequestPayload } from "@janktools/shared/src/communication/process-manager-ipc";

import { TCP } from "@janktools/shared/dist/networking/tcp";
import { Observable, Subject } from "rxjs";
import { ipcMain } from "electron";
import { ProcessMessages } from "@janktools/shared/src/communication/render-ipc";
import { WindowRegistry } from "../windows/window-registry";




export module ProcessManager {
    
    const maxRetries: Readonly<number> = 5;
    const input = new Subject<ElectronMessage>();
    const output = new Subject<ProcessManagerMessage>();
    
    // if start() has been ran
    let initialized: boolean = false;
    let processManagerProcess: ChildProcess | undefined;
    let httpServerPort: number = 35000;


    export function ports(): Readonly<{http?: number, tcp?: number}> {
        return {
            http: httpServerPort
        }
    }


    /**
     * Sends a message over the IPC
     * wrapped with ElectronMessage.
     */
    function send(msg: ElectronMessage) {
        if(processManagerProcess) {
            processManagerProcess.send(msg);
        }
    }


    /**
     * Handles incoming messages routing them to seperate logic.
     */
    async function incomingMessage(msg: ProcessManagerMessage) {
        switch(msg.type) {
            case "pm-ping":
                break;
            case "pm-log":
                if(msg.payload.type === 'err') {
                    console.error(msg.payload.text);
                } else {
                    console.log(msg.payload.text);
                }
                break;
            case "pm-spawn-response":
                console.log("Got spawn response.");
                const payload: ProcessMessages.MSpawnResponse = {
                    type: 'process-M-spawn-response',
                    payload: {
                        id: msg.payload.id,
                        requestId: msg.payload.request_id
                    }
                };
                WindowRegistry.broadcast('process', payload);
                break;
            default:
                throw new Error("Invalid message type: " + msg.type);
        }
    }




    /**
     * Initialization function for ProjectManager.
     */
    export async function start(): Promise<{
        input: Subject<ElectronMessage>;
        output: Observable<ProcessManagerMessage>;
    }> {

        if(initialized) {
            throw "Already initialized the Process Manager."
        }

        // Find open HTTP port.
        for(let i = 0; i <= maxRetries; i++) {
            try {
                let used = await TCP.check(httpServerPort);
                if(!used) {
                    break;
                } else {
                    if(i === maxRetries) {
                        throw "No valid HTTP port found."
                    }
                    httpServerPort += i * 100;
                }
            } catch(e) {
                console.error("TCP CHECKING ERROR:", e);
            }
        }

        processManagerProcess = fork("../process-manager/dist/main.js", {
            cwd: process.cwd(),
            stdio: ["ipc", "pipe", "pipe"]
        });

        
        processManagerProcess.stdout.on('data', (data) => {
            console.log(`[PROCESS MANAGER]: ${data}`);
        });

        if(processManagerProcess.stderr)
            processManagerProcess.stderr.on('data', (data) => {
              console.error(`[PROCESS MANAGER][ERROR]: ${data}`);
            });


        processManagerProcess.send({
            type: 'e-init',
            payload: {
                httpPort: httpServerPort
            }
        } as InitializationPayload);

        processManagerProcess.on('error', (err) => {
            console.error("FAILED TO START PROCESS MANAGER:", err);
        });


        processManagerProcess.on('close', (code, signal) => {
            console.error("ProcessManager closed!", code, signal);
            process.exit(1);
        });

        // This is the start of the IPC communication!
        processManagerProcess.once('message', (msg: InitializationResponsePayload) => {
            console.log("*PM*");
            if(msg.type !== 'pm-init-response')
                throw new Error("Invalid initialization response: " + JSON.stringify(msg));

            // On ProcessManager sending over IPC.
            processManagerProcess.on('message', (msg: ProcessManagerMessage, handle) => {
                if(typeof msg !== 'object') {
                    console.log("INVALID MESSAGE:", msg);
                    throw new Error("Invalid message from ProcessManager:" + msg);
                } else {
                    incomingMessage(msg);
                }
            });

            // Electron to ProcessManager messages.
            input.subscribe((msg) => {

                processManagerProcess.send(msg);
            }); 
        });



        
      

        


        return {
            input,
            output
        }
    }


    /**
     * External to module spawning of process.
     */
    export function spawnProcess(command: string, {
        encoding,
        name,
        program,
        requestId
    } : {
        encoding?: BufferEncoding,
        name?: string,
        program?: string,
        requestId?: string
    }) {
        //TODO: fix request_id, stopped here.
        send({
            type: 'e-spawn-request',
            payload: {
                command: command,
                encoding,
                name,
                program,
                request_id: requestId
            }
        })
    }

}