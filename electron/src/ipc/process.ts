import { OnEventFunction } from "."
import { ProcessEvent } from "jank-shared/src/ipc";


export const onEventProcess: OnEventFunction<ProcessEvent> = async ({window, event}) => {
    switch(event.event) {
        case "spawn":
            console.log("I WAS ASKED TO SPAWN A PROCESS:", event);
        case "stdin":
        default:
            throw "Invalid event ttype in onVe"
    }
}