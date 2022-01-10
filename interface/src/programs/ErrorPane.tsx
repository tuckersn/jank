import React from "react";
import { PaneProps } from "./Panes";

export const ErrorPane: React.FC<PaneProps<{
    error?: Error,
    message?: string
}>> = ({
    instance: {state}
}) => {

    const errorElement = () => {
        if(state.error) {
            return <div>
                {(state.error.stack || state.error).toString()}
            </div>;
        } else if(state.message) {
            return <div>
                {state.message}
            </div>;
        } else {
            return <div>
                Non-specific error page.
            </div>;
        }
    }

    return <div style={{
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold'
    }}>
        {errorElement()}
    </div>
}