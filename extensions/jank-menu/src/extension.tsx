
import {path,fs} from "@janktools/ui-framework/dist/shim/node";
const {existsSync, readFileSync, writeFileSync} = fs;

import { Extension, Layout } from "@janktools/ui-framework/dist";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";

import { MenuProgram } from "./programs/MenuProgram";
import { filter } from "rxjs";

export interface MenuEntry {
	title: string;
	programKey: string;
	serializedState: string;
}





export function getOrCreate() {
	if(existsSync(path.join(__dirname, "data/menu_entries.json"))) {

	} else {
		writeFileSync
	}
}


export function add(entry : MenuEntry) {

}

export async function init ({
    Programs,
	Application
} : Extension.IExtensionArgs) {
	console.log("Hello World! The example plugin has been loaded!");
	Layout.TitleBar.left.add(function MenuButton() {
		return (<div>
			Menu
		</div>);
	});


	Application.Window.events.pipe(filter((e) => e.type === 'after-render')).subscribe(({payload}) => {
		console.log("WINDOW IS READY FROM MENU COMPONENT")
	});


	console.log("EXTENSION INIT", Layout);
	


	ProgramRegistry.create(MenuProgram);
}

export function test() {
    console.log("test");
}