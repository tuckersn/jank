
import { nanoid } from "nanoid";
import React, { memo, useEffect, useState } from "react"
import { BehaviorSubject, filter, first, Observable, Subscription } from "rxjs";
import BrowserView, { spawnBrowserView } from "../../../common/components/BrowserView";

import { FileBrowserInstanceState } from "../files/FileBrowserProgram";
import { PaneProps } from "../Panes";
import { MinimalProgram } from "../Programs";

import { TabManager } from "../../../common/components/tabs/TabManager"
import { Tab, TabProps } from "../../../common/components/tabs/Tab"

import WebBrowserStyle from './WebBrowser.module.scss';
import { Theme } from "../../../Theme";
import { MdMenu } from "react-icons/md";
import { useBehaviorSubject } from "../../../common/hooks";
import { ElectronShim } from "../../../common/shims/electron";
import { BrowserViewMessages } from "jank-shared/dist/communication/render-ipc";
import { ValueOf } from "type-fest";



export interface WebBrowserTab {
    key: string
}
export interface WebBrowserInstanceState {
    location: BehaviorSubject<string>;
    tabs: BehaviorSubject<WebBrowserTab[]>,
}


const tabData = new BehaviorSubject<{[key: string]: {
    title: string,
    sub: Subscription
}}>({});


const WebBrowserTab: React.FC<TabProps> = ({
    item,
    index,
    remove
}) => {

    const [data] = useBehaviorSubject(tabData);

    console.log("DATA:", data);
    
    return <div>
        {/* <div>
            {index} - {item.key}
        </div> */}
        <div>
            {data[item.key].title}
        </div>
        <div onClick={() => {
            remove(index);
        }} {...{
            preventchange: "true"
        }}>
            x
        </div>
    </div>
};

const navigationMessages = ElectronShim.browserViewMessages.pipe(filter(({msg}) => msg.type === 'browser-view-M-navigated')) as ElectronShim.IpcObservable<BrowserViewMessages.MNavigated>;


const NAV_BAR_HEIGHT = 38;
export const WebBrowserPane: React.FC<PaneProps<WebBrowserInstanceState>> = ({
    instance
}) => {
    const [menu, setMenu] = useState(false);
    const [tabs, setTabsInternal] = useState<WebBrowserTab[]>([]);
    const [currentTab, setCurrentTab] = useState<string>();
    const [activeKey] = useState(new BehaviorSubject(''));
    const [location, setLocation] = useBehaviorSubject(instance.state.location);
    const [locationField, setLocationField] = useState('');


    function setTabs(tabs: WebBrowserTab[]) {
        instance.state.tabs.next(tabs);
    }

    async function addTab(switchTo: boolean): Promise<string> {
        const key = nanoid();
        await spawnBrowserView(key);


        //TODO fix this type.
        const data: any = {};
        data[key] = {
            title: '[unnamed tab]',
            sub: navigationMessages.subscribe(({msg}) => {
                if(msg.type === 'browser-view-M-navigated') {
                    //TODO fix this type.
                    const data: any = {};
                    data[key] = {
                        title: msg.payload.title
                    };
                    tabData.next({
                        ...tabData.value,
                        ...data
                    });
                } else {
                    
                }
            })
        }
        tabData.next({...tabData.value, ...data});

      

        setTabsInternal([...tabs, {
            key: key
        }]);
        if(switchTo) {
            activeKey.next(key)
        }
        return key;
    }

    useEffect(() => {
        if(location !== locationField) {
            setLocationField(location);
        }
    }, [location]);

    useEffect(() => {
        const activeSub = activeKey.subscribe((key) => {
            setCurrentTab(key);
        });
        const instanceTabsSub = instance.state.tabs.subscribe((tabs) => {
            setTabsInternal(tabs);
        })

        const {tabs} = instance.state;
        if(tabs.value.length < 1) {
            addTab(true);
        } else if(activeKey.value === '') {
            activeKey.next(tabs.value[0].key);
        }

        return () => {
            activeSub.unsubscribe();
            instanceTabsSub.unsubscribe();
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
                }} onClick={() => {
                    addTab(true);
                }}>
                    <MdMenu/>
                </div>
                <TabManager
                    tabs={tabs}
                    setTabs={setTabs}
                    activeKey={activeKey}
                    customTabComponent={WebBrowserTab}
                    style={{
                        height: NAV_BAR_HEIGHT + "px"
                    }}
                    
                >
                </TabManager>

            </div>
        </div>
        <div style={{
            display: 'flex',
            width: '100%'
        }}>
            <button>
                back
            </button>
            <button>
                forward
            </button>
            <button onClick={(event) => {
                setLocation(location);
            }}>
                refresh
            </button>
            <input
                type="text"
                value={locationField}
                onChange={event => {
                    setLocationField(event.target.value);
                }}
                onKeyDown={(event) => {
                    if(event.key === 'Enter') {
                        setLocation(locationField);
                    }
                }}
                style={{
                    height: '100%',
                    flex: 1
                }}
            />
            <button>
                bookmark
            </button>
            <button>
                dev tools
            </button>
        </div>
        <div style={{
            flex: 1,
            backgroundColor: "white"
        }}>
            <BrowserView locationSubject={instance.state.location} key={currentTab} id={activeKey} delayBeforeDetach={500}  hide/>
        </div>
        {/* <div className={WebBrowserStyle.toolbar}>
            NAV BAR HERE - {location}
            <button onClick={() => {
                addTab(true);
            }}>
                +
            </button>
            <button onClick={() => {
                console.log("TABS:", tabs);
                setTabsInternal([...tabs.sort((a,b) => {
                    if(Math.random() > 0.5) {
                        return -1;
                    } else {
                        return 1;
                    }
                })]);

                // Randomly mix the array
                setTabsInternal([...tabs.sort(() => Math.random() > 0.5 ? 1 : -1)]);
            }}>
                RE
            </button>
        </div> */}
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

        instance.state.tabs = new BehaviorSubject<WebBrowserInstanceState['tabs']['_value']>([]);

        

        return instance as Required<typeof instance>;;
    },
    state: {}
};