import { Observable } from "rxjs";
import { Promisable } from "type-fest";

export interface File<VALUE = any, META = any> {
    fileType: string,
    location: string,
    breadcrumbs: {crumb: string, path: string}[],

    get: () => Promisable<VALUE>,
    set: (data: VALUE) => Promisable<void>,

    observable?: () => Observable<VALUE>

    meta?: META,
    created?: Date,
    lastModified?: Date,
    size?: number,
    owner?: string,
}


export interface DirectoryFile<META=any> extends File<File[],META> {
    fileType: 'directory',
    observable?: undefined
}
