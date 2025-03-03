import type { ConfigFile, Environment } from '../../../types';
import { ensureProperty, ensureObject } from '../services/validators';

/**
 * Validates the environment section of the configuration
 *
 * @param config - The configuration object
 * @param supportedEnvironments - List of supported environment names
 *
 * @returns Object containing the keys of all environments
 *
 * @throws {SchemaError} When validation fails
 *
 * @example
 * {
 *   "env": {
 *     "dev": {
 *       "data": {}
 *     },
 *     "prod": {
 *       "data": {}
 *     }
 *   }
 * }
 */
export const validateEnvironments = async (config: ConfigFile, supportedEnvironments: Environment[]): Promise<{ environmentKeys: string[] }> => {
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
