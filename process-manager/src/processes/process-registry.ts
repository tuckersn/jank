import { ChildProcessByStdio, spawn as nodeSpawnProcess, default as child_process } from "child_process";
import { Observable, Subject, BehaviorSubject, merge, mergeAll } from "rxjs";
import { nanoid } from "nanoid";
import { Promisable } from "type-fest";
import { Writable, Readable, Stream, Pipe } from 'node:stream';
import * as pty from "node-pty";

import { BufferEncoding } from "jank-shared/src/shims"
import { NodeIPC } from "../node-ipc";
import { logger } from "../logger";

// export interface ExecutableProcess {
//     id: Readonly<string>;
//     command: Readonly<string>;
//     name?: Readonly<string>;
//     program?: Readonly<string>;
//     stderr: Observable<string>;
//     stdout: Observable<string>;
//     shutdown: Observable<void>;
//     stdin: Subject<string>;
//     ref?: ChildProcessByStdio<Writable, Readable, Readable>;
// }
export abstract class ExecutableProcess {
    public executed: boolean = false;
    public input = new Subject<Buffer>();
    public output = new Subject<Buffer>();
    public size = new BehaviorSubject<{
        cols: number,
        rows: number
    }>({
        cols: 100,
        rows: 30
    });
    public shutdown = new Subject<{code?: number, signal?: number}>();

    constructor(public id: string, public command: string, public options: {
        args?: string[],
        name?: string,
        programName?: string
    }) {
        this.shutdown.subscribe(() => {
            console.log("SHUTTING DOWN:", this.id);
            this.input.complete();
            this.output.complete();
            this.shutdown.complete();
            //@ts-expect-error
            delete this.input;
            //@ts-expect-error
            delete this.output;
            //@ts-expect-error
            delete this.shutdown;
        });

    }

    abstract execute(): Promise<void>;
    
}

export class ExecutableProcessTerminal extends ExecutableProcess {
    public async execute() {
        const spawnedProcess = pty.spawn(this.command, this.options.args || [], {
            cols: 60,
            rows: 60,
            cwd: process.env.HOME
        });
        
        spawnedProcess.onData((chunk) => {
            this.output.next(Buffer.from(chunk));
        });

        spawnedProcess.onExit(({exitCode, signal}) => {
            this.shutdown.next({code: exitCode,signal});
        });


        this.input.subscribe((chunk) => {
            spawnedProcess.write(chunk.toString());                        
        });

        const shutdownSubscription = this.shutdown.subscribe(({code, signal}) => {
            spawnedProcess.kill();
            //shutdownSubscription.unsubscribe();
        });

        const resizeSubscription = this.size.subscribe(({cols, rows}) => {
            spawnedProcess.resize(cols, rows);
            //resizeSubscription.unsubscribe();
        });

        this.executed = true;
    }
}

export class ExecutableProcessNode extends ExecutableProcess {
    public async execute() {
        const spawnedProcess = nodeSpawnProcess(this.command, this.options.args || [], {
            shell: true,
            stdio: ["pipe", "pipe", "pipe"]
        }) as ChildProcessByStdio<Writable, Readable, Readable>;

        //todo: all of this.
    }
}

export module ProcessRegistry {
    
    export const processes: {[id: string]: ExecutableProcess} = {};
    export const programs: {[programName: string]: {[id: string]: ExecutableProcess}} = {};
    export const namedProcesses: {[name: string]: ExecutableProcess} = {};



    function terminalProcess(file: string) {

    }


    function nodeProcess(command: string) {

    }


    
    export function spawn(command: string, {
        name,
        programName,
        encoding,
        args,
        terminal = true
    } : {
        args?: string[];
        name?: string;
        programName?: string;
        encoding?: BufferEncoding;
        terminal?: boolean;
    }): ExecutableProcess {

        console.log("COMMAND:", command);

        const id: Readonly<string> = nanoid();
        if(id in processes) {
            throw "Duplicate id when spawning process."
        }
        
        if(terminal) {
            processes[id] = new ExecutableProcessTerminal(id, command, {
                args,
                name,
                programName
            });
        } else {
            processes[id] = new ExecutableProcessNode(id, command, {
                args,
                name,
                programName
            });
        }


        if(name)
            namedProcesses[name] = processes[id];

        if(programName) {
            if(!(programName in programs)) {
                programs[programName] = {};
            } else {
                programs[programName][id] = processes[id];
            }
        }

        processes[id].execute();

        return processes[id];
    }

    

    export function close(id: string): ExecutableProcess {
        if(!(id in processes)) {
            throw new Error("Invalid process id: " + id);
        }
        processes[id].shutdown.next({
            code: 0
        });
        return processes[id];
    }
    
}