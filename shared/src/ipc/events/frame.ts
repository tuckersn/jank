export type FrameEvent = (
    /*
        Render to Main
    */
    {
        event: 'close'
    } | {
        event: 'minimize'
    } | {
        event: 'maximize'
    } |
    
    
    /*
        Main to Render
    */
    {
        event: 'maximization',
        maximized: boolean
    }
);