import type { ConfigFile } from '../../../types';
import { ensureProperty, ensureObject, ensureType } from '../services/validators';

/**
 * Validate section 'options'
 *
 * @param config - The configuration object
 *
 * @returns Object containing the keys of all environments
 *
 * @throws {SchemaError} When validation fails
 *
 * @example
 * {
 *   "options": {
 *     "data": {},
 *     "src": "src/twig",
 *     "ext": "dist"
 *   }
 * }
 */
export const validateOptions = async (config: ConfigFile): Promise<void> => {
    ensureProperty(config, 'options', 'root');
    ensureObject(config.options, 'options');

    ensureProperty(config.options, 'data', 'options');
    ensureObject(config.options.data, 'options.data');

    ensureProperty(config.options, 'src', 'options');
    ensureType(config.options.src, 'string', 'options.src');

    ensureProperty(config.options, 'ext', 'options');
    ensureType(config.options.ext, 'string', 'options.ext');
};
