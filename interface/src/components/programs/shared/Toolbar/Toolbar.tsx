import { nanoid } from "nanoid";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { IconBaseProps, IconType } from "react-icons/lib";

import { Promisable } from "type-fest";
import Config from "../../../../common/config";
import ReactIcons from "../../../../shared/react-icons";
import { Theme } from "../../../../Theme";



export interface ToolBarItemProps {
    key: string,
    toolbarHeight: number,
    iconSize: number,
    alignment?: 'left' | 'right',
}

let toolbarHeight: number = 20;
let iconSize: number = 16;


export function getBaseStyle({alignment} : ToolBarItemProps, style?: CSSProperties): CSSProperties {
    return Object.assign({}, {
        height: toolbarHeight,
        width: toolbarHeight,
        position: 'relative',
        zIndex: 1000000,
        background: 'rgba(0,0,0,0)',
        color: 'white',
        border: 0,
        borderRight: "1px solid " + Theme.current.value.accentColor,
        padding: 0,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: "border-box"
    }, style || {});
}


export const toolBarButton: (args: {
    Icon: IconType,
    cb: (e: unknown) => void,
    style?: CSSProperties,
    override?: Partial<ToolBarItemProps>
  }) => React.FC<ToolBarItemProps> = ({Icon, cb, style, override}) => {
    return (props) => {
        props.alignment = override?.alignment || props.alignment;
        return (<button key={props.key} style={getBaseStyle(props, style)} onClick={cb}>
            <Icon fontSize={iconSize}/>
        </button>);
    }
}



export const ToolBar: React.FC<{
    items: React.FC<ToolBarItemProps>[]
    bottom?: boolean,
    right?: React.FC<ToolBarItemProps>
}> = ({children, items, bottom = false}) => {

    const childComponent = useState(<div style={{
        flex: 1,
        width: '100%',
        height: '100%'
    }}>
        {children}
    </div>);
    
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        top: 0,
        bottom: 0
    }}>

        {bottom ? childComponent : ''}

        <div style={{
            flex: 0,
            display: "flex",
            flexDirection: "row",
            width: '100%',
            height: toolbarHeight,
            ...(bottom ? {
                borderTop: "1px solid " + Theme.current.value.accentColor
            } : {
                borderBottom: "1px solid " + Theme.current.value.accentColor
            })
        }}>
            {items.map((item) => {
                return item({
                    key: nanoid(),
                    iconSize,
                    toolbarHeight
                })
            })}
            
        </div>

        {!(bottom) ? childComponent : ''}



    </div>);
};


