import type { ValidateSchema, Environment } from '../types';
import { SchemaError } from './schema/services/schemaError';
import { validateEnvironments } from './schema/validators/validateEnvironments';
import { validateOptions } from './schema/validators/validateOptions';
import { validateTranslations } from './schema/validators/validateTranslations';
import { validatePages } from './schema/validators/validatePages';
import { resolveContents } from './schema/utils/resolveContents';

const supportedEnvironments: Environment[] = ['dev', 'prod'];

/**
 * Validate the entire configuration schema
 */
export const validateSchema: ValidateSchema = async (contents) => {
    try {
        const config = resolveContents(contents);

        // Validate individual sections
        const { environmentKeys } = await validateEnvironments(config, supportedEnvironments);
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
