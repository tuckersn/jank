import './App.scss';

import { Scrollbars } from 'react-custom-scrollbars';

import { Frame } from './components/frame/Frame';
import { ChromeCSSProperties } from './common';
import Config from './common/config';
import { LayoutEditor } from './components/frame/LayoutEditor';


let containerStyle: ChromeCSSProperties = {
  background: `rgba(255,255,255,${Config.style.contrast})`,
  "-webkit-scrollbar-track": "rgba(0,0,0,0)",

  position: "relative",
  height: "100%",
  width: "100%",
  bottom: "0",

  overflow: "auto",
  
}



function App() {
  return (
    <Frame layout="editor"/>
  );
}

export default App;
