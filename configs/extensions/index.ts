import { IExtensionArgs, IExtensionModule } from "@janktools/ui-framework/dist/Extension";

const extensions: Promise<IExtensionModule>[] = [
//<EXTENSIONS>
//@ts-ignore
import("example-extension/dist/extension.js"),
//@ts-ignore
import("@jank-extensions/menu/dist/extension.js"),
//@ts-ignore
import("@jank-extensions/socket-client/dist/extension.js"),
//</EXTENSIONS>
]
export async function load(input: IExtensionArgs) {
    console.log("Configs loaded here!!!!!");
	for(let extension of extensions) {
		await(await extension).init(input);
	}
}