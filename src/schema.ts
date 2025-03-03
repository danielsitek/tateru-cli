import type { ConfigFile, ValidateSchema, Environment } from '../types';
import { SchemaError } from './schema/services/schemaError';
import { ensureProperty, ensureObject, ensureType, ensureArray } from './schema/services/validators';

const supportedEnvironments: Environment[] = ['dev', 'prod'];

/**
 * Resolve contents to a valid ConfigFile object
 */
const resolveContents = (contents: string | ConfigFile): ConfigFile => {
    if (typeof contents === 'string') {
        try {
            return JSON.parse(contents);
        } catch (error) {
            throw new SchemaError('Invalid JSON syntax');
        }
    }
    return contents;
};

/**
 * Validate section 'env'
 */
const validateEnvironments = async (config: ConfigFile): Promise<{ environmentKeys: string[] }> => {
    ensureProperty(config, 'env', 'root');
    ensureObject(config.env, 'env');

    const environmentKeys = Object.keys(config.env);

    for (const env of supportedEnvironments) {
        ensureProperty(config.env, env, 'env');
        ensureObject(config.env[env], `env.${env}`);

        ensureProperty(config.env[env], 'data', `env.${env}`);
        ensureObject(config.env[env].data, `env.${env}.data`);
    }

    return { environmentKeys };
};

/**
 * Validate section 'options'
 */
const validateOptions = async (config: ConfigFile): Promise<void> => {
    ensureProperty(config, 'options', 'root');
    ensureObject(config.options, 'options');

    ensureProperty(config.options, 'data', 'options');
    ensureObject(config.options.data, 'options.data');

    ensureProperty(config.options, 'src', 'options');
    ensureType(config.options.src, 'string', 'options.src');

    ensureProperty(config.options, 'ext', 'options');
    ensureType(config.options.ext, 'string', 'options.ext');
};

/**
 * Validate section 'translations' and return translation keys
 */
const validateTranslations = async (config: ConfigFile): Promise<string[]> => {
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

/**
 * Validate section 'pages'
 */
const validatePages = async (config: ConfigFile, translationKeys: string[], environmentKeys: string[]): Promise<void> => {
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

/**
 * Validate single page configuration
 */
const validatePageConfig = async (pageConfig: any, path: string, environmentKeys: string[]): Promise<void> => {
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

/**
 * Validate the entire configuration schema
 */
export const validateSchema: ValidateSchema = async (contents) => {
    try {
        const config = resolveContents(contents);

        // Validate individual sections
        const { environmentKeys } = await validateEnvironments(config);
        await validateOptions(config);
        const translationKeys = await validateTranslations(config);
        await validatePages(config, translationKeys, environmentKeys);

        // If no errors were thrown, the schema is valid
        return true;
    } catch (error) {
        if (error instanceof SchemaError) {
            throw error;
        }
        throw new SchemaError('Unknown schema validation error');
    }
};
