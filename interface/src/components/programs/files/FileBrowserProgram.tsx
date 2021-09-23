import { constants } from "os";
import React, { useEffect, useState } from "react";
import { async, BehaviorSubject } from "rxjs";
import { useBehaviorSubject } from "../../../common/hooks";
import { DirectoryFile, File } from "../../../common/interfaces/files";
import { FS } from "../../../common/shims/file-system";
import { fs, path } from "../../../common/shims/node";

import { PaneProps } from "../Panes";
import { MinimalProgram, Program, ProgramRegistry } from "../Programs";

export interface FileBrowserInstanceState {
    cwd: BehaviorSubject<string>
}


export const FileBrowserPane: React.FC<PaneProps<FileBrowserInstanceState>> = ({
    instance: {state}
}) => {


    const [currentFile, setCurrentFile] = useState<File>();
    const [files,setFiles] = useState<File[]>();


    useEffect(() => {
        state.cwd.subscribe((newCwd) => {
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
        <h5>{state.cwd.value}</h5>
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            {currentFile?.breadcrumbs.map((crumb) => {
                return <div>
                    {crumb}
                </div>;
            })}
        </div>
        <hr/>
        {files?.map((file) => {
            return <div>
                {path.parse(file.location).base} - {file.created?.toLocaleString()}
            </div>
        })}
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
