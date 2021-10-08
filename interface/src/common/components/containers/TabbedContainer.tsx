import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
`;


export const TabbedContainer: React.FC<{}> = ({
    children
}) => {

    useEffect(() => {
        console.log("CONTAINER CHILD:", children);
    }, [])

    return <Container>
        <div>Hello World</div>
    </Container>
}