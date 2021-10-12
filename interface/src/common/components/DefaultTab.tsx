import React, { JSXElementConstructor, memo, useCallback, useEffect, useMemo, useState } from "react";
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


export type  TextComponentProps = TabProps & {
    highlight: boolean,
    setHighlight: (highlight: boolean) => void,
};

export const DefaultTabTextContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;

	align-items: center;
	justify-content: center;
`;

export const DefaultTabTextComponent = ({ startingIndex: index, value, destroy }: TextComponentProps) => {
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


export const DefaultTab: React.FC<TabProps> = function DefaultTab(props) {
    const { currentIndex, setCurrentIndex, startingIndex, value, findTab, moveTab, TextComponent } = props;

    const [highlight, setHighlight] = useState(false);

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
                console.log("DROP:", value, startingIndex, droppedValue, droppedIndex);
                const { index } = findTab(value);
                const newIndex = moveTab(droppedValue, index);
                // Old index was current
                if(index === currentIndex) {
                    setCurrentIndex(newIndex);
                // Other tab was the active tab
                } else if (newIndex === currentIndex) {
                    setCurrentIndex(index);
                }
            }
            setHighlight(false);
        },
    }), [value, startingIndex, moveTab]);

   
    const [, drop] = useDrop(
        () => ({
            accept: "jank-tab",
            canDrop: () => false,
            hover({index: hoveredIndex,value: hoveredValue}:{index:number,value:string}, monitor) {
                setHighlight(true);
                
            

                if (startingIndex !== hoveredIndex) {
                    const { index } = findTab(value);
                    const newIndex = moveTab(hoveredValue,index);
                    // Old index was current
                    if(index === currentIndex) {
                        setCurrentIndex(newIndex);
                    // Other tab was the active tab
                    } else if (newIndex === currentIndex) {
                        setCurrentIndex(index);
                    }

                    function loop() {
                        setTimeout(() => {
                            console.log("LOOP:", );
                            if(monitor.isOver()) {
                                loop();
                            } else {
                                setHighlight(false);
                            }
                        }, 100);
                    }
                    loop();
                } 


                
            },

        }),
        [findTab, moveTab]
    );
    

    const TextComponentTag = useMemo(() => {
        return TextComponent || DefaultTabTextComponent;
    },[TextComponent]);

    return (
        <TabContainer
            style={{
                ...(
                    startingIndex === currentIndex ? {
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
                ),
                ...(
                    highlight ? {
                        backgroundColor: 'red'
                    } : {

                    }
                )
            }}
            onClick={(event) => {
                console.log("CHANGING INDEX:", active, startingIndex, value, currentIndex);
                if (event.target instanceof HTMLElement) {
                    console.log("ELEMENT:", event.target, startingIndex);
                    if (event.target.getAttribute("preventchange") === "true") {
                        console.log("NOT CHANGING INDEX");
                        return;
                    }
                    setCurrentIndex(startingIndex);
                }
            }}
            ref={(node) => drag(drop(node))}
        >
            <TextComponentTag key={value} highlight={highlight} setHighlight={setHighlight} {...props}/>
        </TabContainer>
    );
};


// export const DefaultTab: React.FC<TabProps> = function DefaultTab(props) {
// 	const { currentIndex, setCurrentIndex, startingIndex, value, findTab, moveTab } = props;


// 	const [active, setActive] = useState(false);
// 	const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
// 		type: "jank-tab",
// 		index: props.startingIndex,
// 		item: {
// 			index: props.startingIndex,
// 			value: props.value,
// 		},
// 		collect: (monitor) => ({
// 			isDragging: monitor.isDragging(),
// 		}),
// 		end: (item, monitor) => {
// 			const { index: droppedIndex, value: droppedValue } = item;
// 			const didDrop = monitor.didDrop();
// 			if (!didDrop) {
//                 console.log("DROP:", value, startingIndex, droppedValue, droppedIndex);
//                 const { index } = findTab(value);
// 				const newIndex = moveTab(droppedValue, index);
//                 // Old index was current
//                 if(index === currentIndex) {
//                     setCurrentIndex(newIndex);
//                 // Other tab was the active tab
//                 } else if (newIndex === currentIndex) {
//                     setCurrentIndex(index);
//                 }
// 			}
// 		},
// 	}), [value, startingIndex, moveTab]);

// 	const [, drop] = useDrop(
// 		() => ({
// 			accept: "jank-tab",
// 			canDrop: () => false,
// 			hover({index: hoveredIndex,value: hoveredValue}:{index:number,value:string}) {
// 				console.log("VAL:", hoveredIndex, startingIndex);
                
// 				if (startingIndex !== hoveredIndex) {
//                     const { index } = findTab(value);
// 					const newIndex = moveTab(hoveredValue,index);
//                     // Old index was current
//                     if(index === currentIndex) {
//                         setCurrentIndex(newIndex);
//                     // Other tab was the active tab
//                     } else if (newIndex === currentIndex) {
//                         setCurrentIndex(index);
//                     }
// 				}
// 			},
// 		}),
// 		[findTab, moveTab]
// 	);
    

// 	return (
// 		<TabContainer
// 			style={{
// 				...(
//                     startingIndex === currentIndex ? {
//                         backgroundColor: Theme.current.value.accentColor,
// 					} : {

//                     }
//                 ),
//                 ...(
//                     isDragging ? {
//                         opacity: 0
//                     } : {
//                         opacity: 1
//                     }
//                 )
//             }}
// 			onClick={(event) => {
// 				console.log("CHANGING INDEX:", active, startingIndex, value, currentIndex);
// 				if (event.target instanceof HTMLElement) {
// 					console.log("ELEMENT:", event.target, startingIndex);
// 					if (event.target.getAttribute("preventchange") === "true") {
// 						console.log("NOT CHANGING INDEX");
// 						return;
// 					}
// 					setCurrentIndex(startingIndex);
// 				}
// 			}}
// 			ref={(node) => drag(drop(node))}
// 		>
// 			<TextComponent {...props} />
// 		</TabContainer>
// 	);
// };
