
import { nanoid } from "nanoid";
import React, { memo, useEffect, useState } from "react"
import { BehaviorSubject, filter, first, map, Observable, Subscription } from "rxjs";
import BrowserView, { spawnBrowserView } from "../../common/components/BrowserView";

import { FileBrowserInstanceState } from "../files/FileBrowserProgram";
import { PaneProps } from "@janktools/ui-framework/dist/Panes";
import { MinimalProgram, ProgramRegistry } from "@janktools/ui-framework/dist/Programs";

import { TabManager } from "../../common/components/tabs/TabManager"
import { Tab, TabProps } from "../../common/components/tabs/Tab"

//@ts-ignore
import WebBrowserStyle from './WebBrowser.module.scss';
import { Theme } from "../../Theme";
import { MdAdd, MdArrowBack, MdArrowForward, MdBookmark, MdClose, MdDeveloperMode, MdMenu, MdRefresh } from "react-icons/md";
import { useBehaviorSubject } from "../../common/hooks";
import { ElectronShim, ipcRenderer } from "../../common/shims/electron";
import { BrowserViewMessages } from "@janktools/shared/dist/communication/render-ipc";
import { ValueOf } from "type-fest";
import { useObservable } from "../../common/hooks/RXJS";
import { Slider } from "../../common/components";
import { InstanceRegistry } from "@janktools/ui-framework/dist/Instances";


export interface WebBrowserTabState {
    sub: Subscription,
    location: string,
    title: string,
    history: string[]
};

export interface WebBrowserTab {
    key: string;
    navigate?: (location: string) => void,
    tabState?: BehaviorSubject<WebBrowserTabState>;
}
export interface WebBrowserInstanceState {
    location: BehaviorSubject<string>;
    tabs: BehaviorSubject<WebBrowserTab[]>;
}


const navigationMessages = ElectronShim.browserViewMessages.pipe(filter(({msg}) => msg.type === 'browser-view-M-navigated')) as ElectronShim.IpcObservable<BrowserViewMessages.MNavigated>;
const NAV_BAR_HEIGHT = 32;
//TODO: make this a setting.
const SEARCH_ENGINE = 'https://www.google.com/search?q=';



const WebBrowserTab: React.FC<TabProps> = ({
    item,
    index,
    remove
}) => {

    const tabState = useObservable((item as Required<WebBrowserTab>).tabState);
    const [title, setTitle] = useState('[unnamed tab]');

    useEffect(() => {
        if(tabState) {
            if(tabState.title !== title) {
                setTitle(tabState.title);
            }
        }
    }, [tabState]);
    
    return <div style={{
        fontSize: (NAV_BAR_HEIGHT * 0.45)  + "px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '1px',
        paddingLeft: '8px',
        paddingRight: '8px',
        height: '100%'

    }}>
        {/* <div>
            {index} - {item.key}
        </div> */}
        <div style={{
            verticalAlign: "middle",
            wordWrap: 'break-word',
            marginTop: -4 + "px"
        }}>
            {title}
        </div>
        <MdClose onClick={() => {
            remove(index);
        }} style={{
                     
        }} {...{
            preventchange: "true"
        }}/>
    </div>
};


