import { OnEventFunction } from "."
import { ProcessMessages } from "jank-shared/src/communication/render-ipc";
import ProcessManager from "../process-manager";


export const onEventProcess: OnEventFunction<ProcessMessages.RenderMessages> = async ({window, event}) => {
    switch(event.type) {
        case 'process-spawn':
            ProcessManager.spawnProcess(event.payload.command, {
                request_id: event.payload.request_id
            });
            return;
        default:
            throw new Error("Invalid event type");
    }
}