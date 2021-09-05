import ansiEscapes from "ansi-escapes";

function string(hex: string): string {
    return Buffer.from(hex, 'hex').toString('utf-8');
}

const Keycode = {

    CURSOR_BACKWARD: ansiEscapes.cursorBackward(),

    BACKSPACE: '\u007F',
    ENTER: '\r',

    CTRL_C: '\u0003',

    NUMPAD_MINUS: '\u002d',
}

export default Keycode;