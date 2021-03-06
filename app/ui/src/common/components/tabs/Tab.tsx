import { remove } from "lodash";
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { ValueOf } from "type-fest";
import { BehaviorSubject } from "rxjs";
import { Theme } from "@janktools/ui-framework/dist/Theme";
import { TabManagerProps } from "./TabManager";



export interface TabProps {
    item: TabManagerProps['tabs'][0];
    index: number;
    remove: (index: number) => void;
    /**
     * Takes a key and returns it's index.
     */
    findTab: (key: string) => number;
    moveTabIndex: (index: number, nextIndex: number) => number;
    hoveredKey: BehaviorSubject<string>,
    activeKey: BehaviorSubject<string>,
    customTabComponent: TabManagerProps['customTabComponent']
}

export const TabDiv = styled.div`
    display: inline-block;
    height: 100%;
    
    box-sizing: border-box;
    border-left: 1px solid rgba(${Theme.current.value.baseColorVeryLight});
    background-color: rgba(${Theme.current.value.baseColorExtremelyDark});

    * {
        float: left;
    }

    &:first-of-type {
        border-left: 0;
    }
`;

export const TabInnerDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    

    height: 100%;
    width: 100%;

    padding: 4px;
    padding-left: 12px;
    padding-right: 12px;
`;

export const Tab: React.FC<TabProps> = (props) => {
    const {
        item,
        index,
        remove,
        findTab,
        moveTabIndex,
        hoveredKey,
        activeKey,
        customTabComponent
    } = props;
    const { key } = item;

    const [active,setActive] = useState(false);
    const [highLight, setHighLight] = useState(false);

    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        type: "jank-tab",
        index: index,
        item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                const nextIndex = findTab(hoveredKey.value);
                moveTabIndex(index,nextIndex);
                hoveredKey.next('');
            }
        },
    }), [item.key, index, moveTabIndex]);

    const [, drop] = useDrop(
        () => ({
            accept: "jank-tab",
            canDrop: () => false,
            hover({ key: oldKey }: typeof item, monitor) {
                if(item) {
                    if (item.key !== oldKey) {
                        hoveredKey.next(key);
                    }
                }
            },
        }),
        [findTab, moveTabIndex]
    );
    


    useEffect(() => {
        const hoverSub = hoveredKey.subscribe((hoveredKey) => {
            if(hoveredKey === item.key) {
                if(!highLight) {
                    setHighLight(true);
                }
            } else {
                setHighLight(false);
            }
        });
        const activeSub = activeKey.subscribe((activeKey) => {
            if(activeKey === item.key) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
        return () => {
            hoverSub.unsubscribe();
            activeSub.unsubscribe();
        }
    }, [])



    return <TabDiv style={{
            ...(
                isDragging ? {
                    opacity: 0.4
                } : {
                    opacity: 1
                }
            ),
            ...(
                highLight ? {
                    backgroundColor: `rgba(${Theme.current.value.highVeryLight})`,
                    color: `rgba(${Theme.current.value.baseColorDark})`
                } : {

                }
            ),
            ...(
                active ? {
                    backgroundColor: `rgba(${Theme.current.value.baseColorVeryLight})`
                } : {

                }
            )
        }}
        onClick={(event) => {
            if (event.target instanceof HTMLElement) {
                if (event.target.getAttribute("preventchange") === "true") {
                    return;
                }
                activeKey.next(item.key);
            }
        }}
        ref={(node) => drag(drop(node))}
    >
        
            {
                customTabComponent ? customTabComponent(props) : <TabInnerDiv>
                    <div>
                        KEY: {item.key}
                    </div>
                    <div style={{
                            marginLeft: '6px'
                        }}
                        onClick={() => {
                            console.log("REMOVE");
                            remove(index);
                        }}
                        {...{
                            preventchange: "true"
                        }}
                    >
                        X
                    </div>
                </TabInnerDiv>
            }
        
    </TabDiv>;
}