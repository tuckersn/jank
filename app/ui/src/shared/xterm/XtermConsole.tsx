import { Terminal } from "xterm";
import  "xterm/lib/xterm.js"; 
import "xterm/css/xterm.css";
import Xterm, { XtermProps } from "./Xterm";
import { useState } from "react";
import { Subject } from "rxjs";


export type XtermConsoleProps = {
    prompt?: string,
    onInput: (input: {
        terminal: Terminal,
        line: string,
        promptState: {
            prompt: string,
            setPrompt: (v: string) => void
        }
    }) => boolean | Promise<boolean>
} & Partial<XtermProps>;

export function XtermConsole({ prompt: defaultPrompt, onInput, onKey, onResize, onStart }: XtermConsoleProps) {
    const [prompt, setPrompt] = useState(defaultPrompt || '> ');
    const [stdin] = useState(new Subject<string>());
    const [stdout] = useState(new Subject<string>());
    return (
        <Xterm input={stdin} output={stdout} onStart={({terminal}) => {
                terminal.writeln("Hello World!");
            }}
            onKey={onKey || (async ({terminal, char}) => {
                switch (char) {
                    case '\r': // Enter
                    case '\u0003': // Ctrl+C
                        if(await onInput({
                            terminal, 
                            line: terminal.buffer.normal.getLine(terminal.buffer.normal.cursorY)!.translateToString(),
                            promptState: {
                                prompt,
                                setPrompt
                            }
                        })) {
                            terminal.write(`\r\n${prompt}`);
                        }
                        break;
                    case '\u007F': // Backspace (DEL)
                    // Do not delete the prompt
                    if (terminal.buffer.normal.cursorX > 2) {
                        terminal.write('\b \b');
                    }
                    break;
                    default: // Print all other characters for demo
                    terminal.write(char);
                }
        })}></Xterm>
    );
}