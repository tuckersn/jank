import { minimumProgramArguments, ProgramRegistry } from "@janktools/ui-framework/dist/Programs";
import { init } from "example-extension/dist/extension";
import { ProgramListPane } from "./debugging/ProgramListProgram";
import { REPLTab } from "./debugging/REPLTab";
import { ErrorPane } from "./ErrorPane";
import { FileBrowserProgram } from "./files/FileBrowserProgram";
import { ImagePane } from "./files/ImageProgram";
import { TextEditorProgram } from "./files/TextEditorProgram";
import { TerminalTab } from "./TerminalTab";
import { TextDisplayPane } from "./TextDisplayProgram";
import { WebBrowserProgram } from "./web/WebBrowserProgram";


export function initPrograms() {

	const _DEFAULT_PROGRAMS: {[uniqueName: string]: Readonly<ReturnType<typeof minimumProgramArguments>> } = {
		'jank-text': minimumProgramArguments('jank-text', TextDisplayPane),
		'jank-tab-list': minimumProgramArguments('jank-tab-list', ProgramListPane),
		'jank-image': minimumProgramArguments('jank-image', ImagePane),
		'jank-terminal': minimumProgramArguments('jank-terminal', TerminalTab),
		'jank-repl': minimumProgramArguments('jank-repl', REPLTab),
		'jank-text-editor': TextEditorProgram,
		'jank-file-browser': FileBrowserProgram,
		'jank-web-browser': WebBrowserProgram,
		'error': minimumProgramArguments('error', ErrorPane)
	}
	for(let program of Object.values(_DEFAULT_PROGRAMS)) {
		ProgramRegistry.create(program);
	}

}