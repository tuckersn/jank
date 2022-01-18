import React from "react";
import { PaneProps } from "@janktools/ui-framework/dist/Panes";



export const TextDisplayPane: React.FC<PaneProps> = ({
    instance: {state}
}) => {

    if('text' in state) {
        return (<div style={{height: "100%", width: "100%"}}>
            {state.text}
        </div>);
    } else {
        throw new Error("Invalid args! " + JSON.stringify(state, null, 4));
    }

    
}
