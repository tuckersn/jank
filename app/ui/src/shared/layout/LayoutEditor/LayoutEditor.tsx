import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import * as FlexLayout from "flexlayout-react";
import { IJsonModel, Layout as FLLayout, Model, TabNode, Actions } from "flexlayout-react";

import { Instance, InstanceRegistry, InstanceCreationObject } from "@janktools/ui-framework/dist/Instances";
import {Image} from "../../../common/components/Image";
import { nanoid } from "nanoid";


import { BehaviorSubject, filter, Observable } from "rxjs";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";

import { Layout } from "../Layout";


import "./LayoutEditor.scss";

const json: IJsonModel = {
	global: {},
	borders: [],
	layout:{
		"type": "row",
		"weight": 100,
		"children": [
			{
				"id": '0',
				"type": "tabset",
				"weight": 50,
				"selected": 0,
				"children": [
					{
						"type": "tab",
						"name": "FX",
						"component":"button",
                        "enableFloat": true
					}
				]
			}
		]
	}
};

function exampleTabs() {
	console.log("IR:", InstanceRegistry);
	return [
		InstanceRegistry.create('jank-menu', {
			name: "text:file:./helloWorld.txt",
			title: "TEST!",
			state: {
				'text': "Hello world?"
			},
			serialize: () => ({}),
			destroy: () => {

			}
		})
	];
}


export function LayoutEditor({}) {

    
    const [model, setModel] = useState(Model.fromJson(json));
	const [layout] = useState(new Layout());



    useEffect(() => {

		InstanceRegistry.creation.subscribe((instance) => {
			const program = ProgramRegistry.get(instance.programName);
            console.log("LY:", FlexLayout, Actions);
			model.doAction(Actions.addNode(
				{
					id: instance.id,
					type: 'tab',
					component: instance.programName,
					name: instance.name
				},
				"0",
				FlexLayout.DockLocation.CENTER,
				0
			));
		});

		exampleTabs();
	}, [])
	
	const factory = (node: TabNode) => {
        let component = node.getComponent();
		let name = node.getName();

		if (component === "button") {
            return <button onClick={async () => {
				console.log("OUTPUT:", {});
			}}>
				{node.getName()}
			</button>;
        }

		try {
			let instance: Instance<any, any> = InstanceRegistry.get(node.getId());
			if(instance) {
				const program = ProgramRegistry.get(instance.programName);
				const TabComponent = program.component;	
				return(<div style={{height: "100%", width: "100%"}}>
					<TabComponent instance={instance} program={program} InstanceRegistry={InstanceRegistry} ProgramRegistry={ProgramRegistry}/>
				</div>);
			} else {
				throw "No instance found for that tab.";
			}
			// else {
			// 	instance = TabFacory.createInstance(extensionName, component!);
			// }
		} catch(e) {
			console.error('FAILED TO RETURN TAB COMPONENT:', e);
		}
    }
    
    return (<div style={{
        height: '100%',
        width: '100%'
    }}>
        <FLLayout model={model} factory={factory}
			classNameMapper={(className) => {
				/*	
					As of writing classNames follow this pattern:
						flex_layout__tab(__button(--selected/unselected))
					Where () are previous layers.
				*/
				return className;
			}}
			iconFactory={(node) => {
				const instance = InstanceRegistry.get(node.getId());
				if(instance) {				
					return <Image height={40} width={40} fill src={instance.iconImg.pipe(filter((x) => x !== undefined)) as Observable<string>}/>;
				}
			}}
			onRenderTab={(node, renderValues) => {
				const instance = InstanceRegistry.get(node.getId());
				if(instance) {
					renderValues.content = instance.title ? instance.title : renderValues.content;
				}
			}}
			// onAction={(action) => {
			// 	if(action.type === FlexLayout.Actions.SELECT_TAB) {
			// 		console.log("SELECTED:", action);
			// 	}
			// 	return action;
			// }}
			>
			
		</FLLayout>
    </div>);
}