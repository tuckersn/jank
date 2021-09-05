import React, { useState, useEffect, useRef, ReactElement } from 'react'

import { Console as ConsoleComponent, Hook, Unhook } from 'console-feed'
import { HookedConsole } from 'console-feed/lib/definitions/Console'
import { Message as ComponentMessage } from 'console-feed/lib/definitions/Component'

import { PassThrough } from 'stream';
import { Subject } from 'rxjs';

import { Node, Electron } from "../../../common/shims";
import { nanoid } from 'nanoid';
import { Methods } from 'console-feed/lib/definitions/Methods';
import { relative } from 'path';
import { MonacoEditor } from '../../../shared/monaco/MonacoEditor';
import * as monaco from "monaco-editor";
import {KeyCode,KeyMod} from "monaco-editor";

// const MonacoEnvironment = {
// 	getWorkerUrl: function (_moduleId: any, label: string) {
// 		if (label === 'json') {
// 			return './json.worker.bundle.js';
// 		}
// 		if (label === 'css' || label === 'scss' || label === 'less') {
// 			return './css.worker.bundle.js';
// 		}
// 		if (label === 'html' || label === 'handlebars' || label === 'razor') {
// 			return './html.worker.bundle.js';
// 		}
// 		if (label === 'typescript' || label === 'javascript') {
// 			return './ts.worker.bundle.js';
// 		}
// 		return './editor.worker.bundle.js';
// 	}
// };

// REPL input written here.
const input = new Subject<string>();

// REPL output written here.
const output = new Subject<{
    type: Methods,
    value: any
}>();



export function REPLTab() {

    //https://codepen.io/mgmarlow/pen/bNmJKK
    const [resizeBarLastY,setResizeBarLastY] = useState<number>();
    const [editorHeight,setEditorHeight] = useState<number>(200);
    const [logs, setLogs] = useState<ComponentMessage[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const consoleContainerRef = useRef<HTMLDivElement>(null);
    const resizeBar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        Hook(
            window.console,
            (log) => setLogs((currLogs: any) => { 
                try {
                    if(typeof logs !== "object")
                        console.log("LOGS?", logs);
                    return [...currLogs, log]
                } catch(e) {
                    console.error("Absolutely terrible:", e);
                    throw e;
                }
            }),
            false
        );

        return () => {
            Unhook(window.console as HookedConsole)
        }
    }, []);


    useEffect(() => {
        if(consoleContainerRef !== null) {
            const element = consoleContainerRef.current!;
            //console.log(element.scrollHeight)
            element.scrollTo({
                top: element.scrollHeight
            });
        }
    }, [logs.length]);



    function moveResizeBar(event: MouseEvent) {
        //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        if(event.buttons !== 1) {
            window.removeEventListener('mousemove', moveResizeBar);
          } else {
            var dist = resizeBarLastY! - event.pageY;
            setEditorHeight(dist);
            setResizeBarLastY(event.pageY);
            console.log("DISTANCE:", dist);
          }
    }

    return (<div style={{
        position: "relative", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        overflow: 'hidden'
    }} ref={containerRef}>
        <div style={{ overflowY: "scroll", height: "100%" }} ref={consoleContainerRef} onScroll={() => {
      
        }}>
            <ConsoleComponent logs={logs} variant="dark" />
        </div>
        <div style={{height:editorHeight}}>
            <div style={{
                background: "yellow",
                height: "5px",
                width: "100%"
            }} onMouseDown={(event) => {
                if(resizeBar) {
                    event.preventDefault();
                    console.log("PAGE Y:", event.pageY);
                    setResizeBarLastY(event.pageY);
                    window.addEventListener('mousemove', moveResizeBar)
                }
            }}>
            </div>
            <MonacoEditor language="javascript" value="console.log('Hello World:', Math.random())" onStart={({editor, model}) => {
                editor.addCommand(KeyMod.Shift | KeyCode.Enter, () => {
                    let func = async () => {
                        try {
                            const value = await eval(editor.getValue());
                            if(value !== undefined) {
                                console.log(value);
                            }
                        } catch(e) {
                            window.console.error(e);
                        }
                        //console.log("MODELS:", monaco.editor.getModels());
                    };
                    func();
                });
            }}/>
        </div>
    </div>);
}