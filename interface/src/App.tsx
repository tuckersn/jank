import './App.scss';

import { Scrollbars } from 'react-custom-scrollbars';

import { Frame } from './components/frame/Frame';
import Config from './common/config';
import { LayoutEditor } from './components/frame/LayoutEditor/LayoutEditor';
import { CSSProperties, useEffect } from 'react';
import { BrowserViewMessages } from 'jank-shared/dist/communication/render-ipc';
import { ElectronShim } from './common/shims/electron';


let containerStyle: CSSProperties = {
	background: `rgba(255,255,255,${Config.style.contrast})`,

	position: "relative",
	height: "100%",
	width: "100%",
	bottom: "0",

	overflow: "auto",
	
}



function App() {

	useEffect(() => {
		
		{
			const event: BrowserViewMessages.RDestroy = {
				type: 'browser-view-R-destroy',
				payload: {
					target: {
						all: true
					}
				}
			};
			console.log("Destroying existing browser views.");
			ElectronShim.send('browser-view', event);
		}
		
		return () => {
			//cleanup
		}
	}, [])

	return (
		<Frame layout="editor"/>
	);
}

export default App;
