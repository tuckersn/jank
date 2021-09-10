import { BrowserWindow, IpcMainEvent } from "electron";
import { FrameMessages } from "jank-shared/src/communication/render-ipc";
import { OnEventFunction } from ".";
import { ipcLogger } from "../loggers";


export const onEventFrame: OnEventFunction<FrameMessages.RenderMessages> = ({window, event}) => {
    ipcLogger.info("FRAME ARGS:", event);
    switch(event.type) {
        case 'frame-close':
            window.close();
            break;
        case 'frame-minimize':
            window.minimize();
            break;
        case 'frame-maximize':
            if(window.isMaximized())
                window.unmaximize();
            else
                window.maximize();
        default:
            throw "onMessageFrame - Invalid event type: " + event.type;
    }
}