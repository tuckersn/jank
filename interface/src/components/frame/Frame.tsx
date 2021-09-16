import { FC, useCallback, useContext, useEffect, useState } from "react"
import { MdClose, MdFullscreen, MdFullscreenExit, MdMenu, MdRefresh } from "react-icons/md";
import { BsDash } from "react-icons/bs";

import { ChromeCSSProperties } from "../../common";
import { Config } from "../../common/config";


import * as TabManager from "../tab/TabManager";

import "./Frame.scss";
import { LayoutEditor } from "./LayoutEditor/LayoutEditor";
import { LayoutGrid } from "./LayoutGrid";
import React from "react";
import { ElectronShim } from "../../common/shims/electron";


const FrameContext: React.Context<{
    title: string
}> = React.createContext({
    title: "New Window"
});




type FrameProps = {
  layout: "editor" | "grid"
}

export type FrameFunctions = {
    tabManager: TabManager.Manager
}


const iconScale = 5.5;


export const Frame: FC<FrameProps> = ({ children, layout }) => {

    const [frameHeight, setFrameHeight]  = useState(Config.style.frame.height);
    const {title} = useContext(FrameContext);

    useEffect(() => {
        console.log("TITLE CHANGE:", FrameContext);
    }, [title])

    const titleBarStyle: ChromeCSSProperties = {
        color: Config.style.fontColor,
        height: frameHeight + 'px',
        fontSize: Config.style.frame.fontScale * Math.log(frameHeight) + 'px',

        boxSizing: 'border-box',
        borderBottom: Config.style.frame.border + ' ' + Config.style.accentColor,
    };

    return <div style={{
        height: "100vh",
        width: "100vw",

        color: Config.style.fontColor,
        background: Config.style.backgroundColor,
        border: Config.style.frame.border + ' ' + Config.style.accentColor,
        boxSizing: "border-box"
      }}>
        <div style={titleBarStyle}>
            <div className={"mechanism title-bar"}>
                <div className="left">
                    <div className="selectable">
                        <MdMenu size={iconScale * Math.log(frameHeight)} onClick={() => {
                            console.log("Menu would go here!");
                        }}/>
                    </div>
                    <div className="selectable">
                        <MdRefresh size={iconScale * Math.log(frameHeight)} onClick={() => {
                            window.location.reload();
                        }}/>
                    </div>
                    <button className="selectable" onClick={() => {
                        setFrameHeight(frameHeight - 1);
                        console.log("FRAME:", frameHeight);
                    }}>-</button>
                    <button className="selectable" onClick={() => {
                        setFrameHeight(frameHeight + 1);
                        console.log("FRAME:", frameHeight);
                    }}>+</button>
                </div>
                <div className="middle">
                    {title}
                </div>
                <div className="right">
                    <div className="selectable">
                        <BsDash size={iconScale * Math.log(frameHeight)} onClick={() => {
                            ElectronShim.Frame.minimize();
                        }}/>
                    </div>
                    <div className="selectable" onClick={() => {
                         ElectronShim.Frame.maximize();
                    }}>
                        { ElectronShim.Frame.maximizationSubject ?
                            <MdFullscreenExit size={iconScale * Math.log(frameHeight)}/> : 
                            <MdFullscreen size={iconScale * Math.log(frameHeight)}/>}
                    </div>
                    <div className="selectable">
                        <MdClose size={iconScale * Math.log(frameHeight)} onClick={() => {
                             ElectronShim.Frame.close();
                        }}/>
                    </div>
                </div>
            </div>
        </div>
        
        <div style={{height: `calc(100% - ${frameHeight}px)`, width: "100%"}}>
            {(() => {
                switch(layout) {
                    case "editor":
                        return <LayoutEditor></LayoutEditor>
                    case "grid":
                        return <LayoutGrid></LayoutGrid>
                    default:
                        throw "Invalid layout: " + layout;
                }
            })()}
        </div>
    </div>
}





//@ts-expect-error
globalThis.Frame = FrameContext;