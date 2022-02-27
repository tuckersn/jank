import * as chalk from "chalk";
import highlight from "cli-highlight";

export type InspectOptions = {
    tabSize?: number;
    colors?: boolean;
}


let nodeUtilModuleRef: any | null = null;
export function util() {
	if(nodeUtilModuleRef === null) {
		nodeUtilModuleRef = require("util");
	}
	return nodeUtilModuleRef!;
}


export async function inspect(value: any, options: InspectOptions = {}): Promise<string> {
    
    console.log("INSPECTING:", value);
    let output: string = "error";

    switch(typeof value) {
        case "object":
            if(Array.isArray(value)) {
                return highlight(JSON.stringify(value, null, options.tabSize || 4),{
                    language: 'json'
                });
            } else {
				//TODO: verify we have access to node's modules?
                util().inspect(value);
            }
    }

    if(value === undefined || typeof value === 'undefined') {
        output = 'undefined';
        if(options.colors)
            output = chalk.blue(output);
        return output;
    }
    

    if(typeof value.toString === 'function') {
        output = value.toString();
        if(options.colors) {
            switch(typeof value) {
                case "number":
                    output = chalk.yellow(output);
                default:
                    output = chalk.white(output);
            }
        }
    }

    return output;
}