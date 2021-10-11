import { BrowserViewMessages } from "jank-shared/src/communication/render-ipc";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { withSize } from "react-sizeme";
import { filter } from "rxjs";
import styled, { StyledComponent } from "styled-components";
import { ElectronShim, ipcRenderer } from "../shims/electron";

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
}> = ({ size }) => {
	const browserViewDivRef = useRef<HTMLDivElement>(null);
	const [id, setId] = useState<string | null>(null);

	useEffect(() => {
		const requestId: string = nanoid();
		const event: BrowserViewMessages.RSpawn = {
			type: "browser-view-R-spawn",
			payload: {
				requestId,
			},
		};

		console.log("Getting ready to start!");

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
				setId(msg.id);
				subscription.unsubscribe();
			});

		ipcRenderer.send("browser-view", event);

		console.log("Waiting for a response.");
	}, []);

	useEffect(() => {
		console.log("BV RESIZE:", id, browserViewDivRef);
		if (id && browserViewDivRef) {
			console.log("UPDATING POSITION");
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
			console.log("RESIZE:", event, {
				id,
				x: rect.left,
				y: rect.top,
				h: size.height,
				w: size.width,
			});
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
