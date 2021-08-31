import { Request, RequestCallBack, RequestChannel, Response } from "./request-channel";

export class IPCRequestChannel<EVENTS extends string> extends RequestChannel<EVENTS> {
    constructor(public send: (input: Request<any> | Response<any>) => Promise<void>, requestTypes: {[event in EVENTS]: RequestCallBack<EVENTS>}) {
        super(requestTypes);
    }
}