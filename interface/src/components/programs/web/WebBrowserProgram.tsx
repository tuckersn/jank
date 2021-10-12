
import { nanoid } from "nanoid";
import React, { memo, useEffect, useState } from "react"
import { BehaviorSubject } from "rxjs";
import BrowserView from "../../../common/components/BrowserView";
import { Tab, TabbedContainer } from "../../../common/components/containers/TabbedContainer";
import { DefaultTab, DefaultTabTextComponent } from "../../../common/components/DefaultTab";
import { Tabs } from "../../../common/components/Tabs";
import { FileBrowserInstanceState } from "../files/FileBrowserProgram";
import { PaneProps } from "../Panes";
import { MinimalProgram } from "../Programs";

import WebBrowserStyle from './WebBrowser.module.scss';

export interface WebBrowserInstanceState {
    location: BehaviorSubject<string>;
}

const BrowserTabComponent: Tab['component'] = ({
    key
}) => {
    const [counter,setCounter] = useState(0);
    return <div>
        New div: {key} <button onClick={() => {
            setCounter(counter + 1);
        }}>
            {counter}
        </button>
    </div>;
}


const TABS: Record<string, Tab> = {
    "0": {
        id: "0",
        component: ({tab}) => {
            return <div>{tab.id}</div>
        },
    },
    "1": {
        id: "1",
        component: ({tab}) => {
            return <div>{tab.id}</div>
        }
    },
    "2": {
        id: "2",
        component: ({tab}) => {
            return <div>{tab.id}</div>
        }
    }
}

export const WebBrowserPane: React.FC<PaneProps<WebBrowserInstanceState>> = () => {
    
    const [tabs, setTabs] = useState<Tab[]>(Object.values(TABS));
    const [currentTab, setCurrentTab] = useState<string>();

    const [tabList, setTabList] = useState<string[]>(['0','1','2','3','4','5','6']);
    const [index] = useState(new BehaviorSubject({
        index: -1,
        list: tabList
    }));



    useEffect(() => {
        index.subscribe(({index: currentIndex,list}) => {
            //console.log("SELECTED INDEX:", currentIndex, index.value.list[index.value.index]);
            setCurrentTab(index.value.list[index.value.index]);
        })    
    }, [])



    
    
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    }}>
        <div className={WebBrowserStyle.toolbar}>
            NAV BAR HERE
            <button onClick={() => {
                setTabList([...tabList, nanoid()]);
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

                
                setTabList([...tabList.sort((a,b) => {
                    if(Math.random() > 0.5) {
                        return -1;
                    }
                    return 1;
                })]);

            }}>
                RE
            </button>
        </div>
        <div className={WebBrowserStyle.content}>
            
            <Tabs list={tabList} setList={setTabList} index={index} TabComponent={DefaultTab} TextComponent={DefaultTabTextComponent}/>
            {/* <TabbedContainer tabs={tabs}>   
            </TabbedContainer>
            <BrowserView></BrowserView> */}

            <h1>this is a feed of the selected tab in the parent component {currentTab}</h1>
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