import { remove } from "lodash";
import React from "react";
import styled from "styled-components";
import { ValueOf } from "type-fest";
import { TabManagerProps } from "./TabManager";



export interface TabProps {
    item: TabManagerProps['list'][0];
    index: number;
    remove: (index: number) => void;
}

export const TabDiv = styled.div`
    border: 1px solid white;
    padding: 4px;
    padding-left: 6px;
    padding-right: 6px;
    display: inline-block;

    * {
        float: left;
    }
`;

export const Tab: React.FC<TabProps> = ({
    item,
    index,
    remove
}) => {
    
    return <TabDiv onClick={(event) => {
        console.log("I AM:", item);
    }}>
        <div>
            KEY: {item.key}
        </div>
        <div style={{
            marginLeft: '6px'
        }} onClick={() => {
            console.log("REMOVE");
            remove(index);
        }}>
            X
        </div>
    </TabDiv>;
}