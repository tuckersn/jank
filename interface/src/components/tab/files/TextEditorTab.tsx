import { useEffect, useState } from "react";
import { Slider } from "../../../common/components/Slider";
import { fileStringFromPath } from "../../../common/util";
import { MonacoEditor } from "../../../shared/monaco/MonacoEditor";
import { TabProps } from "../TabManager";
import { editor } from "monaco-editor";

export function TextEditorTab({instance} : TabProps) {

    const [content, setContent] = useState(instance.args?.value || '');
    const [title, setTitle] = useState(instance.title);
    const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();


    useEffect(() => {
        if(instance.args) {
            if('file' in instance.args) {
                setTitle(fileStringFromPath(instance.args.url));
            } else if ('data' in instance.args) {
                setTitle("");
            } else if ('url' in instance.args) {
                setTitle(fileStringFromPath(instance.args.url));
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

    return (<div style={{height:"100%", width:"100%", overflow: "hidden"}}>
        <div style={{borderBottom: "1px solid white"}}>
            <button>Save</button>
            <button>Open</button>
            <button>Language</button>

            <Slider min={8} max={32} onValue={(value) => {
                console.log("VALUE:", value);
                return value;
            }}/>
        </div>

        <MonacoEditor style={{height:"100%", width:"100%"}} onStart={({editor, model}) => {
            editor.setValue(instance.args?.value || 'hello world');
        }}/>
    </div>)
}