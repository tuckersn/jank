import { ICommonExtensionArgs } from "jank-interface/src/extensions/Extension";
import { InstanceRegistry } from "jank-interface/src/programs/Instances";
import { ProgramRegistry } from "jank-interface/src/programs/Programs";
import { nanoid } from "nanoid";
import { ExampleProgram } from "./programs/ExampleProgram";

export async function init ({
    Programs
} : ICommonExtensionArgs) {
        console.log("Hello World! The example plugin has been loaded!");
        ProgramRegistry.create(ExampleProgram);
}