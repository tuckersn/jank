import React from "react";
import { inspect} from "jank-shared/dist/util";
import * as chalk from "chalk";
import { XtermConsole } from "../../../shared/xterm/XtermConsole";
import { TabProps } from "../TabManager";
import ansiEscapes from 'ansi-escapes';

const termChalk = new chalk.Instance({
    level: 2
});

export const TerminalTab: React.FC<TabProps> = ({instance}) => {

    return (<div style={{height: "100%", width: "100%"}}>
        <XtermConsole onInput={async ({terminal, line, promptState}) => {
            let evalValue;
            try {
                evalValue = eval(line.substr(promptState.prompt.length));
                console.log("EVAL:", evalValue);
                let output = await inspect(evalValue);
                console.log("VALUE:", output);
                terminal.write(`\r\n${output}`);
            } catch(e) {
                console.error("ERROR:", e);
                terminal.write(ansiEscapes.cursorMove(-line.length, 1));
                terminal.write(termChalk.red(e.toString()).trim());
            } finally {
                evalValue = undefined;
            }
            return true;
        }}></XtermConsole>
    </div>);

    
}
