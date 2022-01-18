
import { InstanceRegistry } from "@janktools/ui-framework/dist/Instances";
import { PaneProps } from "@janktools/ui-framework/dist/Panes";
import { MinimalProgram } from "@janktools/ui-framework/dist/Programs";
import { nanoid } from "nanoid";
import { useState } from "react";

export const PROGRAM_NAME = 'jank-socket-client';


export interface SocketClientMessage {
	fromRemote: boolean;
	time: Date;
	content: string;
}

export interface SocketClientState {

}

export const SocketClientComponent: React.FC<PaneProps<SocketClientState>> = () => {

	const [textInput, setTextInput] = useState("");
	const [messages, setMessages] = useState<SocketClientMessage[]>([
		{
			fromRemote: true,
			time: new Date(),
			content: "Hey this is a log message!"
		}
	]);

	return <div>
		<div>
			{
				messages.map(({
					content,
					fromRemote,
					time
				}) => {
					return <div>
						{fromRemote ? "<" : ">"} {content} - {time}
					</div>;
				})
			}
		</div>
	</div>
};



export const SocketClientProgram: MinimalProgram<SocketClientState> = {
    uniqueName: PROGRAM_NAME,
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
        return InstanceRegistry.create<SocketClientState>(PROGRAM_NAME, {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
}