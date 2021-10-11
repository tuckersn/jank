/**
 * Dragging is loosely based on this example:
 * https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_hooks_ts/04-sortable/cancel-on-drop-outside?from-embed=&file=/src/Container.tsx
 */
import React, { useCallback, useEffect, useState } from "react";

import _ from "lodash";
import styled, { CSSProperties } from "styled-components";
import { BehaviorSubject } from "rxjs";
import { useDrag } from "react-dnd";

import { Theme } from "../../Theme";
import { DefaultTab } from "./DefaultTab";

const TabsContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

export type TabProps = {
	// Same thing as key
	value: string;
	startingIndex: number;
	currentIndex: number;
	tabList: string[];
	setList?: (list: string[]) => void;
	destroy: (() => void) | null;
	setCurrentIndex: (index: number) => void;
    moveTab: (key: string, index: number) => number;
    findTab: (key: string) => { index: number };
};

export type MoveTabCallBack = (event: {
	dropIndex: number;
	dropItem: string;
	draggedIndex: number;
	draggedItem: string;
}) => void;

export function defaultTabComponentFactory(
	textComponent?: (props: TabProps) => JSX.Element,
	moveTab?: MoveTabCallBack
): React.FC<TabProps> {
	moveTab =
		moveTab || (({ draggedIndex, draggedItem, dropIndex, dropItem }) => {});

	return DefaultTab;
}

export function Tabs({
	tabFactory,
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
	tabFactory?: (props: TabProps) => JSX.Element;
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
	const [currentIndex, setCurrentIndex] = useState<number>(-1);

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
            const tab = list.filter((key) => `${key}` === searchKey)[0]
            return {
              tab,
              index: list.indexOf(tab),
            }
          },
          [list],
    );

	const moveTab = useCallback(
		(key: string, atIndex: number) => {
            const {tab,index} = findTab(key);
			let array = [...list];
            array.splice(index, 1);
            array.splice(atIndex, 0, tab);
            if(setList) {
                setList([...array]);
            }
            return index;
		},
		[list,setList]
	);

	useEffect(() => {
		updateIndex();
	}, []);

	useEffect(() => {
		updateIndex();
	}, [list]);

	useEffect(() => {
		updateIndex();
	}, [currentIndex]);

	const TabComponent = tabFactory || defaultTabComponentFactory();

	return (
		<TabsContainer style={style}>
			{list.map((itemValue: string, itemIndex) => {
				return (
					<TabComponent
						key={itemValue}
						{...{
							startingIndex: itemIndex,
							currentIndex,
							tabList: list,
							value: itemValue,
							setList,
							destroy: setList
								? () => {
										if (setList) {
											list.splice(itemIndex, 1);
											setList([...list]);
										}
								  }
								: null,
							setCurrentIndex,
                            moveTab,
                            findTab
						}}
					/>
				);
			})}
		</TabsContainer>
	);
}
