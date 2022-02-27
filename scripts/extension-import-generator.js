const fs = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');


const EXTENSION_CONFIG_FILE = "../configs/extensions/index.ts";
const EXTENSIONS_FOLDER = "../extensions";


console.log("Generating extension import config.");

function extensionEntry(filePath, importStrings) {


	return importStrings;
}


async function main() {
	const [configFile, extensionDir] = await Promise.all([
		(async () => {
			return (await fs.readFile(EXTENSION_CONFIG_FILE)).toString('utf-8')
		})(),
		fs.readdir(EXTENSIONS_FOLDER)
	]);

	console.log("extension dir contents:", JSON.stringify(extensionDir, null,4));

	const entries = ['extension.js', 'dist/extension.js', 'index.js', 'dist/index.js'];
	let extensions = [];
	for(let filePath of extensionDir) {
		for(let entry of entries) {
			if(existsSync(path.join(EXTENSIONS_FOLDER,filePath, entry))) {
				console.log("EXISTS");
				extensions.push((async () => {
					const package = JSON.parse((await fs.readFile(path.join(EXTENSIONS_FOLDER,filePath, 'package.json'))).toString('utf-8'));
					return {
						filePath,
						entry,
						package
					}
				})());
			} else {
				console.log("Not found:", path.join(EXTENSIONS_FOLDER,filePath, entry));
			}
		}
	}
	extensions = await Promise.all(extensions);

	const configFileLines = configFile.split("\n");
	let startingIndex;
	let endingIndex;
	for(let i = 0; i < configFileLines.length; i++) {
		if(startingIndex) {
			if(configFileLines[i].startsWith("//</EXTENSIONS>")) {
				endingIndex = i;
				break;
			}
		} else {
			if(configFileLines[i].startsWith("//<EXTENSIONS>")) {
				startingIndex = i;
			}
		}
	}

	if(startingIndex && endingIndex) {
		const importLines = extensions.filter((e) => e.package !== undefined).map((extension) => {
			return `//@ts-ignore\nimport("${extension.package.name}/${extension.entry}"),`;
		});

		const outputConfig = [
			...configFileLines.slice(0,startingIndex+1),
			...importLines,
			...configFileLines.slice(endingIndex)
		].join('\n');

		fs.writeFile(EXTENSION_CONFIG_FILE, outputConfig);

	} else {
		console.log("cf", configFileLines)
		throw new Error(`Missing <EXTENSION> or </EXTENSION> comments in extension config. Indexes ${startingIndex} - ${endingIndex}`);
	}
}

main();