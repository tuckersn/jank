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
