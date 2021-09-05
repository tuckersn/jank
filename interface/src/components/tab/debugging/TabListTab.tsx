import React from "react";
import { createInstance, TabProps } from "../TabManager";
import { TextTab } from "../TextTab";



export const TabListTab: React.FC<TabProps> = ({instance}) => {

    const buttons: {
        text: string,
        componentString: string,
        args?: any
    }[] = [{
        text: "Tab List Tab",
        componentString: "tab-list"
    },
    {
        text: "Text Tab",
        componentString: "text",
        args: {
            text: "Hello from the tab list!"
        }
    },
    {
        text: "Image Tab",
        componentString: "image",
        args: {
            url: "https://media.istockphoto.com/photos/dog-computer-pc-picture-id473499332?k=6&m=473499332&s=170667a&w=0&h=QWcLXXfn9P3mhxkUiamfuCRvscFzmcsyULoXwfqpVXc="
        }
    },
    {
        text: "Terminal Tab",
        componentString: "terminal"
    },
    {
        text: "REPL Tab",
        componentString: "repl"
    }, {
        text: "Text Editor Demo",
        componentString: "text-editor",
        args: {
            value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet tellus ut purus vestibulum finibus. Sed lacinia imperdiet eros, a euismod ligula vehicula ac. Sed at posuere tortor. Duis mi purus, consectetur nec lorem ac, ornare cursus est. Vivamus eget accumsan mi. Vestibulum faucibus euismod ex, sed facilisis turpis. Suspendisse venenatis ligula finibus ante egestas pellentesque. In at augue sit amet felis convallis aliquet quis a metus. Aliquam ultricies libero arcu, fringilla feugiat ante mattis vitae. Proin fermentum id odio ut iaculis. Curabitur a consectetur nisl, quis elementum risus. Praesent sed nulla id eros placerat maximus. Cras ac neque quis mauris sagittis scelerisque. Nullam quis libero et sem vulputate dapibus quis vel libero. Maecenas aliquam, neque at aliquet ultricies, elit felis tincidunt purus, vel condimentum mi nisi et lectus.

            In eget lectus vel metus consequat aliquet vitae id nisi. Fusce mollis, sem sed consectetur vehicula, enim mauris vestibulum sem, sed eleifend augue diam a lacus. Ut pharetra rhoncus suscipit. Nam accumsan sapien in laoreet convallis. Nulla facilisi. Nunc sed nisl libero. Donec iaculis velit at interdum tristique.`
        }
    }];

    return (<div style={{height: "100%", width: "100%"}}>
        {buttons.map((button) => {
            return (<div key={button.text}>
                <button onClick={() => {
                    if(instance.layout) {
                        instance.layout.tabManager.addInstance(createInstance(button.componentString, button.args))
                    } else {
                        throw "No layout for this instance!";
                    }
                }}>
                    {button.text}
                </button>
            </div>);
        })}
    </div>);

    
}
