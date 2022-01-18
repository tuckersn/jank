import { Promisable } from "type-fest";

import { Instances, Panes, Programs } from ".";


export interface IExtensionArgs {
	Programs: typeof Programs,
	Instances: typeof Instances,
	Panes: typeof Panes
}

export interface IExtensionModule {
    
    init: (args: IExtensionArgs & {

    }) => Promisable<void>;

    onDestroy?: (args: IExtensionArgs & {

    }) => Promisable<void>;

}

