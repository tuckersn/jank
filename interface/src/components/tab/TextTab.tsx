import React from "react";
import { TabProps } from "./TabManager";



export const TextTab: React.FC<TabProps> = ({instance}) => {

    if('text' in instance.args) {
        return (<div style={{height: "100%", width: "100%"}}>
            {instance.args.text}
        </div>);
    } else {
        throw "Invalid args! " + instance.args;
    }

    
}
