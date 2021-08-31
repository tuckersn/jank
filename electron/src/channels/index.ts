import { BrowserWindow } from "electron/main";

export * from "./frame";
export * from "./process";

export type OnEventFunction<EVENT extends Object> = (input:{window: BrowserWindow, event: EVENT}) => void | Promise<void>;