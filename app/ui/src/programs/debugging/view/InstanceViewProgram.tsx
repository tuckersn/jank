import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Instance, InstanceRegistry } from "@janktools/ui-framework/dist/Instances";


const InstanceViewContainer = styled.div``;

export const InstanceViewProgram: React.FC<{
    instanceId: string
}> = ({
    instanceId
}) => {

    const [instance, setInstance] = useState<Instance>();

    useEffect(() => {
        const instance = InstanceRegistry.get(instanceId);
        if(instance) {
            if(instance.programName === 'jank-instance-view')
            setInstance(instance);
        } else {
            throw new Error("Invalid instance id: " + instanceId);
        }
    }, []);

    return (<InstanceViewContainer>
        {
            instance === undefined ? <div>
                Loading...
            </div> : <div>
                <h5>{instance.id}{instance.name ? '-' + instance.name : ''}</h5>
                <div>
                    {instance.programName}<br/>
                    {instance.title}<br/>
                    {JSON.stringify(instance.state, null, 4)}<br/>
                    {JSON.stringify(instance.serialize, null, 4)}<br/>
                    {instance.iconImg.value}<br/>
                </div>
            </div>
        }
    </InstanceViewContainer>);
};