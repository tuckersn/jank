import { IExtensionArgs, IExtensionModule } from "@janktools/ui-framework/dist/Extension";

const extensions: Promise<IExtensionModule>[] = [
//{<EXTENSIONS>}
import("example-extension/dist/extension.js") //example-extension
//{</EXTENSIONS>}
]
export function load(input: IExtensionArgs) {
    console.log("Configs loaded here!!!!!");
	for(let extension of extensions) {
		extension.then((e) => {
			e.init(input);
		});
	}
}