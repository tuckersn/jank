import React, { memo, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { Theme } from "../../Theme";
import { TabProps } from "./Tabs";

const TabContainer = styled.div`
	box-sizing: border-box;

	min-width: 50px;
	padding: 4px;
	padding-top: 0;
	padding-bottom: 1px;

	border-top: 1px solid white;
	border-left: 1px solid white;
	border-right: 1px solid white;
`;

export const DefaultTabTextContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;

	align-items: center;
	justify-content: center;
`;

const TextComponent = ({ startingIndex: index, value, destroy }: TabProps) => {
	return (
		<DefaultTabTextContainer>
			<div>{value.length > 12 ? value.slice(0, 9) + "..." : value}</div>
			{destroy ? (
				<div
					style={{
						alignSelf: "flex-end",
						marginLeft: "auto",
					}}
					onClick={(event) => {
						event.preventDefault();
						destroy();
					}}
					{...{
						preventchange: "true",
					}}
				>
					x
				</div>
			) : (
				""
			)}
		</DefaultTabTextContainer>
	);
};

export const DefaultTab: React.FC<TabProps> = memo(function DefaultTab(props) {
	const { currentIndex, setCurrentIndex, startingIndex, value, moveTab, findTab } = props;

    const [index,setIndex] = useState(startingIndex);

	const [active, setActive] = useState(false);
	const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		type: "jank-tab",
		index: props.startingIndex,
		item: {
			index: props.startingIndex,
			value: props.value,
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		end: (item, monitor) => {
			const { index: droppedIndex, value: droppedValue } = item;
			const didDrop = monitor.didDrop();
			if (!didDrop) {
                console.log("DROP:", index, droppedIndex);
				moveTab(droppedValue,droppedIndex);
			}
		},
	}));
	const [, drop] = useDrop(
		() => ({
			accept: "jank-tab",
			canDrop: () => false,
			hover({index: hoveredIndex,value: hoveredValue}:{index:number,value:string}) {
				console.log("VAL:", hoveredIndex, index);
                
				if (index !== hoveredIndex) {
                    const { index: overIndex } = findTab(value);
					moveTab(hoveredValue,overIndex);
				}
			},
		}),
		[moveTab]
	);
    

	return (
		<TabContainer
			style={{
				...(
                    index === currentIndex ? {
                        backgroundColor: Theme.current.value.accentColor,
					} : {

                    }
                ),
                ...(
                    isDragging ? {
                        opacity: 0
                    } : {
                        opacity: 1
                    }
                )
            }}
			onClick={(event) => {
				console.log("CHANGING INDEX:", active, index, value, currentIndex);
				if (event.target instanceof HTMLElement) {
					console.log("ELEMENT:", event.target, index);
					if (event.target.getAttribute("preventchange") === "true") {
						console.log("NOT CHANGING INDEX");
						return;
					}
					setCurrentIndex(index);
				}
			}}
			ref={(node) => drag(drop(node))}
		>
			<TextComponent {...props} />
		</TabContainer>
	);
});
