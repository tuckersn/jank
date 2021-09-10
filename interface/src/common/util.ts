import * as path from "path";
import * as url from "url";

import { ElectronShim, electron } from "./shims/electron";


export interface State<TYPE> {
    
}


export function fileStringFromURL(urlString: string): string {
    return path.basename((new URL(urlString)).pathname);
}

export function fileStringFromPath(pathString: string): string {
    return path.basename(pathString);
}


export function openLinkInBrowser(urlString: string): void {
    electron.shell.openExternal(urlString, {

    });
}