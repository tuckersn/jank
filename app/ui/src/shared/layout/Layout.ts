export class Layout {
    static active?: Layout; 

    constructor() {
        Layout.active = this;
    }

}


export function useLayout({} : {}): Layout {
    
    return Layout;
}