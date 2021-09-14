import { nanoid } from "nanoid";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { IconBaseProps, IconType } from "react-icons/lib";

import { Promisable } from "type-fest";
import Config from "../../../common/config";
import ReactIcons from "../../../shared/react-icons";



export interface ToolBarItemProps {
    key: string,
    alignment?: 'left' | 'right'
}

let toolbarHeight: number = 20;
let iconSize: number = 16;


function getBaseStyle({alignment} : ToolBarItemProps, style?: CSSProperties): CSSProperties {
    return Object.assign({}, {
        height: toolbarHeight,
        width: toolbarHeight,
        background: 'rgba(0,0,0,0)',
        color: 'white',
        border: 0,
        borderRight: "1px solid white",
        padding: 0,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: "border-box",
        ...(
            alignment === 'right' ? {
                borderLeft: "1px solid white"
            } as CSSProperties : {
                left: 0
            } as CSSProperties
        ),
    }, style || {});
}


export const toolBarButton: (args: {
    Icon: IconType,
    cb: (e: unknown) => void,
    style?: CSSProperties,
    override?: Partial<ToolBarItemProps>
  }) => React.FC<ToolBarItemProps> = ({Icon, cb, style, override}) => {
    return ({key, alignment}) => {
        alignment = override?.alignment || alignment;
        return (<button key={key} style={getBaseStyle({key, alignment}, style)} onClick={cb}>
            <Icon fontSize={iconSize}/>
        </button>);
    }
}

export const toolBarDropdown: (args: {
    Icon: IconType,
    component: React.FC<{}>,
    style?: CSSProperties,
    override?: Partial<ToolBarItemProps>
  }) => React.FC<ToolBarItemProps> = ({Icon, component, style, override}) => {
    return ({key, alignment}) => {
        alignment = override?.alignment || alignment;
        const [open,setOpen] = useState(false);
        const [styleState, setStyleState] = useState(style);
        const boxRef = useRef<HTMLDivElement>(null);
        const icon = <Icon onClick={(event) => {
            console.log("TEST:", event.currentTarget)

            const documentListener =  (event: MouseEvent) => {
                if(event.target instanceof HTMLElement) {
                    if(!boxRef.current?.contains(event.target)) {
                        setOpen(false);
                        setStyleState({
                            ...styleState,
                            background: `rgba(255,255,255,0)`
                        })
                    } 
                }
                
            }

            if(!open) {
                setOpen(true);
                setStyleState({
                    ...styleState,
                    background: `rgba(255,255,255,${Config.style.contrast})`
                })
                event.preventDefault();
                window.document.addEventListener('click', documentListener);
            } else {
                setOpen(false);
                setStyleState({
                    ...styleState,
                    background: `rgba(255,255,255,0)`
                })
                window.document.removeEventListener('click', documentListener, true)
            }
            
        }} style={{height: toolbarHeight, width: toolbarHeight}} fontSize={iconSize}/>;

        return (<div key={key} ref={boxRef} style={getBaseStyle({key, alignment}, styleState)}>
            {icon}
            {open ? <div style={{
                display: 'inline',
                position: 'absolute',
                background: Config.style.backgroundColor,
                border: `2px solid ${Config.style.accentColor}`,
                boxSizing: 'border-box',
                top: toolbarHeight,
                zIndex: 100,
                textAlign: "right",
                verticalAlign: 'top',
                minWidth: 150,
                minHeight: 30,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                ...(
                    alignment === 'right' ? {
                        right: 0
                    } : {
                        left: 0
                    }
                ),
            }}>
                {component({})}
            </div> : ''}
            
        </div>);
    }
}

export const ToolBar: React.FC<{
    items: React.FC<ToolBarItemProps>[]
    right?: React.FC<ToolBarItemProps>
}> = ({children, items}) => {
    
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        top: 0,
        bottom: 0
    }}>

        <div style={{
            flex: 0,
            display: "flex",
            flexDirection: "row",
            width: '100%',
            height: toolbarHeight,
            borderBottom: "1px solid white"
        }}>
            {items.map((item) => {
                return item({key: nanoid()})
            })}
            
        </div>

        <div style={{
            flex: 1,
            width: '100%',
            height: '100%'
        }}>
            {children}
        </div>

    </div>);
};