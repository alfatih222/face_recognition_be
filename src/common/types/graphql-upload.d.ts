declare module 'graphql-upload' {
    import { RequestHandler } from 'express';
    import { ReadStream } from 'fs-capacitor';
    import { GraphQLScalarType } from 'graphql';

    export const GraphQLUpload: GraphQLScalarType;

    export interface FileUpload {
        filename: string;
        mimetype: string;
        encoding: string;
        createReadStream: () => ReadStream;
    }

    export function graphqlUploadExpress(options?: {
        maxFileSize?: number;
        maxFiles?: number;
    }): RequestHandler;
}
