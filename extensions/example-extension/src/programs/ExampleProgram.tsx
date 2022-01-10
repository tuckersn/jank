import { InstanceRegistry } from "jank-interface/src/programs/Instances";
import { MinimalProgram } from "jank-interface/src/programs/Programs";
import { nanoid } from "nanoid";

export const ExampleProgram: MinimalProgram<any> = {
    uniqueName: 'example-program',
    component: function ExampleProgramComponent() {
        return <div style={{
            color: "red",
            backgroundColor: "green"
        }}>
            Example Extension Program!
        </div>;
    },
    instanceInit: (instance) => {
        return {
            actions: {},
            serialize: () => {
                return {
                };
            },
            state: {},
            destroy: () => {

            },
            ...instance
        };
    },
    state: {},
    deserialize: (serialized) => {
        return InstanceRegistry.create<any>('example-program', {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
};