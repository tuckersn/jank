import React, { useEffect, useRef } from "react";
import { withSize } from "react-sizeme";
import styled from 'styled-components'

const Container = styled.div`
    border: 1px solid red;
    height: 100%;
    width: 100%;
`;


const BrowserViewComponent: React.FC<{
    size: {width: number, height: number},

}> = ({
    size
}) => {

    useEffect(() => {
        console.log("SIZE CHANGE:", size);
    }, [size.height, size.width]);

    return (<Container>
        <div></div>
    </Container>);
};

/**
 * For the sake of keeping things consistent
 * I am thinking of treating BrowserViews as
 * renderers and their window as main in terms
 * of the IPC usage.
 */
export default withSize({
    monitorHeight: true,
    monitorWidth: true
})(BrowserViewComponent);