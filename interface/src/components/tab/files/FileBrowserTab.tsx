import React from "react";
import { TabProps } from "../TabManager";

export interface File {
    type: string,
    path: string,
    name: string,
    modificationDate: Date
}

export const FileBrowserTab: React.FC<TabProps> = ({}) => {

    return(<div style={{height:"100%", width:"100%"}}>
        
    </div>)
}