import { ConsoleType, FSType, PathType } from "./node-types";

const console = window.require('console');


export default class Node {
    static Console: ConsoleType = console.Console;
}

export const fs: FSType = window.require('fs');
export const path: PathType = window.require('path');