import { ConsoleType } from "./node-types";

const console = window.require('console');

export default class Node {
    static Console: ConsoleType = console.Console;
}