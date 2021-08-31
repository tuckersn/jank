import { Instance, TabProps } from "../components/tab/TabManager";
import { Extension } from "./Extension";

const extensions: {[name: string]: Extension} = {};


export function exists(name: string): boolean {
    return name in extensions;
}


export function get(name: string): Extension {
    if(exists(name)) {
        return extensions[name];
    } else {
        throw `No extension named '${name}'.`;
    }
}


export function register(name: string, tabFactory: React.FC<TabProps>) {
    extensions[name] = new Extension(name, tabFactory);
}

export function remove(name: string) {
    if(name in extensions)
        delete extensions[name];
    else
        throw "No extension named: " + name;
}