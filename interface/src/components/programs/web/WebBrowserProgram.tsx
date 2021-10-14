
import { nanoid } from "nanoid";
import React, { memo, useEffect, useState } from "react"
import { BehaviorSubject } from "rxjs";
import BrowserView from "../../../common/components/BrowserView";

import { FileBrowserInstanceState } from "../files/FileBrowserProgram";
import { PaneProps } from "../Panes";
import { MinimalProgram } from "../Programs";

import { TabManager } from "../../../common/components/tabs/TabManager"
import { Tab } from "../../../common/components/tabs/Tab"

import WebBrowserStyle from './WebBrowser.module.scss';
import { Theme } from "../../../Theme";
import { MdMenu } from "react-icons/md";

export interface WebBrowserInstanceState {
    location: BehaviorSubject<string>;
}
export interface WebBrowserTabRef {
    key: string
}

const TABS: WebBrowserTabRef[] = (() => {
    const length = 5;
    const output = [];
    for(let i = 0; i < length; i++) {
        output.push({
            key: i.toString()
        });
    }
    return output;
})();

const NAV_BAR_HEIGHT = 32;

export const WebBrowserPane: React.FC<PaneProps<WebBrowserInstanceState>> = () => {
    
    const [tabs, setTabs] = useState<WebBrowserTabRef[]>(Object.values(TABS));
    const [currentTab, setCurrentTab] = useState<string>();
    const [activeKey] = useState(new BehaviorSubject(''));


    useEffect(() => {
        const activeSub = activeKey.subscribe((key) => {
            setCurrentTab(key);
        });
        return () => {
            activeSub.unsubscribe();
        }
    }, []);
    
    
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    }}>
        
        <div className={WebBrowserStyle.content}>
           
            <div style={{
                display: "flex",
                flexDirection: "row"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "auto",
                    width: NAV_BAR_HEIGHT + "px",
                    height: NAV_BAR_HEIGHT + "px",
                    border: `1px solid ${Theme.current.value.accentColorDark}`,
                    boxSizing: "border-box",
                    backgroundColor: `rgba(${Theme.current.value.baseColorExtremelyDark})`
                }}>
                    <MdMenu/>
                </div>
                <TabManager list={tabs} setList={setTabs} activeKey={activeKey} style={{
                    height: NAV_BAR_HEIGHT + "px"
                }}>

                </TabManager>
            </div>
            
            <h1>this is a feed of the selected tab in the parent component {currentTab}</h1>
        </div>
        <div className={WebBrowserStyle.toolbar}>
            NAV BAR HERE
            <button onClick={() => {
                setTabs([...tabs, {
                    key: nanoid()
                }]);
            }}>
                +
            </button>
            <button onClick={() => {
                console.log("TABS:", tabs);
                setTabs([...tabs.sort((a,b) => {
                    if(Math.random() > 0.5) {
                        return -1;
                    } else {
                        return 1;
                    }
                })]);

                // Randomly mix the array
                setTabs([...tabs.sort(() => Math.random() > 0.5 ? 1 : -1)]);
            }}>
                RE
            </button>
        </div>
    </div>;
};

export const WebBrowserProgram: MinimalProgram<WebBrowserInstanceState> = {
    uniqueName: 'jank-file-browser',
    component: WebBrowserPane,
    instanceInit: (instance) => {
        console.log("WEB BROWSER INSTANCE:", instance);
        if(instance.state === undefined) {
            throw new Error('State is required.');
        } else {
            if(instance.state.location instanceof BehaviorSubject) {
                if(typeof instance.state.location.value !== 'string') {
                    throw new Error('location must be a BehaviorSubject<string>');
                }
            } else {
                throw new Error('location must be a BehaviorSubject<string>');
            }
        }

        

        return instance as Required<typeof instance>;;
    },
    state: {}
};