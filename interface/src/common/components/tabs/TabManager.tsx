import _ from "lodash";
import React, { useCallback, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { BehaviorSubject } from "rxjs";
import { Tab } from "./Tab";

export interface TabManagerProps {
    list: {
        key: string
    }[],
    setList: (list: {
        key: string
    }[]) => void,
    activeKey: BehaviorSubject<string>,
    hoveredKey?: BehaviorSubject<string>,
    style: CSSProperties
}

export const TabManagerDiv = styled.div`
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;
`;

const TabManagerInnerDiv = styled.div`
    position: relative;
`;

export const TabManager: React.FC<TabManagerProps> = ({
    list,
    setList,
    style,
    activeKey,
    hoveredKey: hoveredKeyProp
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
        const newList = [...list];
        const temp = newList[index];
        newList[index] = newList[nextIndex];
        newList[nextIndex] = temp;
        setList([...newList]); 
        return nextIndex;
    };
    
    return <TabManagerDiv style={style}>
        <TabManagerInnerDiv>
            {list.map((item, index) => {
                if(typeof item.key !== 'string') {
                    console.log("STUFF:", hoveredKey.value, activeKey.value);
                }
                return <Tab key={item.key}
                    item={item}
                    index={index}
                    remove={remove}
                    findTab={findTab}
                    moveTabIndex={moveTabIndex}
                    hoveredKey={hoveredKey}
                    activeKey={activeKey}/>
            })} 
        </TabManagerInnerDiv>
    </TabManagerDiv>;
}