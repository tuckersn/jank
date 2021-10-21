import { BrowserViewMessages } from "jank-shared/src/communication/render-ipc";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { withSize } from "react-sizeme";
import { BehaviorSubject, filter, map } from "rxjs";
import styled, { StyledComponent } from "styled-components";
import { useBehaviorSubject, useObservable } from "../hooks/RXJS";
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
	id: BehaviorSubject<string>;
	spawn?: boolean;
	onDetach?: (args: {id: string}) => void;
	delayBeforeDetach?: number,
	hide?: boolean,

	locationSubject: BehaviorSubject<string>,
	setTitle?: (title: string) => void

}> = ({
	size,
	spawn,
	id: idSubject,
	onDetach,
	delayBeforeDetach = 1,
	hide,
	locationSubject,
	setTitle
}) => {

	const browserViewDivRef = useRef<HTMLDivElement>(null);
	const [id, setId] = useBehaviorSubject(idSubject);
	const location = useObservable(ElectronShim.browserViewMessages.pipe(map(({msg}) => {
		if(msg.type === 'browser-view-M-navigated') {
			if(msg.payload.id === id) {
				if(setTitle) {
					setTitle(msg.payload.title);
				}
				return msg.payload.url;
			}
		}
		return null;
	}), filter((v) => v !== null)));

	useEffect(() => {
		/**
		 * I removed this check because I didn't have
		 * a specific reason to add it, and it was a
		 * very simple way to implement refreshing.
		 */
		// if(location !== locationSubject.value) {
		// 	locationSubject.next(location || '');
		// }
		locationSubject.next(location || '');
	}, [location]);

	useEffect(() => {

		const id = idSubject.value;

		if(id !== '') {
			if(spawn) {
				spawnBrowserView(idSubject.value).then(({id}) => {
					setId(id);
				});
			} else {
				const event: BrowserViewMessages.RAttach = {
					type: "browser-view-R-attach",
					payload: {
						target: {
							id
						}
					}
				}
				ipcRenderer.send("browser-view", event);
			}
		}

		const urlSub = locationSubject.subscribe((newUrl) => {
			if(newUrl !== location) {
				const message: BrowserViewMessages.RNavigate = {
					type: 'browser-view-R-navigate',
					payload: {
						target: {
							id
						},
						url: newUrl
					}
				};
				ipcRenderer.send('browser-view', message);
			}
		})
	
		return () => {
			if(onDetach) {
				onDetach({
					id
				});
			}
			urlSub.unsubscribe();
			// Delay to reduce chance of flashing, just goes under the new one.
			setTimeout(() => {
				if(id !== idSubject.value) {
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
			}, delayBeforeDetach);
		
		}
	}, []);

	useEffect(() => {
		if (browserViewDivRef) {
			if(idSubject.value !== '') {
				const rect = browserViewDivRef.current?.getBoundingClientRect()!;
				const event: BrowserViewMessages.RPosition = {
					type: "browser-view-R-position",
					payload: {
						id: idSubject.value,
						x: rect.left,
						y: rect.top,
						h: size.height,
						w: size.width,
					},
				};
				ipcRenderer.send("browser-view", event);
			}
		}
	}, [size.height, size.width, idSubject.value, browserViewDivRef]);

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
