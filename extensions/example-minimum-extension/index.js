export const MinimalExampleProgram = {
    uniqueName: 'minimal-example-program',
    component:  function MinimalExampleComponent() {
		return <div style={{
			color: "white",
			backgroundColor: "darkgreen",
			padding: "16px"
		}}>
			Hello World!
		</div>;
	},
    instanceInit: (instance) => {
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
        return InstanceRegistry.create<any>('minimal-example-program', {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
}

export function init() {
	ProgramRegistry.create(MinimumExampleProgram);
}