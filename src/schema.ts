import { ConfigFile } from '../types';

export type validateSchema = (contents: string | ConfigFile) => void;

export class SchemaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SchemaError';
    }
}

const resolveContents = (contents: string | ConfigFile): ConfigFile => {
    if (typeof contents === 'string') {
        return JSON.parse(contents);
    }

    return contents;
};

export const validateSchema: validateSchema = (contents) => {
    let jsonContents: ConfigFile;

    try {
        jsonContents = resolveContents(contents);
    } catch (error) {
        throw new SchemaError('Invalid JSON');
    }

    // TODO - validate the schema
    // const parsedConfig = ConfigFileSchema.parse(jsonContents);

    // TODO - return true if the schema is valid
    return;
};
