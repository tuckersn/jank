
import { InstanceRegistry } from "@janktools/ui-framework/dist/Instances";
import { MinimalProgram } from "@janktools/ui-framework/dist/Programs";
import { nanoid } from "nanoid";
import { MenuProgramComponent } from "../components/MenuProgramComponent";


export const MenuProgram: MinimalProgram<any> = {
    uniqueName: 'jank-menu',
    component:  MenuProgramComponent,
    instanceInit: (instance) => {
        console.log("WEB BROWSER INSTANCE:", instance);
        return {
            actions: {},
            serialize: () => {
                return {
                };
            },
            state: {
            },
            destroy: () => {

            },
            ...instance
        };
    },
    state: {},
    deserialize: (serialized) => {
        return InstanceRegistry.create<any>('jank-menu', {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
}