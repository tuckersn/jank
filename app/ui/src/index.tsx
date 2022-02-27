import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";


import { DndProvider } from "react-dnd";
import { load as loadConfig } from "@janktools/config/dist/index";
import { HTML5Backend } from "react-dnd-html5-backend";
import { initPrograms } from "./programs/init";

import { Application, Instances, Panes, Programs, Global } from "@janktools/ui-framework/dist";


//@ts-ignore
globalThis.webpackRequire = require;
//@ts-ignore
globalThis.require = window.require;


async function main() {
	await initPrograms();
	await loadConfig({
		Instances: Instances,
		Panes: Panes,
		Programs: Programs,
		Application: Application
	});
	await Global.loadIntoGlobal();

	ReactDOM.render(
		<React.StrictMode>
			<DndProvider backend={HTML5Backend}>
				<App />
			</DndProvider>
		</React.StrictMode>,
		document.getElementById("root")
	);

	// If you want to start measuring performance in your app, pass a function
	// to log results (for example: reportWebVitals(console.log))
	// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
	reportWebVitals();
}
main();