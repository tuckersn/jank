import { filter, Subject } from "rxjs"



export type Message = {
    type: string,
    payload: Object
}

export module NodeIPC {
    
    const feedSubject = new Subject<any>();
    export const feed = feedSubject.asObservable();
    export const processFeed = feed.pipe(filter((msg) => msg.type === ''));
    process.on('message', (msg, handle) => {
        //TODO: validation maybe?
        feedSubject.next(msg);
    });

    export function send() {

    }
}

