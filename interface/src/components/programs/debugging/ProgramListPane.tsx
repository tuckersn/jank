import React from "react";
import { Instance} from "../Instances";
import { PaneProps } from "../Panes";
import { Program } from "../Programs";



export const ProgramListPane: React.FC<PaneProps> = ({instance, InstanceRegistry, ProgramRegistry}) => {

    const buttons: {
        instanceId?: string,
        title: string,
        program: Program<any>,
        state?: any,
        meta?: any
    }[] = [{
        title: "Tab List Tab",
        program: ProgramRegistry.get("jank-tab-list")
    },
    {
        title: "Text Tab",
        program: ProgramRegistry.get("jank-text"),
        state: {
            text: "Hello from the tab list!"
        }
    },
    {
        title: "Image Tab",
        program: ProgramRegistry.get("jank-image"),
        state: {
            url: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg"
        }
    },
    {
        title: "Terminal Tab",
        program: ProgramRegistry.get("jank-terminal")
    },
    {
        title: "REPL Tab",
        program: ProgramRegistry.get("jank-repl")
    }, {
        title: "Text Editor Demo",
        program: ProgramRegistry.get("jank-text-editor"),
        state: {
            value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet tellus ut purus vestibulum finibus. Sed lacinia imperdiet eros, a euismod ligula vehicula ac. Sed at posuere tortor. Duis mi purus, consectetur nec lorem ac, ornare cursus est. Vivamus eget accumsan mi. Vestibulum faucibus euismod ex, sed facilisis turpis. Suspendisse venenatis ligula finibus ante egestas pellentesque. In at augue sit amet felis convallis aliquet quis a metus. Aliquam ultricies libero arcu, fringilla feugiat ante mattis vitae. Proin fermentum id odio ut iaculis. Curabitur a consectetur nisl, quis elementum risus. Praesent sed nulla id eros placerat maximus. Cras ac neque quis mauris sagittis scelerisque. Nullam quis libero et sem vulputate dapibus quis vel libero. Maecenas aliquam, neque at aliquet ultricies, elit felis tincidunt purus, vel condimentum mi nisi et lectus.

            In eget lectus vel metus consequat aliquet vitae id nisi. Fusce mollis, sem sed consectetur vehicula, enim mauris vestibulum sem, sed eleifend augue diam a lacus. Ut pharetra rhoncus suscipit. Nam accumsan sapien in laoreet convallis. Nulla facilisi. Nunc sed nisl libero. Donec iaculis velit at interdum tristique.`
        }
    }, {
        title: "FILE BROWSER",
        program: ProgramRegistry.get("jank-file-browser")
    }];

    return (<div style={{height: "100%", width: "100%"}}>
        {buttons.map((button) => {
            return (<div key={button.title}>
                <button onClick={() => {
                    InstanceRegistry.create(button.program, {
                        id: button.instanceId,
                        title: button.title,
                        state: button.state,
                        meta: button.meta
                    });
                }}>
                    {button.title}
                </button>
            </div>);
        })}
    </div>);

    
}
