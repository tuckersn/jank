/* eslint-disable no-fallthrough */

import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import Xterm, { XtermProps } from "./Xterm";
import { Terminal } from "xterm";

export type XtermREPLProps = {
    prompt?: string,
    input?: Subject<string>
    output?: Subject<string>
} & Omit<XtermProps, 'size'>;

export const DefaultXtermREPLProps: XtermREPLProps = {
    prompt: "> "
}


export function XtermREPL({input, output, onKey, prompt} : XtermREPLProps) {

    prompt = prompt || DefaultXtermREPLProps.prompt;

    const [stdin] = useState(input || new Subject<string>());
    const [stdout] = useState(output || new Subject<string>());
    const [term, setTerm] = useState<Terminal>();

    return <Xterm onKey={({char}) => {
        stdin.next(char);
    }} output={stdout} onStart={({terminal}) => {
        setTerm(terminal);
    }}/>;
}

