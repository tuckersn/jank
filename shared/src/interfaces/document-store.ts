export interface DocumentStore<DOCUMENT_TYPE=any> {
    write(location: string, information: DOCUMENT_TYPE): this;
    read(location: string): DOCUMENT_TYPE;
}