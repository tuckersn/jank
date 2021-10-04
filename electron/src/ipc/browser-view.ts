import { BrowserViewMessages } from "jank-shared/src/communication/render-ipc";
import { OnEventFunction } from ".";



export const onIPCBrowserViewChannel: OnEventFunction<BrowserViewMessages.RenderMessage> = ({
    event: {
        payload,
        type
    }
}) => {
    switch(type) {
        case 'browser-view-R-spawn':

            break;
        case 'browser-view-R-position':

            break;
    }
};