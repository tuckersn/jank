import { ChildProcessByStdio, spawn as spawnProcess } from "child_process";
import { Observable, Subject } from "rxjs";
import { nanoid } from "nanoid";
import { Promisable } from "type-fest";
import { Writable, Readable, Stream, Pipe } from 'node:stream';

import { BufferEncoding } from "jank-shared/src/shims"

export interface ExecutableProcess {
    id: Readonly<string>;
    command: Readonly<string>;
    name?: Readonly<string>;
    program?: Readonly<string>;
    stdout: Observable<string>;
    stdin: Subject<string>;
    ref?: ChildProcessByStdio<Writable, Readable, Readable>;
}

export module ProcessRegistry {
    
    export const processes: {[id: string]: ExecutableProcess} = {};
    export const programs: {[programName: string]: {[id: string]: ExecutableProcess}} = {};
    export const namedProcesses: {[name: string]: ExecutableProcess} = {};
    
    export function spawn(command: string, {
        name,
        program,
        encoding,
    } : {
        name?: string;
        program?: string;
        encoding?: BufferEncoding;
    }): ExecutableProcess {
        const id: Readonly<string> = nanoid();
        const stdout = new Subject<string>();
        const stdin = new Subject<string>();
        if(id in processes) {
            throw "Duplicate id when spawning process."
        }
        
        const process = spawnProcess(command, {
            shell: true,
            stdio: ["pipe", "pipe", "pipe"]
        }) as ChildProcessByStdio<Writable, Readable, Readable>;

        processes[id] = {
            id,
            command,
            stdout,
            stdin,
            ref: process
        }

        if(name)
            namedProcesses[name] = processes[id];

        if(program) {
            if(!(program in programs)) {
                programs[program] = {};
            } else {
            programs[program][id] = processes[id];
            }
        }

        process.stdout.setEncoding(encoding || 'utf-8');

        process.stdout.on('data', (chunk) => {
            stdout.next(chunk);
        });

        stdin.subscribe((chunk) => {
            process.stdin.emit(chunk);
        });

        process.on('close', async () => {
            stdin.complete();
            stdout.complete();
            delete processes[id];
            if(name)
                delete namedProcesses[name];
            if(program)
                delete programs[program][id];
        });

        return processes[id];
    }

    export function close(id: string): ExecutableProcess {
        if(!(id in processes)) {
            throw new Error("Invalid process id: " + id);
        }
        if(processes[id].ref) {
            processes[id]!.ref!.kill();
        }
        return processes[id];
    }
    
}