import { Promisable } from "type-fest";

import { Application, Instances, Panes, Programs } from ".";


export interface IExtensionArgs {
	Programs: typeof Programs,
	Instances: typeof Instances,
	Panes: typeof Panes,
	Application: typeof Application
}

export interface IExtensionModule {
    
    init: (args: IExtensionArgs & {

    }) => Promisable<void>;

    onDestroy?: (args: IExtensionArgs & {

    }) => Promisable<void>;


}

