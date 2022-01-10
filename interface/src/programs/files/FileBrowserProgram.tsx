import { constants } from "os";
import React, { FC, ClassAttributes, HTMLAttributes, useEffect, useState, useMemo } from "react";
import { async, BehaviorSubject } from "rxjs";
import { useBehaviorSubject } from "../../common/hooks";
import { DirectoryFile, File, ImageFile } from "../../common/interfaces/files";
import { FS } from "../../common/shims/file-system";
import { fs, path } from "../../common/shims/node";

import { PaneProps } from "../Panes";
import { MinimalProgram, Program, ProgramRegistry } from "../Programs";

import folderIcon from "material-design-icons/file/2x_web/ic_folder_white_48dp.png";
import { EDangerous } from "../../common/modules/html/elements";

import { useTable, Column, usePagination, TableInstance, useResizeColumns, UseResizeColumnsColumnProps, useBlockLayout } from "react-table";
import { TableInstanceAll, TableInstanceWithPagination } from "../../shared/react-table/table-instance";
import { nanoid } from "nanoid";
import { Image } from "../../common/components/Image";


import FileBrowserStyle from "./FileBrowser.module.scss";
import { InstanceRegistry } from "../Instances";


declare module "react-table" {
    export interface HeaderGroup<D extends object = {}> extends ColumnInstance<D>, UseTableHeaderGroupProps<D>, UseResizeColumnsColumnProps<D> {
    }
    
    export interface TableInstance<D extends object = {}>
      extends Omit<TableOptions<D>, 'columns' | 'pageCount'>,
        UseTableInstanceProps<D>,
        UseResizeColumnsColumnProps<D>,
        UsePaginationInstanceProps<D> {
    }
}

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

    const [headers,setHeaders] = useState<Column<File>[]>([
        {
            id: nanoid(),
            accessor: (file) => {
                let Icon: React.FC<{}> = () => {
                    return <section></section>;
                };

                switch(file.fileType) {
                    case 'image':
                        const imgFile: ImageFile<any> = file as any;
                        Icon = () => {
                            const [image,setImage] = useState<string>('');
                            useEffect(() => {
                                let img = imgFile.get();
                                if(img instanceof Promise) {
                                    img.then((value) => {
                                        setImage(value);
                                    });
                                } else if(typeof img === 'string') {
                                    setImage(img);
                                } else {
                                    throw new Error("Invalid img file.");
                                }
                            }, []);
                            return <Image height={32} src={`data:image/png;base64,${image}`}/>;
                        };
                        break;
                }

                switch(file.fileExtension) {
                    case '.png':
                        Icon = () => {
                            return <section></section>;
                        }
                        break;
                }

                return <Icon></Icon>;
            }
        },
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Type',
            accessor: (file) => {
                return file.fileType === 'unknown' ? '' : file.fileType;
            }
        },
        {
            Header: 'Created',
            accessor: (file) => {
                return file.created?.valueOf() === 0 ? '' : file.created?.toLocaleDateString();
            }
        },
        {
            Header: 'Last Modified',
            accessor: (file) => {
                return file.lastModified?.valueOf() === 0 ? '' : file.lastModified?.toLocaleDateString();
            }
        },
        {
            Header: 'Size',
            accessor: (file) => {
                return (file.size||0) > 1 ? file.size : '';
            }
        }
    ]);

    const [currentFile, setCurrentFile] = useState<File>();
    const [files,setFiles] = useState<File[]>([]);
    const defaultColumn = React.useMemo(() => ({
        minWidth: 30,
        width: 150,
        maxWidth: 400,
    }),[])

    const {
        columns,
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        page,
        prepareRow,
    } = useTable({
        columns: headers,
        data: files,
        initialState: {
        },
        defaultColumn
    }, usePagination, useBlockLayout, useResizeColumns)


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
                    const files = await dir.get();
                    console.log("FILES:", files);
                    setFiles(files);
                }
            });
        })

    }, [])

    return(<div style={{height:"100%", width:"100%"}}>
       
        





        <div style={{
            borderBottom: '2px solid white',
            display: 'flex',
            flexDirection: 'row'
        }}>
            <button onClick={() => {
                console.log("TEST");
                state.cwd.next('D:\\projects\\Engine\\interface\\public')
            }}>
                CHANGE TO PROJECT DIR.
            </button>
            <button onClick={() => {
                console.log("TEST");
                state.cwd.next('C:/')
            }}>
                C:/
            </button>
            <button className={'j-error'}>
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
        </div>


        <div className={FileBrowserStyle.content}>
            <div className={FileBrowserStyle.side_panel}>
                Side panel here.
            </div>

            <div {...getTableProps()} className={FileBrowserStyle.files_table}>
                <div>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()} className={FileBrowserStyle.row}>
                            {headerGroup.headers.map(column => (
                                <div {...column.getHeaderProps()} className={FileBrowserStyle.header}>
                                    {column.render('Header')}
                                    <div {...column.getResizerProps()}
                                        className={`${FileBrowserStyle.resizer} ${
                                            column.isResizing ? FileBrowserStyle.isResizing : ''
                                        }`}>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <div {...row.getRowProps()} onClick={() => {
                                console.log(row);
                                state.cwd.next(row.original.location);
                            }} className={FileBrowserStyle.row}>
                                {row.cells.map(cell => {
                                    return <div {...cell.getCellProps()} className={FileBrowserStyle.data}>
                                        {cell.render('Cell')}
                                    </div>;
                                })}
                            </div>
                        );
                    })}
                </div>
            </div> 
        </div>


       


<div className={FileBrowserStyle.aClass}>TESTING</div>
<div className={'aClass'}>TESTING</div>
    </div>)
}


export const FileBrowserProgram: MinimalProgram<FileBrowserInstanceState> = {
    uniqueName: 'jank-web-browser',
    component: FileBrowserPane,
    instanceInit: (instance) => {
        console.log("WEB BROWSER INSTANCE:", instance);
        return {
            actions: {},
            serialize: () => {
                return {
                };
            },
            state: {
                cwd: new BehaviorSubject<string>('C:\\')
            },
            destroy: () => {

            },
            ...instance
        };
    },
    state: {},
    deserialize: (serialized) => {
        return InstanceRegistry.create<FileBrowserInstanceState>('jank-file-browser', {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
};