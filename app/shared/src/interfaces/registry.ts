export interface IRegistry<ITEM> {
    register(id: string, item: ITEM): any;
    delete(id: string): any;
    get(id: string): any;
}