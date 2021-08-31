
import { useEffect, useState } from "react";
import { Observable, Subject } from "rxjs";
import { repl as nodeREPL } from "../shims/repl";

import Xterm, { XtermProps } from "./Xterm";


export type XtermREPLProps = {
    input?: Subject<string>
    output?: Subject<string>
} & Omit<XtermProps, 'size'>;


export function XtermREPL({input, output, onData} : XtermREPLProps) {

    const [stdin] = useState(input || new Subject<string>());
    const [stdout] = useState(output || new Subject<string>());

    useEffect(() => {
        const repl = nodeREPL.start({
            useGlobal: true
        });

        repl.on('line', (input) => {
            stdin.next(input);
        })

        stdin.subscribe((input) => {
            repl.eval('3', {}, '', () => {

            });
        });

        return () => {
            repl.close();
        }
    });

    return <Xterm input={stdin} output={stdout} onData={onData}/>;
}