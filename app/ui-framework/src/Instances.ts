import { nanoid } from "nanoid";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Promisable } from "type-fest";
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
    serialize: () => Promisable<SERIALIZABLE>,
    destroy: () => Promisable<void>,
    hidden: boolean,
    actions: {[functionName: string]: Function}
}


export type InstanceCreationObject<STATE extends Object = any, SERIALIZABLE extends Object = any> = Omit<Partial<Instance<STATE, SERIALIZABLE>>, 'programName'>;


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

    const _registry: InstanceMap = {};
    const programGroupedRegistry: {[programName: string]: InstanceMap } = {};

    export const creation = new Observable<Instance>((observer) => {
        _instanceCreation.subscribe(({instance}) => {
            observer.next(instance);
        });
    });


    function registry() {
        return _registry;
    }
    

    function registerForProgram<STATE=any,META=any>(instance: Instance<STATE, META>) {
        const program: Program<STATE, META> | null = ProgramRegistry.get(instance.programName);
        if(programGroupedRegistry[program.uniqueName] === undefined) {
            programGroupedRegistry[program.uniqueName] = {};
        }
        programGroupedRegistry[program.uniqueName][instance.id] = instance;
    }

    _instanceCreation.subscribe(({instance,callback,error}) => {
        try {
            _registry[instance.id] = instance;
            registerForProgram(instance);
            callback();
        } catch(e: any) {
            error(e);
        }
    });

    export function get(instanceId: string) {
        return _registry[instanceId];
    }


    export function getMapByProgram(programUniqueName: string) {
        return programGroupedRegistry[programUniqueName];
    }
    export function getByProgram(programUniqueName: string) {
        return Object.values(getMapByProgram(programUniqueName));
    }

    

    export function destroy() {

    }

    export function create<STATE extends Object = any, SERIALIZABLE extends Object = any>(programKey: string, {
        id,
        name,
        title,
        iconImg,
        state,
        serialize,
        destroy
    } : InstanceCreationObject<STATE, SERIALIZABLE> = {}): Promise<Instance<STATE, SERIALIZABLE>> {

        const program = ProgramRegistry.get(programKey);

		if(program === null) {
			throw new Error(`Project with key of '${programKey}' was not found.`);
		}
    
        const instance: Instance<STATE, SERIALIZABLE> = program.instanceInit({
            programName: program.uniqueName,
            id: id !== undefined ? id : nanoid(),
            iconImg: iconImg ? iconImg : new BehaviorSubject<string|undefined>(''),
            // It's assumed to be active on creation
            hidden: false
        });

        instance.name = name || instance.name;
        instance.title = title || instance.title;
        //TODO: make a record to behavior subjects and merge the records.
        instance.state = state || instance.state;
        instance.serialize = serialize || instance.serialize;
        instance.destroy = destroy || instance.destroy;
    
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