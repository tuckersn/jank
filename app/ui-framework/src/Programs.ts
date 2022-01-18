import { nanoid } from "nanoid";
import React from "react";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { PaneProps } from "./Panes";
import { Instance, InstanceCreationObject, InstanceRegistry } from "./Instances";


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
    instanceInit: (instance: Pick<Instance<INSTANCE_STATE, SERIALIZABLE>, 'id' | 'programName' | 'iconImg' | 'hidden'>) => Instance<INSTANCE_STATE, SERIALIZABLE>;
    deserialize?: (serialized: SERIALIZABLE) => Promise<Instance<INSTANCE_STATE, SERIALIZABLE>>;
	
	defaultState?: () => void;
	onRegistration?: () => void; 
    onDestruction?: () => void;
}

/**
 * Minimum required fields to create a Program.
 */
export type MinimalProgram<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any, SERIALIZABLE extends Object = any> = Omit<Program<INSTANCE_STATE, PROGRAM_STATE, SERIALIZABLE>, 
    'deleted' | 'onRegistration' | 'onDestruction'> & Partial<Program<INSTANCE_STATE, PROGRAM_STATE, SERIALIZABLE>>;


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
        if(program.onRegistration)
            program.onRegistration();
    });

    export function get(uniqueName: string): Program<any, any, any> {
       	const program = registry[uniqueName];
		if(program === undefined) {
			throw new Error(`Program with key of '${uniqueName}' was not found.`);
		}
		return program;
    }

    export async function destroy<ARGS=any>(uniqueName: string): Promise<Program<ARGS>> {
        if(registry[uniqueName].onDestruction) {
            //@ts-expect-error
            await registry[uniqueName].onDestruction();
        }
        const program = registry[uniqueName];
        delete registry[uniqueName];
        program.deleted = true;
        return program;
    }

	export type IProgramCreationArgs<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any> =
		{randomName?: boolean} & MinimalProgram<INSTANCE_STATE, PROGRAM_STATE>;
        
    export function create<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any>({
        component,
        uniqueName,
        randomName = false,
        onRegistration = () => {},
        onDestruction = () => {},
        state,
        instanceInit,
        deserialize,
    } : IProgramCreationArgs): Promise<Program<INSTANCE_STATE>> {

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
            deserialize,
            deleted: false,
            onRegistration,
            onDestruction,
            instanceInit: instanceInit,
            state
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

export type ProgramConstructor = Parameters<typeof ProgramRegistry['create']>['0'];

export function minimumProgramArguments(name: string, component: React.FC<PaneProps>): MinimalProgram {
    return {
        uniqueName: name,
        component: component,
        instanceInit: (instance) => {
            return instance as any;
        },
        state: {},
        deserialize: () => {
           return InstanceRegistry.create(name);
        },
    };
}
