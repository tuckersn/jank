import { nanoid } from "nanoid";
import React from "react";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Promisable } from "type-fest";
import { REPLTab } from "./debugging/REPLTab";
import { ProgramListPane } from "./debugging/ProgramListPane";
import { ImagePane } from "./files/ImageProgram";
import { TextEditorTab } from "./files/TextEditorProgram";
import { PaneProps } from "./Panes";
import { TerminalTab } from "./TerminalTab";
import { TextDisplayPane } from "./TextDisplayProgram";
import { FileBrowserProgram } from "./files/FileBrowserProgram";
import { ErrorPane } from "./ErrorPane";
import { Instance, InstanceCreationObject } from "./Instances";
import { WebBrowserProgram } from "./web/WebBrowserProgram";



/**
 * The global state of a given pane type basically.
 * 
 * This is accessible by multiple tabs, this
 * information is independent of instance information.
 */
export interface Program<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any, SERIALIZABLE extends Object = any> {
    uniqueName: Readonly<string>;
    component: React.FC<PaneProps<INSTANCE_STATE>>;
    state: PROGRAM_STATE,

    deleted: Readonly<boolean>;
    /**
     * Must verify the incoming state has proper values,
     * and serves an init function. ***Should throw an error if state or meta
     * do not contain required fields for operation.***
     * 
     * INSTANCE_STATE should have optional and required properties based on this
     * function's resulting instance.
     */
    instanceInit: (instance: Partial<Instance<INSTANCE_STATE, SERIALIZABLE>>) => Instance<INSTANCE_STATE, SERIALIZABLE>;
 
    onRegistration: () => void; 
    onDestruction: () => void;
}

/**
 * Minimum required fields to create a Program.
 */
export type MinimalProgram<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any> = Omit<Program<INSTANCE_STATE, PROGRAM_STATE>, 
    'deleted' | 'onRegistration' | 'onDestruction'> & Partial<Program<INSTANCE_STATE, PROGRAM_STATE>>;


const _programCreation: Subject<{
    program: Program,
    /**
     * DO NOT CALL OUTSIDE OF ProgramRegistry
     */
    callback: () => void
    /**
     * DO NOT CALL OUTSIDE OF ProgramRegistry
    */
    error: (error: Error) => void
}> = new Subject();


export const programCreation = new Observable<Program>((observer) => {
    _programCreation.subscribe(({program}) => {
        observer.next(program);
    });
});




export module ProgramRegistry {

    const registry: {[programName: string]: Program} = {};

    _programCreation.subscribe(({program, callback, error}) => {
        try {
            registry[program.uniqueName] = program;
            callback();
        } catch(e: any) {
            error(e);
        }
        program.onRegistration();
    });

    export function get(uniqueName: string) {
        return registry[uniqueName];
    }

    export async function destroy<ARGS=any>(uniqueName: string): Promise<Program<ARGS>> {
        await registry[uniqueName].onDestruction();
        const program = registry[uniqueName];
        delete registry[uniqueName];
        program.deleted = true;
        return program;
    }

        
    export function create<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any>({
        component,
        uniqueName,
        randomName = false,
        onRegistration = () => {},
        onDestruction = () => {},
        state,
        instanceInit: instanceState
    } : {randomName?: boolean} & MinimalProgram<INSTANCE_STATE, PROGRAM_STATE>): Promise<Program<INSTANCE_STATE>> {

        if(uniqueName === undefined) {
            if(randomName) {
                uniqueName = nanoid();
            } else {
                throw new Error(`Cannot create program without uniqueName set to a string or randomName set to true.`);
            }
        }

        const program: Program<INSTANCE_STATE, PROGRAM_STATE> = {
            uniqueName,
            component,
            deleted: false,
            onRegistration,
            onDestruction,
            instanceInit: instanceState,
            state: Object.assign({}, state)
        }

        return new Promise((res, err) => {
            _programCreation.next({
                program,
                callback: () => {
                    res(program);
                },
                error: (e: Error) => {
                    err(e)
                }
            })
        });
    }
}




const _DEFAULT_PROGRAMS: {[uniqueName: string]: Omit<MinimalProgram<any>, 'uniqueName'>} = {
    'jank-text': {
        component: TextDisplayPane,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {}
    },
    'jank-tab-list': {
        component: ProgramListPane,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {}
    },
    'jank-image': {
        component: ImagePane,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {}
    },
    'jank-terminal': {
        component: TerminalTab,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {}
    },
    'jank-repl': {
        component: REPLTab,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {}
    },
    'jank-text-editor': {
        component: TextEditorTab,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {}
    },
    'jank-file-browser': FileBrowserProgram,
    'jank-web-browser': WebBrowserProgram,
    'error': {
        component: ErrorPane,
        instanceInit: (instance) => {
            return instance as Required<typeof instance>;
        },
        state: {}
    }
}

export const DEFAULT_PROGRAMS: Readonly<typeof _DEFAULT_PROGRAMS> = _DEFAULT_PROGRAMS;

for(let program of Object.keys(DEFAULT_PROGRAMS)) {
    const programObject = DEFAULT_PROGRAMS[program];
    ProgramRegistry.create({
        uniqueName: program,
        component: programObject.component,
        instanceInit: programObject.instanceInit,
        state: programObject.state,
    });
}



