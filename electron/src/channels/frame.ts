import { BrowserWindow, IpcMainEvent } from "electron";
import { FrameEvent } from "jank-shared/src/ipc";
import { OnEventFunction } from ".";
import { ipcLogger } from "../loggers";


export const onEventFrame: OnEventFunction<FrameEvent> = ({window, event}) => {
    ipcLogger.info("FRAME ARGS:", event);
    switch(event.event) {
        case "close":
            window.close();
            break;
        case "minimize":
            window.minimize();
            break;
        case "maximize":
            if(window.isMaximized())
                window.unmaximize();
            else
                window.maximize();
        default:
            throw "onMessageFrame - Invalid event type: " + event.event;
    }
}