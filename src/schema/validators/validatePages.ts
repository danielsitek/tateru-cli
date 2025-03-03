import type { ConfigFile } from '../../../types';
import { ensureProperty, ensureObject } from '../services/validators';
import { SchemaError } from '../services/schemaError';
import { validatePageConfig } from './validatePageConfig';

/**
 * Validate section 'pages'
 *
 * @param config - The configuration object
 * @param translationKeys - List of translation keys
 * @param environmentKeys - List of environment keys
 *
 * @returns Object containing the keys of all environments
 *
 * @throws {SchemaError} When validation fails
 *
 * @example
 * {
 *   "pages": {
 *     "translationKey": {
 *       "pageKey": {
 *         "data": {},
 *         "src": "views/homepage.twig",
 *         "ext": "index.html"
 *       }
 *     }
 *   }
 * }
 */
export const validatePages = async (config: ConfigFile, translationKeys: string[], environmentKeys: string[]): Promise<void> => {
    ensureProperty(config, 'pages', 'root');
    ensureObject(config.pages, 'pages');

    // Check if all translation keys have a matching page configuration
    for (const translationKey of Object.keys(config.pages)) {
        if (!translationKeys.includes(translationKey)) {
            throw new SchemaError(`Pages key '${translationKey}' has no matching translation key`);
        }

        ensureObject(config.pages[translationKey], `pages.${translationKey}`);

        // Check if there are any pages defined
        const pageEntries = Object.entries(config.pages[translationKey]);
        if (pageEntries.length === 0) {
            throw new SchemaError(`No pages defined for translation '${translationKey}'`);
        }

        for (const [pageKey, pageConfig] of pageEntries) {
            await validatePageConfig(pageConfig, `pages.${translationKey}.${pageKey}`, environmentKeys);
        }
    }
};
