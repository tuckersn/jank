import { InstanceRegistry } from "@janktools/ui-framework/dist/Instances";
import { ProgramRegistry } from "@janktools/ui-framework/dist/Programs";
import { Monaco } from "@janktools/ui-framework/dist/components";
import { default as styled } from "styled-components";
import { useState } from "react";

const Container = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`;


const ToolBar = styled.div`
	flex: 0 0 32px;
	border: 3px solid lime;
	display: flex;
	flex-direction: column;
`;


const MenuEntryContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const MenuEntry = styled.div`
	display: flex;
	flex-direction: row;
`;

const LaunchDataContainer = styled.div`
	flex: 1;
`;


export function MenuProgramComponent() {

	const [model, setModel] = useState<Monaco.module.editor.ITextModel>();
	
	return <Container>
		<ToolBar>
			toolbar
		</ToolBar>
		<div style={{
			flex: "1",
			border: "3px solid red",
			display: "flex"
		}}>
			<MenuEntryContainer>
				{
					ProgramRegistry.map((p) => {
						return <MenuEntry>
							{p.uniqueName} <button onClick={async () => {
								const instance = await InstanceRegistry.create(p.uniqueName, JSON.parse(model?.getValue()!));
							}}>
								Open
							</button>
						</MenuEntry>;
					})
				}
			</MenuEntryContainer>
			<LaunchDataContainer>

				<Monaco.MonacoEditor language="json"  onStart={async ({
					editor,
					model
				}) => {
					model.setValue(JSON.stringify({
						name: "Hello Name!",
						title: "Hello World!",
						state: {

						}
					}, null, 4).replaceAll('    ', '\t'));
					setModel(model);
				}}/>
		
			</LaunchDataContainer>
		</div>
	</Container>;
}