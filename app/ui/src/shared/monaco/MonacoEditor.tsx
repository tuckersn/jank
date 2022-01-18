import * as monaco from "monaco-editor";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { RGBColor } from "../../common/modules/colors";
import { Theme } from "../../Theme";



export module Monaco {
    monaco.editor.defineTheme('jank', {
        base: 'vs-dark',
        inherit: true,
        rules: [
        ],
        colors: {
            "editor.background": RGBColor.toHex(Theme.current.value.baseColorDark)
        }
    })
}





export type MonacoEditorProps = {
    // REQUIRED
    onStart: (args: {editor: monaco.editor.IStandaloneCodeEditor, model: monaco.editor.ITextModel}) => void | Promise<void>,

    // DEFAULTS
    style?: CSSProperties;
    value?: string;
    wordWrap?: "on" | "off";
    minimap?: {enabled: boolean};
    renderWhitespace?: "all" | "none" | "boundary" | "selection" | "trailing";
    
    // NO DEFAULTS
    language?: string,
    uri?: monaco.Uri
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
    onStart,
    style = {},
    value = 'Hello world!',
    language,
    uri,
    wordWrap = "on",
    minimap = {
        enabled: false
    },
    renderWhitespace = "boundary"
}) => {

    const [model, setModel] = useState<monaco.editor.ITextModel>();
	const divEl = useRef<HTMLDivElement>(null);
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();



	useEffect(() => {
        const model = monaco.editor.createModel(value, language, uri);
        setModel(model);
        setEditor(monaco.editor.create(divEl.current!, {
            value: [value].join('\n'),
            language: 'typescript',
            model,
            theme: 'jank',
            automaticLayout: true,
            wordWrap,
            minimap,
            renderWhitespace
        }));
	}, []);

    useEffect(() => {
        if(model && editor) {
            model.onDidChangeContent((event) => {
                value = editor!.getValue();
            });

            onStart({editor: editor!, model: model});

            return () => {
                editor!.dispose();
            };
        }
    }, [model, editor]);

    useEffect(() => {
        if(minimap) {
            if(editor) {
                editor.updateOptions(Object.assign({}, editor.getRawOptions(), {
                    minimap
                }));
            }
        }
    }, [minimap]);
    




	return (<div style={Object.assign({
        height:"100%"
    }, style)} className="Editor" ref={divEl}>

    </div>);
};