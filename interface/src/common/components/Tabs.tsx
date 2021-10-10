import _ from "lodash";
import React, { useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { BehaviorSubject } from "../../../node_modules/rxjs/dist/types";

const TabsContainer = styled.div`

`;

const TabContainer = styled.div``;

export function Tabs({
    tabFactory,
    style,
    list,
    setList,
    index: indexSubject
}: {
    tabFactory: () => ((props: {
        key: string,
        index: number
    }) => JSX.Element),
    style?: CSSProperties,
    list: string[],
    /**
     * If present destructive features
     * will be enabled.
     */
    setList?: (list: string[]) => void,
    /**
     * If present will emit changes.
     */
    index?: BehaviorSubject<{
        list: string[],
        index: number
    }>
}) {

    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    
    function updateIndex() {
        if(list.length < 0) {
            setCurrentIndex(-1);
        } else if(currentIndex === -1) {
            setCurrentIndex(0);
        }
    }

    useEffect(() => {
        updateIndex();
    }, []);

    useEffect(() => {
        updateIndex();
        if(setList) {
            if(list.length > 5) {
                setList(list.slice(0,5));
            }
        }
    }, [list]);

    useEffect(() => {
        updateIndex();
    }, [currentIndex]);

    if(currentIndex < 0 || list.length < 1)
        return <TabsContainer style={style}/>;
    
    return <TabsContainer style={style}>
        {list.map((key: string, index) => {
            return <TabContainer>
                {tabFactory()({
                    key,
                    index
                })}
            </TabContainer>;
        })}
    </TabsContainer>;
}