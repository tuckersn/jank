import React, { useEffect, useState } from "react";
import * as chalk from "chalk";
import { XtermConsole } from "../../../shared/xterm/XtermConsole";
import { TabProps } from "../TabManager";
import ansiEscapes from 'ansi-escapes';
import { XtermREPL } from "../../../shared/xterm/XtermREPL";
import { Subject } from "rxjs";


const termChalk = new chalk.Instance({
    level: 2
});

export const REPLTab: React.FC<TabProps> = ({instance}) => {

    const [stdout] = useState(new Subject<string>());
    const [stdin] = useState(new Subject<string>());

    useEffect(() => {
        let log = stdout.subscribe((output) => {
            console.log("REPL:", output);
        });
        return () => {
            log.unsubscribe();
        }
    });

    return (<div style={{height: "100%", width: "100%"}}>
        <XtermREPL output={stdout} input={stdin} onData={({data}) => {
            stdin.next(data);
        }}/>
    </div>);

}
