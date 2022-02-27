
import { InstanceRegistry } from "@janktools/ui-framework/dist/Instances";
import { PaneProps } from "@janktools/ui-framework/dist/Panes";
import { MinimalProgram } from "@janktools/ui-framework/dist/Programs";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";

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
				Object.keys(messages).map((key: any) => {
					const {
						content,
						fromRemote,
						time
					} = messages[key];
					return <div key={key}>
						{fromRemote ? "<" : ">"} {JSON.stringify(content)} - {JSON.stringify(time)}
					</div>;
				})
			}
		</div>
		<div>
			<textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} onKeyDown={(event) => {
				//https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
				if(event.code === 'Enter') {
					console.log("ENTER")
					setMessages([...messages, {
						fromRemote: false,
						time: new Date(),
						content: textInput
					}]);
					setTextInput('');
				}
			}}></textarea> 
		</div>
	</div>
};



export const SocketClientProgram: MinimalProgram<SocketClientState> = {
    uniqueName: PROGRAM_NAME,
    component:  SocketClientComponent,
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