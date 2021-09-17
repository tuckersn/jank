import React, { useEffect, useState } from "react";
import { inspect} from "jank-shared/dist/util";
import * as chalk from "chalk";
import { XtermConsole } from "../../shared/xterm/XtermConsole";
import { TabProps } from "./TabManager";
import ansiEscapes from 'ansi-escapes';
import { ElectronShim } from "../../common/shims/electron";
import { Subject } from "rxjs";
import Xterm from "../../shared/xterm/Xterm";
import { start } from "repl";

import { ProcessManagerWS } from "jank-shared/dist/communication/process-manager-ws";
import { Terminal } from "xterm";

const termChalk = new chalk.Instance({
    level: 2
});

export const TerminalTab: React.FC<TabProps> = ({instance}) => {
    
    const [loaded, setLoaded] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading...");

    const [output] = useState(new Subject<string>());
    const [input] = useState(new Subject<string>());
    const [resize] = useState(new Subject<{terminal: Terminal}>());

    useEffect(() => {
        setLoadingText("Starting bash...");
        //TODO: needs a lot of work, this is just testing purposes.
        //C:\\Windows\\System32\\cmd.exe
        //"C:\\Program Files\\Git\\bin\\bash.exe"
        ElectronShim.spawnProcess('C:\\Program Files\\Git\\bin\\bash.exe').then((id) => {
            setLoadingText('Starting WebSocket connection...');
            const socket = new WebSocket('ws://localhost:' + 35000);

            socket.addEventListener('open', (event) => {
                setLoaded(true);
                if(id) {
                    socket.send(`${id}:123456789`);
                } else {
                    throw "Somehow didn't get id when starting websocket.";
                }

                socket.addEventListener('message', async (event) => {

                    const msg = typeof event.data === 'string' ? event.data : (await event.data instanceof Blob ? event.data.text() : event.data.toString());
                    console.log("GOT MESSAGE:", event, event.data, msg);

                    const {starting, data} = ProcessManagerWS.split(msg);

                    switch(starting) {
                        case "err":
                            console.error(data);
                            break;
                        case "out":
                            output.next(data);
                            break;
                        default:
                            console.warn("Unknown operation:", starting);
                    }                    
                });
    
                socket.addEventListener('error', (e) => {
                    console.error("SOCKET ERROR:");
                });
    
    
                socket.addEventListener('close', (e) => {
                    console.error("SOCKET CLOSED:");
                    setLoaded(false);
                    setLoadingText("WebSocket Closed!");
                    socket.send('kill:');
                });
    
                input.subscribe((input) => {
                    socket.send('in:' + input);
                });

                resize.subscribe(({terminal}) => {
                    console.log("RESIZE:", {
                        cols: terminal.cols,
                        rows: terminal.rows
                    });
                    socket.send('resize:' + JSON.stringify({
                        cols: terminal.cols,
                        rows: terminal.rows
                    }));
                });
            });
        });    
    }, []);


    return loaded ? (<div style={{height: "100%", width: "100%"}}>
        <Xterm input={input} output={output} onResize={({fitAddon, terminal}) => {
            fitAddon.fit();
            resize.next({terminal});
        }} onKey={({terminal, char}) => {
            input.next(char);
        }}></Xterm>
    </div>) : (<h1>{loadingText}</h1>);

    
}
