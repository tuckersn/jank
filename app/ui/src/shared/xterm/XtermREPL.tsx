/* eslint-disable no-fallthrough */

import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import Xterm, { XtermProps } from "./Xterm";
import { Terminal } from "xterm";

export type XtermREPLProps = {
    prompt?: string,
    input: Subject<string>
    output: Subject<string>
} & Omit<XtermProps, 'size'>;



export function XtermREPL({input, output, onKey, prompt} : XtermREPLProps) {

    prompt = prompt || "> ";
    const [term, setTerm] = useState<Terminal>();

    return <Xterm onKey={({char}) => {
        
    }} output={input} input={output} onStart={({terminal}) => {
        setTerm(terminal);
    }}/>;
}

