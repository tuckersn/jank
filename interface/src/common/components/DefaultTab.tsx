import React, { JSXElementConstructor, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { BehaviorSubject } from "rxjs";
import { Theme } from "../../Theme";
import { TabProps } from "./Tabs";


export type  TextComponentProps = TabProps & {
    highlight: boolean,
    setHighlight: (highlight: boolean) => void,
};

export const DefaultTabTextContainer = styled.div`
	display: flex;
	flex-direction: row;
    flex: 1 1 auto;
	width: 100%;
	height: 100%;
`;

export const DefaultTabTextComponent = ({ startingIndex: index, value, destroy }: TextComponentProps) => {
	return (
		<DefaultTabTextContainer>
			<div style={{
                float: "left"
            }}>{value.length > 20 ? value.slice(0, 17) + "..." : value}</div>
			{destroy ? (
				<div
					style={{
						alignSelf: "flex-end",
						marginLeft: "auto",
                        float: "right"
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






const TabContainer = styled.div`
    display: inline-block;
	box-sizing: border-box;
    overflow: hidden;

	min-width: 100px;
    height: 100%;

	/* border-top: 1px solid white; */
	border-left: 1px solid white;
	border-right: 1px solid white;

    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 8px;
    padding-right: 8px;
`;



export const DefaultTab: React.FC<TabProps<{
    currentHoveredIndex: BehaviorSubject<number>
}>> = function DefaultTab(props) {
    const { data, setData, currentIndex, tabList, setCurrentIndex, startingIndex, value, findTab, moveTab, moveTabIndex, TextComponent } = props;
    const [highlight, setHighlight] = useState(false);

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
                
                const { index } = findTab(value);
                console.log("DROP:",data.currentHoveredIndex, index);
                //const newIndex = moveTab(value, droppedIndex);
                const newIndex = moveTabIndex(index, data?.currentHoveredIndex.value === -1 ? index : data?.currentHoveredIndex.value);
                // Old index was current
                if(index === currentIndex) {
                    setCurrentIndex(newIndex);
                // Other tab was the active tab
                } else if (newIndex === currentIndex) {
                    setCurrentIndex(index);
                }
                data?.currentHoveredIndex.next(-1);
            }
            setHighlight(false);
        },
    }), [value, startingIndex, moveTab]);

   
    const [, drop] = useDrop(
        () => ({
            accept: "jank-tab",
            canDrop: () => false,
            hover({index: hoveredIndex,value: hoveredValue}:{index:number,value:string}, monitor) {
                
                
            

                if (startingIndex !== hoveredIndex) {

                    setHighlight(true);
                    const { index } = findTab(value);
                    data?.currentHoveredIndex.next(index);
                    
                    // const { index } = findTab(value);
                    // const newIndex = moveTab(hoveredValue,index);
                    // // Old index was current
                    // if(index === currentIndex) {
                    //     setCurrentIndex(newIndex);
                    // // Other tab was the active tab
                    // } else if (newIndex === currentIndex) {
                    //     setCurrentIndex(index);
                    // }
                    
                    console.log(hoveredIndex, index);
               
                    if(data) {
                        const sub = data?.currentHoveredIndex.subscribe(() => {
                            if(!monitor.isOver()) {
                                setHighlight(false);
                                setTimeout(() => {
                                    sub.unsubscribe();
                                }, 10);
                            }
                        });
                    }
                } 


                
            },

        }),
        [findTab, moveTab]
    );

    useEffect(() => {
        if(data === null) {
            setData({
                currentHoveredIndex: new BehaviorSubject(-1)
            })
        }
    }, []);

    useEffect(() => {
        setHighlight(false);
    }, [currentIndex, ]);

    useEffect(() => {
        setHighlight(false);
    }, [tabList]);

    const TextComponentTag = useMemo(() => {
        return TextComponent || DefaultTabTextComponent;
    },[TextComponent]);

    return (
        <TabContainer
            style={{
                backgroundColor: `rgba(${Theme.current.value.baseColorVeryDark})`,
                ...(
                    startingIndex === currentIndex ? {
                        backgroundColor: Theme.current.value.accentColor,
                    } : {}
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
                        backgroundColor: `rgba(${Theme.current.value.highVeryLight})`,
                        color: `rgba(${Theme.current.value.baseColorDark})`
                    } : {}
                )
            }}
            onClick={(event) => {
                console.log("CHANGING INDEX:", startingIndex, value, currentIndex);
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
