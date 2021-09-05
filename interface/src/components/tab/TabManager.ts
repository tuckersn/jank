import React from "react";
import { nanoid } from "nanoid";

import { Extension } from "../../extensions";
import * as ExtensionManager from "../../extensions/ExtensionManager";

import { TextTab } from "./TextTab";
import { TabListTab } from "./debugging/TabListTab";
import { ImageTab } from "./files/ImageTab";
import { TerminalTab } from "./debugging/TerminalTab";
import { REPLTab } from "./debugging/REPLTab";
import { TextEditorTab } from "./files/TextEditorTab";


export interface TabProps {
    instance: Instance<any>
};



export interface Instance<ARGS extends Object> {
    id: string,
    fullName: string,
    componentString: string,
    args: ARGS,
    componentFunction: React.FC<TabProps>,
    extension?: Extension
    /** Title of the tab. */
    title?: string,
    layout?: {
        tabManager: Manager
    }
}

export type MinimalInputInstance = {fullName: string, args: any} & Partial<Instance<any>>;

export const baseTabs: {[uniqueName: string]: React.FC<TabProps>} = {
    'text': TextTab,
    'tab-list': TabListTab,
    'image': ImageTab,
    'terminal': TerminalTab,
    'repl': REPLTab,
    'text-editor': TextEditorTab
}



export function createInstance<ARGS>(fullName: string, args?: ARGS): Instance<ARGS> {
    
    const componentString = fullName.split(":")[0];
    
    let output: Partial<Instance<ARGS>> = {
        id: nanoid(),
        fullName,
        componentString,
        args
    }

    if(componentString in baseTabs) {
        output.componentFunction = baseTabs[componentString];
    } else if(ExtensionManager.exists(componentString)) {
        const extension = ExtensionManager.get(componentString);
        output.componentFunction = extension.tabFactory;
        output.extension = extension;
    } else {
        throw `No component found for '${componentString}' when constructing tab.`
    }

    return output as Instance<ARGS>;
}



export interface Manager {
    addInstance(instance: Instance<any>): void | Promise<void>;
    removeInstance(instanceId: string): void | Promise<void>;
}
