export type ProcessEvent = (
    /*
        Render to Main
    */
    {
        event: 'stdin',
        id: string,
        data: string
    } |
    {
        event: 'spawn',
        id: string,
        path: string
    } |
    /*
        Main to Render
    */
   {
       event: 'stdout',
       id: string,
       data: string
   } |
   {
       event: 'stderr',
       id: string,
       data: string
   }
)