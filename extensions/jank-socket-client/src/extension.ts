import { Extension } from "@janktools/ui-framework/dist";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";
import { filter } from "rxjs";
import { SocketClientProgram } from "./programs/SocketClientProgram";

export async function init ({
    Programs,
	Application
} : Extension.IExtensionArgs) {
	ProgramRegistry.create(SocketClientProgram);

}