
import { nanoid } from "nanoid";
import React, { memo, useEffect, useState } from "react"
import { BehaviorSubject, filter, first, map, Observable, Subscription } from "rxjs";
import BrowserView, { spawnBrowserView } from "../../../common/components/BrowserView";

import { FileBrowserInstanceState } from "../files/FileBrowserProgram";
import { PaneProps } from "../Panes";
import { MinimalProgram } from "../Programs";

import { TabManager } from "../../../common/components/tabs/TabManager"
import { Tab, TabProps } from "../../../common/components/tabs/Tab"

import WebBrowserStyle from './WebBrowser.module.scss';
import { Theme } from "../../../Theme";
import { MdAdd, MdArrowBack, MdArrowForward, MdBookmark, MdClose, MdDeveloperMode, MdMenu, MdRefresh } from "react-icons/md";
import { useBehaviorSubject } from "../../../common/hooks";
import { ElectronShim } from "../../../common/shims/electron";
import { BrowserViewMessages } from "jank-shared/dist/communication/render-ipc";
import { ValueOf } from "type-fest";
import { useObservable } from "../../../common/hooks/RXJS";



export interface WebBrowserTab {
    key: string;
    navigate?: (location: string) => void,
    tabState?: BehaviorSubject<{
        sub: Subscription,
        title: string
    }>;
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

    
    console.log("DATA:", tabState, title, item.key);
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
    const [menu, setMenu] = useState(false);
    const [tabs, setTabsInternal] = useState<WebBrowserTab[]>([]);
    const [currentTab, setCurrentTab] = useState<string>();
    const [activeKey] = useState(new BehaviorSubject(''));
    const [location, setLocation] = useBehaviorSubject(instance.state.location);
    const [locationField, setLocationField] = useState('');

    const [optionsOpen, setOptionsOpen] = useState(false);

    function setTabs(tabs: WebBrowserTab[]) {
        instance.state.tabs.next(tabs);
    }

    function navigate(location: string) {
        if(/^(http(s|)|file):\/\//im.test(location)) {
            // Is valid URL, go to it.
            //TODO: validation
            setLocation(location);
        } else if(/^[A-Z]+(\.[A-Z]+|)(:[0-9]+|)$/im.test(location)) {
            // Valid domain, single word, with or without a port listed.
            //TODO: validation
            setLocation(`http://${location}`);
        } else {
            //TODO: validation
            setLocation(SEARCH_ENGINE + location);
        }
    }

    async function addTab(switchTo: boolean): Promise<string> {
        const key = nanoid();
        await spawnBrowserView(key);

        const tabState: WebBrowserTab['tabState'] = new BehaviorSubject({
            title: '[unnamed tab]',
            sub: navigationMessages.subscribe(({msg}) => {
                if(msg.type === 'browser-view-M-navigated') {
                    if(msg.payload.id === key) {
                        tabState!.next({
                            ...tabState!.value,
                            title: msg.payload.title
                        });
                    }
                } else {
                    
                }
            })
        })

        setTabsInternal([...tabs, {
            key: key,
            navigate,
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
                setLocation(location);
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
                    TESTING
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