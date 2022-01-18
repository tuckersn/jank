import { stringify } from "querystring";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import _ from "lodash";
export interface Tab {
    // must match placement in tabs object.
    id: string,
    component: React.FC<{
        key: string,
        tab: Tab,
        active: boolean
    }>
}


const Container = styled.div`
    width: 100%;
    height: 100%;
`;

const ToolBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const BrowserTabContainer = styled.div`    
    display: flex;
    flex-direction: row;
    min-width: 50px;

    padding: 2px;
    padding-left: 6px;
    
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-right: 1px solid white;
`;

const BrowserTabOptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-self: flex-end;
    flex: 0 0 6px;
`;

function BrowserTab({tab} : {tab: Tab}) {
    const [hovering, setHovering] = useState(true);
    return <BrowserTabContainer
        onMouseEnter={() => {
            setHovering(true);
        }}
        onMouseLeave={() => {
            setHovering(false);
        }}>
        <div style={{
            flex: 1
        }}>
            {tab.id.length > 10 ? tab.id.substring(0,7) + '...' : tab.id}
        </div>
        {hovering ? <BrowserTabOptionsContainer>
            <button>x</button>
        </BrowserTabOptionsContainer> : ''}
    </BrowserTabContainer>;
}

export const TabbedContainer: React.FC<{
    tabs: Tab[],
    tabRender?: React.FC<{tab:Tab}>
}> = (props) => {

    const [currentTab, setCurrentTab] = useState<React.ReactNode>();

    return <Container>
        <ToolBarContainer>
            {props.tabs.map((v) => {
                return <BrowserTab tab={v}/>;             
            })}
        </ToolBarContainer>
        {currentTab}
    </Container>;
}