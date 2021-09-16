import React, { CSSProperties } from "react";
import { fileStringFromURL } from "../../../common/util";
import { TabProps } from "../TabManager";

const imgStyle: CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    flexShrink: 0,

}

export const ImageTab: React.FC<TabProps> = ({instance}) => {
    //TODO: don't do this or sanitize, and defintely do it in an iframe.
    function imgTag() {
        if('url' in instance.args) {
            instance.title = fileStringFromURL(instance.args.url);
            return (<img style={imgStyle} src={instance.args.url}/>);
        } else {
            throw "No image source provided!";
        } 
    }

    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto'
    }}>
        {imgTag()}
    </div>
}

