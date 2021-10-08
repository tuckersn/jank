
import React from "react"
import { BehaviorSubject } from "rxjs";
import BrowserView from "../../../common/components/BrowserView";
import { TabbedContainer } from "../../../common/components/containers/TabbedContainer";
import { FileBrowserInstanceState } from "../files/FileBrowserProgram";
import { PaneProps } from "../Panes";
import { MinimalProgram } from "../Programs";

import WebBrowserStyle from './WebBrowser.module.scss';

export interface WebBrowserInstanceState {
    location: BehaviorSubject<string>;
}

export const WebBrowserPane: React.FC<PaneProps<WebBrowserInstanceState>> = () => {
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    }}>
        <div className={WebBrowserStyle.toolbar}>
            NAV BAR HERE
        </div>
        <div className={WebBrowserStyle.content}>
            <TabbedContainer>
                <h1>Test</h1>
                <h1>Test 2</h1>
            </TabbedContainer>
            {/* <BrowserView></BrowserView> */}
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
                    throw new Error('location must be a BeahviorSubject<string>');
                }
            } else {
                throw new Error('location must be a BeahviorSubject<string>');
            }
        }

        

        return instance as Required<typeof instance>;;
    },
    state: {}
};