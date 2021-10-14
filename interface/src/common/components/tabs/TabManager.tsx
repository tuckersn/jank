import _ from "lodash";
import React, { useCallback } from "react";
import styled, { CSSProperties } from "styled-components";
import { Tab } from "./Tab";

export interface TabManagerProps {
    list: {
        key: string
    }[],
    setList: (list: {
        key: string
    }[]) => void,
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
    style
}) => {

    const remove = useCallback(
        (index: number) => {
            list.splice(index,1);
            setList([...list]);
        },
        []
    )
    
    return <TabManagerDiv style={style}>
        <TabManagerInnerDiv>
            {list.map((item, index) => {
                return <Tab item={item} index={index} remove={remove}/>
            })} 
        </TabManagerInnerDiv>
    </TabManagerDiv>;
}