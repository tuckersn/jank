import {  DirectoryFile, File, ImageFile } from "../interfaces/files";
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

    export function newFile(location: string, fileType: string, size: number, lastModified: Date, created: Date): File {
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
        
        try {
            stats = fs.statSync(fileLocation);
        } catch(e) { 
            if(e instanceof Error) {
                if(e.message.startsWith('ENOENT: no such file')) {
                    console.log("NO SUCH FILE:", fileLocation)
                    return null;
                } else if(e.message.startsWith('EPERM: operation not permitted')) {
                    return newFile(fileLocation, 'restricted', 0, ZERO_DATE, ZERO_DATE);
                } else if(e.message.startsWith('EBUSY: resource busy or locked')) {
                    return newFile(fileLocation, 'busy', 0, ZERO_DATE, ZERO_DATE);
                } else {
                    throw e;
                }
            } else {
                throw e;
            }
        }       
    
        let file = newFile(fileLocation, 'unknown', stats.size, stats.mtime, stats.birthtime);
      
        if(stats.isDirectory()) {
            const directory: DirectoryFile = {
                ...file,
                fileType: 'directory'
            }
            return directory;
        } 
        
        if(/.+\.png/im.test(fileLocation)) {
            const imgFile: ImageFile = {
                ...file,
                fileType: 'image',
                trusted: true,
                get: async () => Buffer.from(await file.get()).toString('base64')
            };
            return imgFile;
        }

        return file;
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
                get: async () => {
                    const read = new Promise((res, err) => {
                        try {
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
                        } catch(e) {
                            throw e;
                        }
                    });

                    return read;
                },
                set: (data) => {
                    
                }
            } as DirectoryFile;

        }
    }


    /**
     * Same as read, but outputs a trusted ImageFile and reads the data
     * as a base64 encoded string for img tags.
     */
    export async function readAsImage(location: string): Promise<ImageFile<any>> {
        const file: ImageFile = {
            ...await read(location),
            fileType: 'image',
            trusted: true
        };
        
        //TODO: validation or trust developer?

        const originalGet = file.get;
        file.get = async () => {
            try {
                return Buffer.from(await originalGet()).toString('base64');
            } catch(e) {
                throw e;
            }
        }
        
        return file;
    }
}