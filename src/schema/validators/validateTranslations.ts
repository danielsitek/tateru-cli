import type { ConfigFile } from '../../../types';
import { ensureProperty, ensureObject, ensureType } from '../services/validators';
import { SchemaError } from '../services/schemaError';

/**
 * Validate section 'translations' and return translation keys
 *
 * @param config - The configuration object
 *
 * @returns List of translation keys
 *
 * @throws {SchemaError} When validation fails
 *
 * @example
 * {
 *   "translations": {
 *     "translationKey": {
 *       "src": "src/translations/cs.json",
 *       "ext": ""
 *     }
 *   }
 * }
 */
export const validateTranslations = async (config: ConfigFile): Promise<string[]> => {
    ensureProperty(config, 'translations', 'root');
    ensureObject(config.translations, 'translations');

    const translationKeys = Object.keys(config.translations);
    if (translationKeys.length === 0) {
        throw new SchemaError('No translation keys defined');
    }

    for (const key of translationKeys) {
        const path = `translations.${key}`;
        ensureObject(config.translations[key], path);

        ensureProperty(config.translations[key], 'src', path);
        ensureType(config.translations[key].src, 'string', `${path}.src`);

        ensureProperty(config.translations[key], 'ext', path);
        ensureType(config.translations[key].ext, 'string', `${path}.ext`);
    }

    return translationKeys;
};
