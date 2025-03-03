import { SchemaError } from './schemaError';

export const ensureProperty = (obj: any, prop: string, path: string): void => {
    if (obj[prop] === undefined) {
        throw new SchemaError(`Missing required property: ${path}.${prop}`);
    }
};

export const ensureType = (value: unknown, type: string, path: string): void => {
    if (typeof value !== type) {
        throw new SchemaError(`Invalid type at ${path}: expected ${type}, got ${typeof value}`);
    }
};

export const ensureObject = (value: unknown, path: string): void => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new SchemaError(`Invalid value at ${path}: expected object`);
    }
};

export const ensureArray = (value: unknown, path: string): void => {
    if (!Array.isArray(value)) {
        throw new SchemaError(`Invalid value at ${path}: expected array`);
    }
};
