import { Extension } from "@janktools/ui-framework/dist";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";
import { ExampleProgram } from "./programs/ExampleProgram";

export async function init ({
    Programs
} : Extension.IExtensionArgs) {
	console.log("Hello World! The example plugin has been loaded!");
	ProgramRegistry.create(ExampleProgram);
}

export function test() {
    console.log("test");
}