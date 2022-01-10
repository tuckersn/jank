import React from "react";
import { Instance, InstanceRegistry } from "../Instances";
import { PaneProps } from "../Panes";
import { MinimalProgram } from "../Programs";

export interface RequesterInstanceState {

}

export interface RequesterInstanceSerialized {

}

export const RequesterPane: React.FC<PaneProps<RequesterInstanceState, any, RequesterInstanceSerialized>> = ({}) => {
    return <div>
        REQUESTER
    </div>;
}


export const RequesterProgram: MinimalProgram<RequesterInstanceState, any, RequesterInstanceSerialized> = {
    component: RequesterPane,
    uniqueName: "jank-requester",
    state: {

    },
    instanceInit: (instance) => {
        const outputInstance: Instance<RequesterInstanceState, RequesterInstanceSerialized> = {
            id: instance.id,
            programName: instance.programName,
            iconImg: instance.iconImg,
            actions: {},
            state: {},
            serialize: () => {
                return {};
            },
            destroy: () => {

            },
            hidden: false
        };
        return outputInstance;
    },
    deserialize: (serialized) => {
        return InstanceRegistry.create('jank-requester');
    }
}