import {  DirectoryFile, File } from "../interfaces/files";
import { fs, path } from "./node";

export function isFile(path: string) {
    return /.*\..+/.test(path);
}

export function filePathCrumbs(path: string): string[] {
    const pathSegments = path.split(/(\\|\/)+/im).filter((crumb) => {
        return crumb !== '';
    });
    let crumbs: string[] = [];
    for(let i = 0; i < pathSegments.length; i++) {
        console.log("SEGMENT:", pathSegments[i]);
        if(pathSegments[i] !== '' && !(/(\\|\/)/im.test(pathSegments[i]))) {
            if(/.+\..+/im.test(pathSegments[i])) {
                crumbs.push(pathSegments[i]);
            } else {
                crumbs.push(pathSegments[i] + "/");
            }
        }
    };

    return crumbs;
}

export module FS {

    export async function read(location: string): Promise<File<any, any>> {

        function file(fileLocation: string): File {
            const stats = fs.statSync(location);
            
            return {
                location: fileLocation,
                breadcrumbs: filePathCrumbs(fileLocation),
                fileType: 'unknown',
                size: stats.size,
                lastModified: stats.mtime,
                created: stats.birthtime,
                get: () => {
                    return new Promise((res, err) => {
                        fs.readFile(fileLocation, (error, data) => {
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
        
        if(isFile(location)) {

            return file(location);

        } else {

            return {
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
                                    return file(typeof fileStr === 'string' ? fileStr : fileStr.toString('utf-8'));
                                });
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