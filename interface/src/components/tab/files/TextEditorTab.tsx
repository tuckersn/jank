import { useEffect, useState } from "react";
import { fileStringFromPath } from "../../../common/util";
import { MonacoEditor } from "../../../shared/monaco/MonacoEditor";
import { TabProps } from "../TabManager";

export function TextEditorTab({instance} : TabProps) {

    const [content, setContent] = useState(instance.args?.value || '');
    const [title, setTitle] = useState(instance.title);


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
        </div>

        <MonacoEditor style={{height:"100%", width:"100%"}} onStart={({editor, model}) => {
            editor.setValue(instance.args?.value || 'hello world');
        }}/>
    </div>)
}