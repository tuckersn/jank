/**
 * Dragging is loosely based on this example:
 * https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/cancel-on-drop-outside?from-embed=&file=/src/Container.tsx
 */
import React, { JSXElementConstructor, memo, useCallback, useEffect, useRef, useState } from "react";

import _ from "lodash";
import styled, { CSSProperties } from "styled-components";
import { BehaviorSubject, first } from "rxjs";
import { useDrag } from "react-dnd";

import { Theme } from "../../Theme";
import { DefaultTab, TextComponentProps } from "./DefaultTab";



export type TabProps<DATA=any> = {
	// Same thing as key
	value: string;
	startingIndex: number;
	currentIndex: number;
	tabList: string[];
	data: DATA;
	setData: (data: DATA) => void;
	setList?: (list: string[]) => void;
	destroy: (() => void) | null;
	setCurrentIndex: (index: number) => void;
    moveTab: (key: string, index: number) => number;
    moveTabIndex: (newIndex: number, oldIndex: number) => number;
    findTab: (key: string) => { index: number };
    TextComponent?: React.FC<TextComponentProps>
};

export type MoveTabCallBack = (event: {
	dropIndex: number;
	dropItem: string;
	draggedIndex: number;
	draggedItem: string;
}) => void;



export function Tabs({
	TabComponent,
    TextComponent,
	style,
	list,
	setList,
	index: indexSubject,
}: {
	/**
	 * Index of -1 means nothing is selected.
	 *
	 * Index 0-N must be within the length of the list,
	 * tabs component will automatically set index to -1 if it
	 * exceeds the length of the list.
	 */
	TabComponent?: React.FC<TabProps>
    TextComponent?: React.FC<TextComponentProps>
	style?: CSSProperties;
	list: string[];
	/**
	 * If present destructive features
	 * will be enabled.
	 */
	setList?: (list: string[]) => void;
	/**
	 * If present will emit changes.
	 */
	index?: BehaviorSubject<{
		list: string[];
		index: number;
	}>;
}) {
	
	const container = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [data,setData] = useState<any | null>(null);

	const [scrollReset, setScrollReset] = useState<boolean>(false);
	const [scroll] = useState(new BehaviorSubject<number>(0));

	function updateIndex() {
		if (list.length < 0) {
			setCurrentIndex(-1);
		} else if (currentIndex === -1) {
			setCurrentIndex(0);
		} else if (currentIndex > list.length - 1) {
			setCurrentIndex(0);
		}
		if (indexSubject) {
			indexSubject.next({
				index: currentIndex,
				list,
			});
		}
	}


    const findTab = useCallback(
        (searchKey: string) => {
            const tab = list.filter((key) => `${key}` === searchKey)[0];
            return {
              tab,
              index: list.indexOf(tab),
            }
          },
          [list],
    );

	const moveTab = (key: string, atIndex: number) => {
		console.log("... move?");
        const {tab,index: newIndex} = findTab(key);
		setScrollReset(true);
        let array = [...list];
        array.splice(newIndex, 1);
        array.splice(atIndex, 0, tab);
        if(setList) {
            setList([...array]);
        }

        return newIndex;
    }

    const moveTabIndex = (currentIndex: number, newIndex: number) => {
		
        let array = [...list];
		setScrollReset(true);
		const temp = array[currentIndex];
		array[currentIndex] = array[newIndex];
		array[newIndex] = temp;
        if(setList) {
            setList([...array]);
        }

        return newIndex;
    }

	useEffect(() => {
		console.log("NEW TABS");
		updateIndex();

		// async function scrollingCB() {
		// 	scroll.pipe(first()).subscribe((pos) => {

		// 	});
		// }
		
	}, []);

	useEffect(() => {
		updateIndex();
	}, [list]);

	useEffect(() => {
		updateIndex();
	}, [currentIndex]);



    const TabComponentTag: React.FC<TabProps> = TabComponent || DefaultTab;
	const TabsContainer = styled.div`
		width: auto;
		height: 48px;
		overflow-x: scroll;
		overflow-y: hidden;
		white-space: nowrap;
	`;

	useEffect(() => {
		if(container) {
			container.current!.scrollLeft = scroll.value;
		}
	});

	return (
		<TabsContainer ref={container} style={style} onScroll={(event) => {
			if(scrollReset) {
				event.preventDefault();
			}
			scroll.next(container.current!.scrollLeft);
		}}>
			<div>
			{list.map((itemValue: string, itemIndex) => {
				return (
					<TabComponentTag
						key={itemValue}
						{...{
							startingIndex: itemIndex,
							currentIndex,
							tabList: list,
							value: itemValue,
							setList,
							data,
							setData,
							destroy: setList
								? () => {
										if (setList) {

                                            if(currentIndex > itemIndex) {
                                                if(list.length > 1) {
                                                    if(itemIndex > 0) {
                                                        console.log("SHIFT");
                                                        setCurrentIndex(currentIndex - 1);
                                                    }
                                                } else {
                                                    setCurrentIndex(-1);
                                                }
                                            }
											list.splice(itemIndex, 1);
											setList([...list]);
										}
								  }
								: null,
							setCurrentIndex,
                            moveTab,
                            moveTabIndex,
                            findTab,
                            TextComponent
						}}
					/>
				);
			})}
			</div>
		</TabsContainer>
	);
}
