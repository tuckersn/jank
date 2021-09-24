import './App.scss';

import { Scrollbars } from 'react-custom-scrollbars';

import { Frame } from './components/frame/Frame';
import Config from './common/config';
import { LayoutEditor } from './components/frame/LayoutEditor/LayoutEditor';
import { CSSProperties } from 'react';


let containerStyle: CSSProperties = {
  background: `rgba(255,255,255,${Config.style.contrast})`,

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
