export class History<ENTRY> {
    private _entries: ENTRY[] = [];

    public get entries(): ENTRY[] {
        return [...this._entries];
    }

    public get last(): ENTRY | null {
        if(this._entries.length > 0) {
            return this.entries[this._entries.length-1];
        } else {
            return null;
        }
    }

    constructor(public entryLimit: number) {}

    public push(entry: ENTRY) {
        this._entries.push(entry);
        if(this._entries.length > this.entryLimit) {
            this._entries = this._entries.slice(0,this.entryLimit);
        }
    }

    public remove(index: number) {
        if(index > this._entries.length) {
            throw new Error("Index of " + index + " is out of bounds.")
        } else {
            this._entries = this._entries.slice(0,index).concat(this._entries.slice(index));
        }
    }
    
}