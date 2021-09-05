import * as monaco from "monaco-editor";
import { CSSProperties, useEffect, useRef, useState } from "react";




export type MonacoEditorProps = {
    // REQUIRED
    onStart: (args: {editor: monaco.editor.IStandaloneCodeEditor, model: monaco.editor.ITextModel}) => void | Promise<void>,

    // DEFAULTS
    style?: CSSProperties,
    value?: string,
    
    // NO DEFAULTS
    language?: string,
    uri?: monaco.Uri
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
    onStart,
    style = {},
    value = 'Hello world!',
    language,
    uri
}) => {

    const [model, setModel] = useState<monaco.editor.ITextModel>();
	const divEl = useRef<HTMLDivElement>(null);
	let editor: monaco.editor.IStandaloneCodeEditor;



	useEffect(() => {

        const model = monaco.editor.createModel(value, language, uri);
        setModel(model);

        editor = monaco.editor.create(divEl.current!, {
            value: [value].join('\n'),
            language: 'typescript',
            model,
            theme: 'vs-dark',
            automaticLayout: true
        });

        model.onDidChangeContent((event) => {
            value = editor.getValue();
        });

        onStart({editor, model: model});

		return () => {
			editor.dispose();
		};
	}, []);

    useEffect(() => {
        //editor
    });
    




	return (<div style={Object.assign({
        height:"100%"
    }, style)} className="Editor" ref={divEl}>

    </div>);
};