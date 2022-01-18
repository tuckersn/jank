import { useState } from "react";
import { Instance, InstanceRegistry } from "./Instances";
import { Program, ProgramRegistry } from "./Programs";


/**
 * Pane components props, this is the component props
 */
export interface PaneProps<INSTANCE_STATE extends Object = any, PROGRAM_STATE extends Object = any, SERIALIZABLE extends Object = any> {
    instance: Instance<INSTANCE_STATE, SERIALIZABLE>,
    program: Program<INSTANCE_STATE, PROGRAM_STATE>,
    InstanceRegistry: typeof InstanceRegistry,
    ProgramRegistry: typeof ProgramRegistry
}

