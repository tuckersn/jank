import { constants } from "os";
import { FC, ClassAttributes, HTMLAttributes, useEffect, useState } from "react";
import { async, BehaviorSubject } from "rxjs";
import { useBehaviorSubject } from "../../../common/hooks";
import { DirectoryFile, File } from "../../../common/interfaces/files";
import { FS } from "../../../common/shims/file-system";
import { fs, path } from "../../../common/shims/node";

import { PaneProps } from "../Panes";
import { MinimalProgram, Program, ProgramRegistry } from "../Programs";

import folderIcon from "material-design-icons/file/2x_web/ic_folder_white_48dp.png";
import { EDangerous } from "../../../common/modules/html/elements";

export interface FileBrowserInstanceState {
    cwd: BehaviorSubject<string>
}



interface DetailedHTMLProps<T> extends HTMLAttributes<any>, ClassAttributes<T> {
    file: string;
}





const maxHistory: number = 5;
export const FileBrowserPane: FC<PaneProps<FileBrowserInstanceState>> = ({
    instance: {state,iconImg}
}) => {


    const [currentFile, setCurrentFile] = useState<File>();
    const [files,setFiles] = useState<File[]>();


    useEffect(() => {
        console.log("FOLDER ICON:", folderIcon)
        iconImg.next(folderIcon);

        let history: string[] = [];
        state.cwd.subscribe((newCwd) => {
            history = [newCwd,...history];
            history = history.slice(0,maxHistory);
            console.log("history", history);
            FS.read(newCwd).then(async (file) => {
                setCurrentFile(file);
                if(file.fileType === 'directory') {
                    const dir: DirectoryFile = file as any;
                    setFiles(await dir.get());
                }
            });
        })

    }, [])

    return(<div style={{height:"100%", width:"100%"}}>
        <button onClick={() => {
            console.log("TEST");
            state.cwd.next('D:\\projects\\Engine')
        }}>
            CHANGE TO PROJECT DIR.
        </button>
        <button onClick={() => {
            console.log("TEST");
            state.cwd.next('C:/')
        }}>
            C:/
        </button>
        
        <div style={{
            display: 'flex',
            flexDirection: 'row'
        }} onClick={(event) => {
            const target = EDangerous(event.target);
            if(target) {
                target.parentAttr('file', (fileAttributes) => {
                    const file = fileAttributes.length > 0 ? fileAttributes[0] : null;
                    if(file && file.value) {
                        state.cwd.next(file.value);
                    }
                });
            }
        }}>
            {currentFile?.breadcrumbs.map((crumb) => {
                //@ts-expect-error
                return <div key={crumb.path} file={crumb.path} className={'jank-link'}>
                    {crumb.crumb}
                </div>;
            })}
        </div>


        <div style={{
            borderBottom: '2px solid white'
        }}>
            Toolbar goes here {state.cwd.value}
        </div>


        <div onClick={(event) => {
            const target = EDangerous(event.target);
            if(target) {
                target.parentAttr('jank-file-path', (attrs) => {
                    const file = attrs.length > 0 ? attrs[0] : null;
                    if(file && file.value) {
                        state.cwd.next(file.value);
                    }
                });
            }
        }}>
            {files?.map((file) => {
                const name = path.parse(file.location).base;
                return <div key={file.location} jank-file-path={file.fileType === 'directory' ? file.location : state.cwd.value} style={{
                    ...(file.fileType === 'directory' ? {
                        fontWeight: 'bold'
                    } : {})
                }}>
                    {file.fileType}{name} - {file.created?.toLocaleString()}
                </div>
            })}
        </div>
    </div>)
}


export const FileBrowserProgram: MinimalProgram<FileBrowserInstanceState> = {
    uniqueName: 'jank-file-browser',
    component: FileBrowserPane,
    instanceInit: (instance) => {

        if(instance.state === undefined) {
            instance.state = {
                cwd: new BehaviorSubject<string>('C:\\')
            };
        }

        return instance as Required<typeof instance>;;
    },
    state: {}
};
