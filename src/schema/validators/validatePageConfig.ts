import { ensureObject, ensureProperty, ensureType, ensureArray } from '../services/validators';
import type { Environment, ConfigFile } from '../../../types';
import { SchemaError } from '../services/schemaError';

/**
 * Validate single page configuration
 *
 * @param pageConfig - The page configuration object
 * @param path - The path to the page configuration
 * @param environmentKeys - List of environment keys
 *
 * @throws {SchemaError} When validation fails
 *
 * @example
 * {
 *   "data": {},
 *   "src": "views/homepage.twig",
 *   "ext": "index.html"
 *   "minify": ["dev", "prod"]
 * }
 */
export const validatePageConfig = async (
    pageConfig: ConfigFile['pages'][string][string],
    path: string,
    environmentKeys: string[]
): Promise<void> => {
    ensureObject(pageConfig, path);

    // Check required properties
    ensureProperty(pageConfig, 'data', path);
    ensureObject(pageConfig.data, `${path}.data`);

    ensureProperty(pageConfig, 'src', path);
    ensureType(pageConfig.src, 'string', `${path}.src`);

    ensureProperty(pageConfig, 'ext', path);
    ensureType(pageConfig.ext, 'string', `${path}.ext`);

    // Check optional property 'minify'
    if (pageConfig.minify !== undefined) {
        ensureArray(pageConfig.minify, `${path}.minify`);

        // Check if all values are valid environments
        for (let i = 0; i < pageConfig.minify.length; i++) {
            const envName = pageConfig.minify[i];
            if (!environmentKeys.includes(envName as Environment)) {
                throw new SchemaError(
                    `Invalid environment in ${path}.minify[${i}]: '${envName}'. ` +
                    `Expected one of: ${environmentKeys.join(', ')}`
                );
            }
        }
    }
};
