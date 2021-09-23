import React from "react";
import { PaneProps } from "../components/programs/Panes";


export class Extension<D extends Object = any, C extends Object = any> {

    /** Store global data for this extension */
    public data: Partial<D>;
    /** Store global settings for this extension */
    public config: Partial<C>;

    constructor(public name: string, public tabFactory: React.FC<PaneProps<any>>) {
        this.data = {};
        this.config = {};
    }

}