import React, { useEffect, useState } from "react";

import { Slider } from "../../../common/components/Slider";
import { fileStringFromPath } from "../../../common/util";
import { MonacoEditor } from "../../../shared/monaco/MonacoEditor";

import { editor } from "monaco-editor";
import { ToolBar, toolBarButton } from "../shared/Toolbar/Toolbar";
import { MdAccessAlarm, MdAccountBox, MdMap, MdMenu, MdSave, MdSettings } from "react-icons/md";
import Config from "../../../common/config";
import { toolBarDropdownFactory } from "../shared/Toolbar/ToolbarDropdown";
import { PaneProps } from "../Panes";

export const TextEditorTab: React.FC<PaneProps<{
    value: string,
    url: string
}>> = ({instance}) => {

    const [content, setContent] = useState(instance.state?.value || '');
    const [title, setTitle] = useState(instance.title);
    const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();
    const [minimap, setMinimap] = useState<boolean>(false);

    useEffect(() => {
        if(instance.state) {
            if('file' in instance.state) {
                setTitle(fileStringFromPath(instance.state.url));
            } else if ('data' in instance.state) {
                setTitle("");
            } else if ('url' in instance.state) {
                setTitle(fileStringFromPath(instance.state.url));
            } else {
                setTitle('New File');
            }
        } else {
            setTitle('New File');
        }
    }, []);

    useEffect(() => {
        instance.title = `${title}`;
    }, [title])

    return (<ToolBar items={[
        // Main Menu
        toolBarDropdownFactory({
            Icon: MdMenu,
            component: () => {
                return (<div>
                    <div>New file...</div>
                    <div>Open file...</div>
                    <div>Save</div>
                    <div style={{borderBottom: "2px solid " + Config.style.accentColor}}>Save as...</div>
                    <div>
                        Syntax Highlight:
                        <select>
                            <option>
                                Plain Text
                            </option>
                            <option>
                                JS/JSON
                            </option>
                            <option>
                                TypeScript
                            </option>
                            <option>
                                HTML
                            </option>
                            <option>
                                CSS
                            </option>
                            <option>
                                SCSS
                            </option>
                        </select>
                    </div>
                    <div>
                        Word wrapping:
                        <input type="checkbox"/>
                    </div>
                </div>);
            }
        }),
        toolBarButton({
            Icon: MdSave,
            cb: (e) => {
                console.log("E:", e);
            }
        }),
        toolBarButton({
            Icon: MdMap,
            override: {
                alignment: 'right'
            },
            cb: (e) => {
                console.log("MINIMAP");
                setMinimap(!minimap);
            }
        }),
        toolBarDropdownFactory({
            Icon: MdSettings,
            override: {
                alignment: 'right'
            },
            component: () => {
                return (<div>
                    <div>New file...</div>
                    <div>Open file...</div>
                    <div>Save</div>
                    <div>Save as...</div>
                </div>);
            }
        }),
    ]}>
        <div style={{height:"100%", width:"100%", overflow: "hidden"}}>
            {/* <div style={{borderBottom: "1px solid white"}}>
                <button>Save</button>
                <button>Open</button>
                <button>Language</button>

                <Slider min={8} max={32} onValue={(value) => {
                    console.log("VALUE:", value);
                    return value;
                }}/>
            </div> */}

            <MonacoEditor minimap={{
                enabled: minimap
            }} style={{height:"100%", width:"100%"}} onStart={({editor, model}) => {
                editor.setValue(instance.state?.value || 'hello world');
            }}/>
        </div>
    </ToolBar>);
}