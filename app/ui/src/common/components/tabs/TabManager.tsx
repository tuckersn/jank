import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { BehaviorSubject } from "rxjs";
import { Tab, TabProps } from "./Tab";
import { Theme } from "../../../Theme";

export interface TabManagerProps {
    tabs: {
        key: string
    }[],
    setTabs: <INPUT extends {
        key: string
    }>(tabs: INPUT[]) => void,
    activeKey: BehaviorSubject<string>,
    hoveredKey?: BehaviorSubject<string>,
    style: CSSProperties,
    customTabComponent?: React.FC<TabProps>
}

export const TabManagerDiv = styled.div`
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;

    &::-webkit-scrollbar {
        height: 10px;
        box-sizing: border-box;
        border: 155px solid rgba(${Theme.current.value.baseColorVeryLight});
    }
`;


export const TabManager: React.FC<TabManagerProps> = ({
    tabs: list,
    setTabs: setList,
    style,
    activeKey,
    hoveredKey: hoveredKeyProp,
    customTabComponent
}) => {

    const [hoveredKey] = useState(hoveredKeyProp || new BehaviorSubject(''));

    const remove = (index: number) => {
        const { key } = list[index];
        list.splice(index,1);
        if(activeKey.value === key) {
            console.log("V:", key, activeKey.value,index, list[index+1])
            if(list.length > 1) {
                if(index === list.length) {
                    activeKey.next(list[index-1].key);
                } else {
                    activeKey.next(list[index].key);
                }
            }
        }
        
        setList([...list]);
    }

    const findTab = (key: string) => {
        for(let i = 0; i < list.length; i++) {
            const tab = list[i];
            if(tab.key === key) {
                return i;
            }
        }
        return -1;
    }

    const moveTabIndex = (index: number, nextIndex: number) => {

        // error when dragged onto a non-tab element
        if(nextIndex === -1)
            return index;

        const newList = [...list];
        const temp = newList[index];
        newList[index] = newList[nextIndex];
        newList[nextIndex] = temp;
        setList([...newList]); 
        return nextIndex;
    };

    useEffect(() => {
        activeKey.subscribe(() => {
            hoveredKey.next('');
        })
        
    }, []);
    
    return <TabManagerDiv style={style}>

        {list.map((item, index) => {
            if(item == undefined) {
                console.log("STUFF:", index, item, hoveredKey.value, activeKey.value);
            }
            return <Tab key={item.key}
                item={item}
                index={index}
                remove={remove}
                findTab={findTab}
                moveTabIndex={moveTabIndex}
                hoveredKey={hoveredKey}
                activeKey={activeKey}
                customTabComponent={customTabComponent}/>
        })} 
    
    </TabManagerDiv>;
}