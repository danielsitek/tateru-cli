import type { ConfigFile } from '../../../types';
import { SchemaError } from '../services/schemaError';

/**
 * Resolve contents to a valid ConfigFile object
 */
export const resolveContents = (contents: string | ConfigFile): ConfigFile => {
    if (typeof contents === 'string') {
        try {
            return JSON.parse(contents);
        } catch (error) {
            throw new SchemaError('Invalid JSON syntax');
        }
    }
    return contents;
};
