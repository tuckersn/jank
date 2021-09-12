export module ProcessManagerWS {

    export function split(text: string) {
        let starting = text.substring(0,15);
        let index = starting.indexOf(":");
        if(index === -1)
            console.log("Malformed message from WebSocket:", text);
        return {
            starting: starting.substring(0, index),
            data: text.substring(index + 1)
        };
    }
    
}