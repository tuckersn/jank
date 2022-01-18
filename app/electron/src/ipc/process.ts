import { OnIpcEventFunction } from "."
import { ProcessMessages } from "@janktools/shared/src/communication/render-ipc";
import ProcessManager from "../process-manager";


export const onEventProcess: OnIpcEventFunction<ProcessMessages.RenderMessages> = async ({window: window, event}) => {
    switch(event.type) {
        case 'process-R-spawn':
            ProcessManager.spawnProcess(event.payload.command, {
                requestId: event.payload.requestId
            });
            return;
        default:
            throw new Error("Invalid event type");
    }
}