import { TableInstance as ReactTableTableInstance, UsePaginationInstanceProps, UseResizeColumnsColumnProps } from "react-table";

export type TableInstance<DATA extends Object = any> = ReactTableTableInstance<DATA>;
export type TableInstanceWithPagination<DATA extends Object = any> = TableInstance<DATA> & UsePaginationInstanceProps<DATA>;
export type TableInstanceWithResize<DATA extends Object = any> = TableInstance<DATA> & UseResizeColumnsColumnProps<DATA>;
export type TableInstanceAll<DATA extends Object = any> = TableInstanceWithPagination<DATA> & TableInstanceWithResize<DATA>;