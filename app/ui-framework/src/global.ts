import * as Layout from "./layout";
import { TitleBar } from "./layout/titlebar";
import { InstanceRegistry } from "./Instances";
import { ProgramRegistry } from "./Programs";

function json<T extends Object>(value: T): string {
    return JSON.stringify(value, null, 4);
};

function values<T extends Object>(value: T): any[] {
    return Object.values(value);
};

function keys<T extends Object>(value: any): string[] {
    return Object.keys(value);
}


export let GlobalThings = {
    json,
    values,
    keys,
    InstanceRegistry,
    ProgramRegistry,
	Layout,
	TitleBar
}

export function loadIntoGlobal() {
    for(let key of Object.keys(GlobalThings)) {
        //@ts-expect-error
        globalThis[key] = GlobalThings[key];
    }
}