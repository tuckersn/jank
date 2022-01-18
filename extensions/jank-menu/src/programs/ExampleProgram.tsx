
import { InstanceRegistry } from "@janktools/ui-framework/dist/Instances";
import { MinimalProgram } from "@janktools/ui-framework/dist/Programs";
import { nanoid } from "nanoid";

export const ExampleProgram: MinimalProgram<any> = {
    uniqueName: 'example-program',
    component:  function ExampleComponent() {
		return <div style={{
			color: "white",
			backgroundColor: "darkgreen",
			padding: "16px"
		}}>
			Example Extension Program! {nanoid()}
		</div>;
	},
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
        return InstanceRegistry.create<any>('example-program', {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
}