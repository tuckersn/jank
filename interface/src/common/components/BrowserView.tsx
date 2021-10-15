import { BrowserViewMessages } from "jank-shared/src/communication/render-ipc";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { withSize } from "react-sizeme";
import { filter } from "rxjs";
import styled, { StyledComponent } from "styled-components";
import { ElectronShim, ipcRenderer } from "../shims/electron";


export function spawnBrowserView(browserViewId: string): Promise<BrowserViewMessages.MSpawnResponse["payload"]> {
	return new Promise((res,err) => {
		const requestId: string = nanoid();
		let subscription = ElectronShim.browserViewMessages
			.pipe(
				filter(({ msg }) => {
					if (msg.type === "browser-view-M-spawn-response") {
						return msg.payload.requestId === requestId;
					}
					return false;
				})
			)
			.subscribe(({ msg: { payload } }) => {
				const msg = payload as BrowserViewMessages.MSpawnResponse["payload"];
				res(msg);
				subscription.unsubscribe();
			});

		const event: BrowserViewMessages.RSpawn = {
			type: "browser-view-R-spawn",
			payload: {
				requestId,
				id: browserViewId
			},
		};
		ipcRenderer.send("browser-view", event);
	});
}



const Container = styled.div`
	height: 100%;
	width: 100%;
`;

const BrowserViewDiv = styled.div`
	height: 100%;
	width: 100%;
`;

const BrowserViewComponent: React.FC<{
	
	size: { width: number; height: number };
	// Will spawn an instance if the key
	id?: string;
	spawn?: boolean;
	onDetach?: (args: {id: string}) => void;
}> = ({
	size,
	spawn,
	id: propsId,
	onDetach
}) => {
	const browserViewDivRef = useRef<HTMLDivElement>(null);
	const [id, setId] = useState<string>(propsId || nanoid());

	useEffect(() => {
		if(spawn) {
			spawnBrowserView(id);
		}

		return () => {
			console.log("DESTRUCT:", onDetach);
			if(onDetach) {
				onDetach({
					id
				});
			}
			const event: BrowserViewMessages.RDetach = {
				type: 'browser-view-R-detach',
				payload: {
					target: {
						id
					}
				}
			}
			ipcRenderer.send('browser-view', event);
		}
	}, []);

	useEffect(() => {
		if (id && browserViewDivRef) {
			const rect = browserViewDivRef.current?.getBoundingClientRect()!;
			const event: BrowserViewMessages.RPosition = {
				type: "browser-view-R-position",
				payload: {
					id,
					x: rect.left,
					y: rect.top,
					h: size.height,
					w: size.width,
				},
			};
			ipcRenderer.send("browser-view", event);
		}
	}, [size.height, size.width, id, browserViewDivRef]);

	return (
		<Container>
			<BrowserViewDiv
				style={{ width: "100%", height: "100%" }}
				ref={browserViewDivRef}
			></BrowserViewDiv>
		</Container>
	);
};

/**
 * For the sake of keeping things consistent
 * I am thinking of treating BrowserViews as
 * renderers and their window as main in terms
 * of the IPC usage.
 */
export default withSize({
	monitorHeight: true,
	monitorWidth: true,
})(BrowserViewComponent);
