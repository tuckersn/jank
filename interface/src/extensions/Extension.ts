import React from "react";
import { TabProps } from "../components/tab/TabManager";

export class Extension<D extends Object = any, C extends Object = any> {

    /** Store global data for this extension */
    public data: Partial<D>;
    /** Store global settings for this extension */
    public config: Partial<C>;

    constructor(public name: string, public tabFactory: React.FC<TabProps>) {
        this.data = {};
        this.config = {};
    }

}