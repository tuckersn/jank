import { nanoid } from "nanoid";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Program, ProgramRegistry } from "./Programs";


/**
 * Serializable parts of a pane component.
 * 
 * This is like the meta-data of a tab.
 */
export interface Instance<STATE extends Object = any, SERIALIZABLE extends Object = any> {
    programName: string,
    id: string,
    name?: string,
    title?: string,
    iconImg: BehaviorSubject<string|undefined>,
    state: STATE,
    meta: SERIALIZABLE
}

export type InstanceCreationObject<STATE extends Object = any, SERIALIZABLE extends Object = any> = 
    Pick<Instance<STATE, SERIALIZABLE>, 'state'  | 'meta'> 
    & Omit<Partial<Instance<STATE, SERIALIZABLE>>, 'programName'>;


const _instanceCreation: Subject<{
    instance: Instance<any, any>,
    /**
     * DO NOT CALL OUTSIDE OF ProgramRegistry
     */
    callback: () => void
    /**
     * DO NOT CALL OUTSIDE OF ProgramRegistry
    */
    error: (error: Error) => void
}> = new Subject();






export module InstanceRegistry {

    export interface InstanceMap {
        [instanceId: string]: Instance;
    }

    const registry: InstanceMap = {};
    const programGroupedRegistry: {[programName: string]: InstanceMap } = {};

    export const creation = new Observable<Instance>((observer) => {
        _instanceCreation.subscribe(({instance}) => {
            observer.next(instance);
        });
    });
    

    function registerForProgram<STATE=any,META=any>(instance: Instance<STATE, META>) {
        const program: Program<STATE, META> = ProgramRegistry.get(instance.programName);
        if(programGroupedRegistry[program.uniqueName] === undefined) {
            programGroupedRegistry[program.uniqueName] = {};
        }
        programGroupedRegistry[program.uniqueName][instance.id] = instance;
    }

    _instanceCreation.subscribe(({instance,callback,error}) => {
        try {
            registry[instance.id] = instance;
            registerForProgram(instance);
            callback();
        } catch(e: any) {
            error(e);
        }
    });

    export function get(instanceId: string) {
        return registry[instanceId];
    }

    export function getByProgram(programUniqueName: string) {
        return programGroupedRegistry[programUniqueName];
    }

    export function destroy() {

    }

    export function create<STATE extends Object = any, SERIALIZABLE extends Object = any>(program: Program<STATE, SERIALIZABLE>, {
        id,
        name,
        title,
        iconImg,
        state,
        meta
    } : InstanceCreationObject<STATE, SERIALIZABLE>): Promise<Instance<STATE, SERIALIZABLE>> {
    
        const instance: Instance<STATE, SERIALIZABLE> = program.instanceInit({
            programName: program.uniqueName,
            id: id !== undefined ? id : nanoid(),
            name,
            title,
            iconImg: iconImg ? iconImg : new BehaviorSubject<string|undefined>(''),
            state,
            meta
        });
    
        return new Promise((res,err) => {
            _instanceCreation.next({
                instance,
                callback: () => {
                    res(instance)
                },
                error: err
            })
        });
    }
}