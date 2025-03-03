import { SchemaError, SchemaErrorDetails } from './schemaError';

/**
 * Ensures that the property exists on the object
 *
 * @param obj - Object to check
 * @param prop - Property name
 * @param path - Path to the object (for error reporting)
 *
 * @throws {SchemaError} When property does not exist
 */
export function ensureProperty(obj: any, prop: string, path: string): void {
    if (obj[prop] === undefined) {
        const details: SchemaErrorDetails = {
            path: path ? `${path}.${prop}` : prop,
            value: undefined,
            expected: 'property to exist'
        };
        throw new SchemaError(`Missing required property: ${details.path}`, details);
    }
}

/**
 * Ensures that the value is an object
 *
 * @param value - Value to check
 * @param path - Path to the value (for error reporting)
 *
 * @throws {SchemaError} When value is not an object
 */
export function ensureObject(value: any, path: string): void {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        const details: SchemaErrorDetails = {
            path,
            value: Array.isArray(value) ? 'array' : typeof value,
            expected: 'object'
        };
        throw new SchemaError(`Invalid value at ${path}: expected object`, details);
    }
}

/**
 * Ensures that the value is of specified type
 *
 * @param value - Value to check
 * @param type - Expected type
 * @param path - Path to the value (for error reporting)
 *
 * @throws {SchemaError} When value is not of specified type
 */
export function ensureType(value: any, type: string, path: string): void {
    if (typeof value !== type) {
        const details: SchemaErrorDetails = {
            path,
            value: typeof value,
            expected: type
        };
        throw new SchemaError(`Invalid type at ${path}: expected ${type}, got ${typeof value}`, details);
    }
}

/**
 * Ensures that the value is an array
 *
 * @param value - Value to check
 * @param path - Path to the value (for error reporting)
 *
 * @throws {SchemaError} When value is not an array
 */
export function ensureArray(value: any, path: string): void {
    if (!Array.isArray(value)) {
        const details: SchemaErrorDetails = {
            path,
            value: typeof value,
            expected: 'array'
        };
        throw new SchemaError(`Invalid value at ${path}: expected array`, details);
    }
}
