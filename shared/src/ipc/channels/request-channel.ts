import { nanoid } from "nanoid";

export type Response<EVENTS extends string> = {
    id: string,
    event: EVENTS,
    value: any
}


export type Request<EVENTS extends string> = {
    id: string,
    event: EVENTS,
    value: any,
    res: Function,
    err: Function
}

export type RequestCallBack<EVENTS extends string> = (id: string, value: any) => Promise<Response<EVENTS>>;

export abstract class RequestChannel<EVENTS extends string> {


    private timeout: number = 5000;
    private requests: {[id: string]: Request<EVENTS>} = {};
    
    constructor(public requestTypes: {[event in EVENTS]: RequestCallBack<EVENTS>}) {}

    /** Just send it over the IPC however. */
    protected abstract send(input: Request<EVENTS> | Response<EVENTS>): Promise<void>;
    
    /** Public request method. */
    public async request<OUTPUT>(event: EVENTS, value: any): Promise<Promise<OUTPUT>> {
        const id = nanoid();
        const promise: Promise<OUTPUT> = new Promise((res, err) => {
            this.requests['1' + id] = {
                id,
                event,
                value,
                res,
                err
            };

            this.send(this.requests['0' + id]);

            setTimeout(() => {
                if(id in this.requests) {
                    err('Timed out.');
                    delete this.requests['1' + id];
                }
            }, this.timeout);
        });
        return promise;
    }

    public async receieve(message: Request<EVENTS> & Response<EVENTS>) {
        if(message.id.charAt(0) === '0') {
            this.receieveRequest(message);
        } else if (message.id.charAt(0) === '1') {
            this.receieveResponse(message);
        } else {
            throw "Invalid id prefix! " + message.id.charAt(0);
        }
    }

    /** Resolves our promise and cleans up. */
    protected async receieveResponse(response: {id: string, event: EVENTS, value: any}): Promise<void> {
        if(!(response.id in this.requests)) {
            throw `No pending requests with id of '${response.id}', possibly timedout.`;
        }
        this.requests[response.id].res(this.requests[response.id].value);
        delete this.requests[response.id];
    }

    /** Run the callback for it to be sent as a response. */
    protected async receieveRequest({id, event, value} : {id: string, event: EVENTS, value: any}): Promise<void> {
        if(!(event in this.requestTypes)) {
            throw `No request type of '${event}'!`;
        }
        id = '1' + id.substr(1);
        return this.send(await this.requestTypes[event](id, value));
    }




}
