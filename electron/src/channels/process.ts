import { OnEventFunction } from "."
import { ProcessEvent } from "jank-shared/src/ipc";

export interface Process {
    id: string,
    command: string
}

const processes: {[processId: string]: Process} = {};

export const onEventProcess: OnEventFunction<ProcessEvent> = async ({window, event}) => {
    switch(event.event) {
        case "spawn":
            if(event.id in processes)
                throw "Duplicate process!";
        case "stdin":
        default:
            throw "Invalid event ttype in onVe"
    }
}