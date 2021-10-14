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
import { DefaultTab, TabProps, TextComponentProps } from "./DefaultTab";





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
	const [currentIndex] = useState(new BehaviorSubject(-1));
	const [data,setData] = useState<any | null>(null);

	const [hoveredIndex] = useState(new BehaviorSubject<number>(-1));
	const [scrollReset, setScrollReset] = useState<boolean>(false);
	const [scroll] = useState(new BehaviorSubject<number>(0));
	const [holdWidth,setHoldWidth] = useState(false);

	function updateIndex() {
		if (list.length < 0) {
			currentIndex.next(-1);
		} else if (currentIndex.value === -1) {
			currentIndex.next(0);
		} else if (currentIndex.value > list.length - 1) {
			currentIndex.next(0);
		}
		if (indexSubject) {
			indexSubject.next({
				index: currentIndex.value,
				list,
			});
		}
	}

	const resetScroll = useCallback(() => {
		if(container.current)
			container.current!.scrollLeft = scroll.value;
	},[]);


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
		
		if(newIndex === currentIndex.value) {
			currentIndex.next(atIndex);
		}
		
		if(atIndex === currentIndex.value) {
			currentIndex.next(newIndex);
		}

		resetScroll();
        return newIndex;
    }

    const moveTabIndex = (atIndex: number, newIndex: number) => {
		
        let array = [...list];
		setScrollReset(true);
		const temp = array[atIndex];
		array[atIndex] = array[newIndex];
		array[newIndex] = temp;
        if(setList) {
            setList([...array]);
        }

		if(newIndex === currentIndex.value) {
			currentIndex.next(atIndex);
		}
		
		if(atIndex === currentIndex.value) {
			currentIndex.next(newIndex);
		}

		resetScroll()
        return newIndex;
    }

	const select = (value: string) => {
		console.log("SELECT");
		const {index} = findTab(value);
		currentIndex.next(index);
		
	};

	useEffect(() => {
		console.log("NEW TABS");
		updateIndex();
		scroll.subscribe(() => {
			if(scrollReset) {
				if(container) {
					container.current!.scrollLeft = scroll.value;
					setScrollReset(false);
				}
			}
		});
	}, []);


	useEffect(() => {
		updateIndex();
	}, [currentIndex]);



	const TabsContainer = styled.div`
		width: auto;
		height: 48px;
		overflow-x: scroll;
		overflow-y: hidden;
		white-space: nowrap;
	`;

	if(container.current) {
		resetScroll()
	}

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
					<DefaultTab
						key={itemValue}
						{...{
							hoveredIndex,
							index: itemIndex,
							currentIndex,
							tabList: list,
							value: itemValue,
							setList,
							data,
							setData,
							destroy: (i) => {
								if (setList) {

									if(currentIndex.value > itemIndex) {
										if(list.length > 1) {
											if(itemIndex > 0) {
												console.log("SHIFT");
												currentIndex.next(currentIndex.value - 1);
											}
										} else {
											currentIndex.next(-1);
										}
									}
									list.splice(itemIndex, 1);
									setList([...list]);

									
								}
							},
                            moveTab,
                            moveTabIndex,
                            findTab,
                            TextComponent,
							select
						}}
					/>
				);
			})}
			</div>
		</TabsContainer>
	);
}
