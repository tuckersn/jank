import React from "react";
import { fileStringFromURL } from "../../../common/util";
import { TabProps } from "../TabManager";


export const ImageTab: React.FC<TabProps> = ({instance}) => {
    //TODO: don't do this or sanitize, and defintely do it in an iframe.
    if('url' in instance.args) {
        instance.title = fileStringFromURL(instance.args.url);
        return (<img src={instance.args.url}/>);
    } else {
        throw "No image source provided!";
    } 
}

