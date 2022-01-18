import { Extension } from "@janktools/ui-framework/dist";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";
import { SocketClientProgram } from "./programs/SocketClientProgram";

export async function init ({
    Programs
} : Extension.IExtensionArgs) {
	ProgramRegistry.create(SocketClientProgram);
}