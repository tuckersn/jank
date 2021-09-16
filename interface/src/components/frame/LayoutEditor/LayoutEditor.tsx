import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import FlexLayout, { IJsonModel, Layout, Model, TabNode } from "flexlayout-react";

import  { Instance, MinimalInputInstance, TabProps } from "../../tab/TabManager";
import * as TabManager from "../../tab/TabManager";



import { nanoid } from "nanoid";

import "./FlexLayout.scss";
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

const exampleTabs: MinimalInputInstance[] = [
	{
		id: nanoid(),
		fullName: "text:file:./helloWorld.txt",
		componentString: "text",
		args: {
			'text': "Hello world?"
		},
		title: "TEST!"
	},
	{
		id: nanoid(),
		fullName: "tab-list",
		componentString: "tab-list",
		args: {
			'text': "Hello world?"
		},
		title: "Tab List"
	},
	{
		id: nanoid(),
		fullName: "text",
		componentString: "text",
		args: {
			'text': "Hello world other?"
		},
		title: "OTHER TEST!"
	}
]


const instanceData: {[instanceId: string]: Instance<any>} = {};



export function LayoutEditor({}) {

    
    const [model, setModel] = useState(Model.fromJson(json));

	const addInstance = (inputInstance: MinimalInputInstance) => {
		let instance: Instance<any> = TabManager.createInstance(inputInstance.fullName, inputInstance.args);
		instance = Object.assign(instance, inputInstance);
		instance.layout = {
			tabManager
		}
		instanceData[instance.id] = instance;

		model.doAction(FlexLayout.Actions.addNode(
			{
				id: instance.id,
				type: 'tab',
				component: instance.componentString,
				name: instance.fullName
			},
			"0",
			FlexLayout.DockLocation.CENTER,
			0
		));
	};

	const tabManager: TabManager.Manager = {
		addInstance,
		removeInstance: () => {
			//TODO: removing tabs.
		}
	}


    useEffect(() => {
		for(let exampleTab of exampleTabs) {
			if(exampleTab.id)
				if(exampleTab.id in instanceData)
					continue;
			addInstance(exampleTab);
		}
	}, [exampleTabs])
	
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
			
			let instance: Instance<any>;
			//console.log("INSTANCE:", node.getId(), instanceData);
			if(node.getId() in instanceData) {
				instance = instanceData[node.getId()];
				const TabComponent = instance.componentFunction;	
				return(<div style={{height: "100%", width: "100%"}}>
					<TabComponent instance={instance}/>
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
        <Layout model={model} factory={factory}
			classNameMapper={(className) => {
				/*	
					As of writing classNames follow this pattern:
						flex_layout__tab(__button(--selected/unselected))
					Where () are previous layers.
				*/
				return className;
			}}
			onRenderTab={(node, renderValues) => {
				const data = instanceData[node.getId()];
				renderValues.content = data?.title ? data.title : renderValues.content;
			}}>
			
		</Layout>
    </div>);
}