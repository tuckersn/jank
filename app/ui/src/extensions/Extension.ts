import { existsSync, readFileSync } from "fs";
import { Promisable } from "type-fest";
import { path } from "../common/shims/node";
import * as Programs from "@janktools/ui-framework/dist/Programs";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";
import { Theme } from "@janktools/ui-framework/dist/Theme";
import { IExtensionModule } from "@janktools/ui-framework/dist/Extension";




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