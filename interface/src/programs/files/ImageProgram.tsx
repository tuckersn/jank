import React, { CSSProperties } from "react";
import { fileStringFromURL } from "../../common/util";
import { PaneProps } from "../Panes";

const imgStyle: CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    flexShrink: 0,

}

export const ImagePane: React.FC<PaneProps<{
    url: string
}>> = ({
    instance
}) => {
    //TODO: don't do this or sanitize, and defintely do it in an iframe.
    function imgTag() {
        if('url' in instance.state) {
            instance.title = fileStringFromURL(instance.state.url);
            if(instance.iconImg) {
                instance.iconImg.next(instance.state.url);
            }
            return (<img style={imgStyle} src={instance.state.url}/>);
        } else {
            throw "No image source provided!";
        } 
    }

    return <div style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto'
    }}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
        }}>
            {imgTag()}
        </div>
    </div>
}


