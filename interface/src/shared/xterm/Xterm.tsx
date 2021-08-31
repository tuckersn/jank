import React, { LegacyRef, useState } from "react";
import { CSSProperties, useEffect, useRef } from "react";

import sizeMe from 'react-sizeme'

import { ITerminalOptions, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { SearchAddon } from "xterm-addon-search";
import { WebLinksAddon } from "xterm-addon-web-links";
import  "xterm/lib/xterm.js"; 
import "xterm/css/xterm.css";
import "./Xterm.scss";

import { openLinkInBrowser } from "../../common/util";
import { Observable, Subject } from "rxjs";

export type XtermOptions = {
    font: string;
}

export type XtermProps = {
    options?: XtermOptions,
    input?: Subject<string>,
    output?: Observable<string>,
    onData?: (event: {terminal: Terminal, data: string}) => void | Promise<void>,
    onStart?: (event: {terminal: Terminal, fitAddon: FitAddon, searchAddon: SearchAddon, webLinksAddon: WebLinksAddon}) => void | Promise<void>
    /** If implemented will not automatically call fit()! */
    onResize?: (event: {terminal: Terminal, fitAddon: FitAddon}) => void | Promise<void>;
    size: {
        width: number,
        height: number
    }
}

export const defaultXtermOptions = {
    font: "'IBM Plex Mono', monospace"
}

function Xterm({ onData, onResize, onStart, options: inputOptions, size, input, output }: XtermProps) {
    const options = Object.assign({}, defaultXtermOptions, inputOptions);
    
    const [terminal] = useState(new Terminal({
        fontFamily: options.font
    }));

    const [fitAddon] = useState(new FitAddon());
    const [searchAddon] = useState(new SearchAddon());
    const [webLinksAddon] = useState(new WebLinksAddon((event, uri) => {
        openLinkInBrowser(uri);
        event.preventDefault();
    }));

    const terminalRef = useRef<HTMLElement>(null);

    console.log("HEIGHT:", size.height);
    console.log("WIDTH:", size.width);


    useEffect(() => {

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(searchAddon);
        terminal.loadAddon(webLinksAddon);
        terminal.open(terminalRef.current!);

        if(onStart) {
            onStart({
                terminal,
                fitAddon,
                searchAddon,
                webLinksAddon
            });
        }

        terminal.onData((data) => {
            if(onData) {
                onData({
                    terminal, 
                    data
                });
            }
            if(input) {
                input.next(data);
            }
        });
        
        if(output) {
            output.subscribe((data) => {
                terminal.write(data);
            });
        }
    }, [terminalRef]);


    useEffect(() => {
        if(onResize) {
            onResize({terminal, fitAddon});
        } else {
            fitAddon.fit();
        }
    }, [size.height, size.width]);

    return (<div style={{height: "100%", width: "100%"}}>
        
        <div ref={terminalRef as LegacyRef<HTMLDivElement>}>
        </div>
    </div>);
}


export default sizeMe({ monitorHeight: true, monitorWidth: true })(Xterm);