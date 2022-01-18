import { Observable } from "rxjs";
import { Promisable } from "type-fest";
import { path } from "../shims/node";

export interface File<VALUE = any, META = any> {
    /**
     * Category of file, such as a directory,
     * or an image. This is mostly a high level description
     * such as 'image' or 'directory' or 'text'.
     * 
     * Common fileTypes are:
     */
    fileType: string,
    /**
     * This is critical and should be verified, later this will be
     * apart of a registry. This is exactly what this file is, is it
     * a valid sanitized PNG or is it a txt file, etc.
     * 
     * Ex: 'png', 'txt', 'ts', 'tsx', etc
     */
    fileExtension?: string,


    name: string,
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
}

export interface ImageFile<META=any> extends File<string, META> {
    fileType: 'image',
    /**
     * THIS IS TEMPORARY
     * 
     * Is this a file that can be reliably displayed if read.
     */
    trusted?: boolean,
}




export function getFileExtension(file: File): string {
    if(file.name.includes('.')) {
    
    }
    return ''; 
}

export function getFileExtensionByLocation(file: File): string {
    return '';
}