import { BrowserWindow, IpcMainEvent } from "electron";
import { FrameMessages } from "@janktools/shared/src/communication/render-ipc";
import { OnIpcEventFunction } from ".";
import { ipcLogger } from "../loggers";


export const onEventFrame: OnIpcEventFunction<FrameMessages.RenderMessages> = ({
    window: {
        browserWindow
    }, event}) => {
    ipcLogger.info("FRAME ARGS:", event);
    switch(event.type) {
        case 'frame-R-close':
            browserWindow.close();
            break;
        case 'frame-R-minimize':
            browserWindow.minimize();
            break;
        case 'frame-R-maximize':
            if(browserWindow.isMaximized())
                browserWindow.unmaximize();
            else
                browserWindow.maximize();
            break;
        default:
            throw "onMessageFrame - Invalid event type: " + ('type' in event ? event['type'] : event);
    }
}