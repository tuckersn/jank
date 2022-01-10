import { CSSProperties, useRef, useState } from "react";
import { IconType } from "react-icons/lib";
import Config from "../../../common/config";
import { getBaseStyle, ToolBarItemProps } from "./Toolbar";


export const toolBarDropdownFactory: (args: {
    Icon: IconType,
    component: React.FC<{}>,
    style?: CSSProperties,
    override?: Partial<ToolBarItemProps>
  }) => React.FC<ToolBarItemProps> = ({Icon, component, style, override}) => {
    return ({key, alignment, toolbarHeight, iconSize}) => {
        alignment = override?.alignment || alignment;
        const [open,setOpen] = useState(false);
        const [styleState, setStyleState] = useState(style);
        const boxRef = useRef<HTMLDivElement>(null);
        const icon = <Icon onClick={(event) => {

            const target = event.target;

            const documentListener =  (event: MouseEvent) => {
                if(event.target instanceof HTMLElement) {
                    if(boxRef.current?.contains(event.target)) {
                        
                        if(event instanceof PointerEvent) {
                            console.log("PATH:",event.composedPath(), event.composedPath().includes(target));
                        }
                        console.log("APART OF BOX?", event); 
                    } else {
                        window.document.removeEventListener('click', documentListener);
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
                console.log("OTHER:")
                setOpen(false);
                setStyleState({
                    ...styleState,
                    background: `rgba(255,255,255,0)`
                })
                window.document.removeEventListener('click', documentListener);
            }
            
        }} style={{height: toolbarHeight, width: toolbarHeight}} fontSize={iconSize}/>;

        return (<div key={key} style={getBaseStyle({
            key,
            alignment,
            toolbarHeight,
            iconSize
        }, {
            ...styleState,
            ...(open ? {
                zIndex: 10009999
            } : {
                zIndex: 10009999
            })
        })}>
            {icon}
            <div style={{height: '100%', position: 'absolute', zIndex: 10009999}}>
                {open ? <div ref={boxRef} style={{
                    position: "absolute",
                    top: '50%',
                    left: '50%',
                    marginLeft: iconSize/-2 - 2,
                    marginTop: iconSize/2 + 2,
                    background: Config.style.backgroundColor,
                    boxSizing: 'border-box',
                    minWidth: 250,
                    padding: 6,
                    width: 'auto',
                    minHeight: 30,
                    border: `2px solid ${Config.style.accentColor}`,
                    borderTop: `1px solid white`,
                    borderBottomLeftRadius: 2,
                    borderBottomRightRadius: 2,
                    boxShadow: '3px 3px 3px #141414'
                }}>
                    {component({})}
                </div> : ''}
            </div>
            
        </div>);
    }
}