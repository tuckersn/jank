import ansiEscapes from "ansi-escapes";
import { Subject } from "rxjs";
import { IBuffer, Terminal } from "xterm";



export type Cursor = {
    x: number,
    y: number
}

export function backspaces(count: number): string {
    return '\b \b'.repeat(count);
}

export function squeeze(cursor:Cursor, {minX, maxX, minY, maxY}: {
    maxX?: number,
    maxY?: number,
    minX?: number,
    minY?: number
}) {
    if(minX)
        cursor.x = cursor.x < minX ? minX : cursor.x;
    if(maxX)
        cursor.x = cursor.x > maxX ? maxX : cursor.x;
    if(minY)
        cursor.y = cursor.y < minY ? minY : cursor.y;
    if(maxY)
        cursor.y = cursor.y > maxY ? maxY : cursor.y;
    return cursor;
}

export default function XUtils(terminal: Terminal, {
    minX,
    maxX,
    minY,
    maxY
}: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
} = {}) {

    const positionUpdates = new Subject<Cursor>();



    const utils = {
        update: () => {
            utils.position();
            return utils;
        },
        positionUpdates,
        position: (): Cursor => {
            terminal.write(ansiEscapes.cursorGetPosition);
            const cursor = {
                x: terminal.buffer.active.cursorX,
                y: terminal.buffer.active.cursorY
            };
            positionUpdates.next(cursor);
            return cursor;
        },
        moveTo(cursor: Cursor) {
            const { x, y } = this.position();
            cursor = squeeze({
                x: cursor.x - x,
                y: cursor.y - y
            }, {
                minX,
                maxX,
                minY,
                maxY
            });
            terminal.write(ansiEscapes.cursorTo(cursor.x, cursor.y));
            return utils;
        },
        saveCursor() {
            terminal.write(ansiEscapes.cursorSavePosition);
        },
        restoreCursor() {
            terminal.write(ansiEscapes.cursorRestorePosition);
        },
        clear() {
            terminal.write(ansiEscapes.clearTerminal);
        },
        clearScreen() {
            terminal.write(ansiEscapes.clearScreen);
        },
        getLine(lineNumber?: number) {
            if(lineNumber === undefined)
                lineNumber = utils.position().y;
            return terminal.buffer.active.getLine(lineNumber)!;
        },
        clearLine(lineNumber: number, replacement: string = "") {
            const line = utils.getLine(lineNumber);
            utils.moveTo({
                x: line.length,
                y: lineNumber
            });
            terminal.write(backspaces(line.length));
            terminal.write(replacement);
        }
    }
    
    return utils;
}