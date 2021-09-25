import {  DirectoryFile, File } from "../interfaces/files";
import { fs, path } from "./node";


const ZERO_DATE: Readonly<Date> = new Date(0);


export function isFile(path: string) {
    return /.*\..+/.test(path);
}

export function filePathCrumbs(path: string): {crumb:string,path:string}[] {
    const pathSegments = path.split(/(\\|\/)+/im).filter((crumb) => {
        return crumb !== '';
    });
    let crumbs: {crumb:string,path:string}[] = [];
    for(let i = 0; i < pathSegments.length; i++) {

        if(pathSegments[i] !== '' && !(/(\\|\/)/im.test(pathSegments[i]))) {
            if(/.+\..+/im.test(pathSegments[i])) {
                crumbs.push({
                    crumb: pathSegments[i],
                    path: pathSegments.slice(0, i+1).join('')
                });
            } else {
                crumbs.push({
                    crumb: pathSegments[i] + "/",
                    path: pathSegments.slice(0, i+1).join('')
                });
            }
        }
    };

    return crumbs;
}







export module FS {

    export function fileName(filePath: string) {
        return path.parse(filePath).base;
    }

    export function file(location: string, fileType: string, size: number, lastModified: Date, created: Date): File {
        return {
            name: path.parse(location).base,
            location: location,
            breadcrumbs: filePathCrumbs(location),
            fileType: fileType,
            size,
            lastModified,
            created,
            get: () => {
                return new Promise((res, err) => {
                    fs.readFile(location, (error, data) => {
                        if(error) {
                            err(error);
                        } else {
                            res(data);
                        }
                    });
                });
            },
            set: (data: any) => {
                
            }
        };
    }

    export function createFile(fileLocation: string): File | null {
        let stats;
        let fileType = 'unknown';
        
        try {
            stats = fs.statSync(fileLocation);
        } catch(e) { 
            if(e instanceof Error) {
                if(e.message.startsWith('ENOENT: no such file')) {
                    console.log("NO SUCH FILE:", fileLocation)
                    return null;
                } else if(e.message.startsWith('EPERM: operation not permitted')) {
                    return file(fileLocation, 'restricted', 0, ZERO_DATE, ZERO_DATE);
                } else if(e.message.startsWith('EBUSY: resource busy or locked')) {
                    return file(fileLocation, 'busy', 0, ZERO_DATE, ZERO_DATE);
                } else {
                    throw e;
                }
            } else {
                throw e;
            }
        }       
    
        if(fileType === 'unknown') {
            if(stats.isDirectory()) {
                fileType = 'directory'
            }
        }

        return file(fileLocation, fileType, stats.size, stats.mtime, stats.birthtime);
    }
    
    
    

    export async function read(location: string): Promise<File<any, any>> {




        
        if(isFile(location)) {

            const fileObject = createFile(location);
            if(fileObject) {
                return fileObject;
            } else {
                throw new Error('No such file: ' + location);
            }

        } else {

            return {
                name: path.parse(location).base,
                location,
                breadcrumbs: filePathCrumbs(location),
                fileType: 'directory',
                get: () => {
                    return new Promise((res, err) => {
                        fs.readdir(location,{}, (error, files) => {
                            if(error) {
                                err(error);
                            } else {
                                const fileObjects: File[] = files.map((fileStr) => {
                                    return createFile(path.join(location,typeof fileStr === 'string' ? fileStr : fileStr.toString('utf-8')));
                                }).filter(file => file !== null) as File[];
                                res(fileObjects);
                            }
                        });
                    });
                },
                set: (data) => {
                    
                }
            } as DirectoryFile;

        }
    }
}