export const WebBrowserPane: React.FC<PaneProps<WebBrowserInstanceState>> = ({
    instance
}) => {
    console.log("INTS:", instance);
    const [menu, setMenu] = useState(false);
    const [tabs, setTabs] = useBehaviorSubject<WebBrowserTab[]>(instance.state.tabs);
    const [currentTab, setCurrentTab] = useState<string>();
    const [activeKey] = useState(new BehaviorSubject(''));
    const [location, setLocation] = useBehaviorSubject(instance.state.location);
    const [locationField, setLocationField] = useState('');

    const [optionsOpen, setOptionsOpen] = useState(false);


    function navigate(location: string, locationSetter: (location: string) => void = setLocation) {
        if(/^(http(s|)|file):\/\//im.test(location)) {
            // Is valid URL, go to it.
            //TODO: validation
            locationSetter(location);
        } else if(/^[A-Z]+(\.[A-Z]+|)(:[0-9]+|)$/im.test(location)) {
            // Valid domain, single word, with or without a port listed.
            //TODO: validation
            locationSetter(`http://${location}`);
        } else {
            //TODO: validation
            locationSetter(SEARCH_ENGINE + location);
        }
    }

    function refresh() {
        setLocation(location);
    }


    async function addTab(switchTo: boolean): Promise<string> {
        const key = nanoid();
        await spawnBrowserView(key);

        const tabState: BehaviorSubject<WebBrowserTabState> = new BehaviorSubject<WebBrowserTabState>({
            title: '[unnamed tab]',
            location: 'https://google.com',
            sub: navigationMessages.subscribe(({msg}) => {
                if(msg.type === 'browser-view-M-navigated') {
                    if(msg.payload.id === key) {
                        tabState!.next({
                            ...tabState!.value,
                            title: msg.payload.title,
                            location: msg.payload.url
                        });
                    }
                } else {
                    
                }
            }),
            history: []
        });

        setTabs([...tabs, {
            key: key,
            navigate: (location) => {
                navigate(location, (location) => {
                    tabState.next({
                        ...tabState.value,
                        location
                    })
                });
            },
            tabState
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
        //TODO: do this in O(n) time.
        if(tabs) {
            for(let tab of tabs) {
                if(tab.key === currentTab) {
                    if(tab.tabState?.value.location) {
                        setLocation(tab.tabState.value.location);
                    }
                    break;
                }
            }
        }
    }, [currentTab]);

    useEffect(() => {
        const activeSub = activeKey.subscribe((key) => {
            setCurrentTab(key);
        });

        const {tabs} = instance.state;
        if(tabs.value.length < 1) {
            addTab(true);
        } else if(activeKey.value === '') {
            activeKey.next(tabs.value[0].key);
        }

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
                }} onClick={() => {
                    setOptionsOpen(!optionsOpen);
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
                    <MdAdd/>
                </div>

            </div>
        </div>
        <div style={{
            display: 'flex',
            width: '100%'
        }}>
            <button>
                <MdArrowBack/>
            </button>
            <button>
                <MdArrowForward/>
            </button>
            <button onClick={(event) => {
                refresh();
            }}>
                <MdRefresh/>
            </button>
            <input
                type="text"
                value={locationField}
                onChange={event => {
                    setLocationField(event.target.value);
                }}
                onKeyDown={(event) => {
                    if(event.key === 'Enter') {
                        navigate(locationField);
                    }
                }}
                style={{
                    height: '100%',
                    flex: 1,
                    backgroundColor: `rgba(${Theme.current.value.baseColorExtremelyDark})`
                }}
            />
            <button>
                <MdBookmark/>
            </button>
            <button>
                <MdDeveloperMode/>
            </button>
        </div>
        <div style={{
            flex: 1,
            backgroundColor: "white",
            display: 'flex'
        }}>
            { optionsOpen ? 
                //TODO: this should be resizable.
                <div style={{
                    width: '200px',
                    background: `rgba(${Theme.current.value.baseColorDark})`,
                    boxSizing: "border-box",
                    borderRight: `2px solid rgba(${Theme.current.value.borderColor})`
                }}>
                    <Slider min={10} max={500} onValue={(value) => {
                        console.log("VAL:", value);
                        return value;
                    }}/>
                </div> 
            : '' }
            <div style={{
                flex: 1
            }}>
                <BrowserView locationSubject={instance.state.location} key={currentTab} id={activeKey} delayBeforeDetach={500}  hide/>
            </div>
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
    uniqueName: 'jank-web-browser',
    component: WebBrowserPane,
    instanceInit: (instance) => {
        console.log("WEB BROWSER INSTANCE:", instance);
        return {
            actions: {},
            serialize: () => {
                return {
                };
            },
            state: {
                location: new BehaviorSubject<string>(''),
                tabs: new BehaviorSubject<WebBrowserInstanceState['tabs']['_value']>([])
            },
            destroy: () => {

            },
            ...instance
        };
    },
    state: {},
    deserialize: (serialized) => {
        return InstanceRegistry.create<WebBrowserInstanceState>('jank-web-browser', {
            id: nanoid(),
            destroy: () => {},
            serialize: () => ({})
        });
    }
};