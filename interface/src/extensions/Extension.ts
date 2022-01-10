import { existsSync, readFileSync } from "fs";
import { Promisable } from "type-fest";
import { path } from "../common/shims/node";
import { Programs } from "../programs";
import { ProgramRegistry } from "../programs/Programs";
import { Theme } from "../Theme";


export interface ICommonExtensionArgs {
    Programs: typeof Programs,
    ProgramRegistry: typeof ProgramRegistry,
    Theme: typeof Theme
}


export interface IExtensionModule {
    
    init: (args: ICommonExtensionArgs & {

    }) => Promisable<void>;

    onDestroy?: (args: ICommonExtensionArgs & {

    }) => Promisable<void>;
}

export module ExtensionRegistry {
    const _registry: {[packageName: string]: {
        name: string,
        version: string,
        path: string,
        license: string,
        module: IExtensionModule
    }} = {};

    export function load(packagePath: string) {
        
        function file(filePath: string) {
            return readFileSync(path.join(packagePath + filePath)).toString('utf8');
        }

        function exists(filePath: string) {
            return existsSync(path.join(packagePath + filePath));
        }
        
        const packageJSON = JSON.parse(file("package.json"));
        let module: IExtensionModule | null = null;

        if(exists("extension.tsx")) {

        } else if(exists("extension.jsx")) {

        } else if(exists("extension.ts")) {

        } else if(exists("extension.js")) {
            
        } 
        



        _registry[packageJSON.name] = {
            ...packageJSON,
            module
        }
    }
}