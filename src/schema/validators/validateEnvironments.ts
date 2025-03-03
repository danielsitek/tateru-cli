import type { ConfigFile, Environment } from '../../../types';
import { ensureProperty, ensureObject } from '../services/validators';
import { SchemaError } from '../services/schemaError';

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

    for (const requiredEnv of supportedEnvironments) {
        if (!environmentKeys.includes(requiredEnv)) {
            throw new SchemaError(`Missing required environment '${requiredEnv}'`, {
                path: 'env',
                value: environmentKeys,
                expected: supportedEnvironments
            });
        }
    }

    for (const env of environmentKeys) {
        if (!supportedEnvironments.includes(env as Environment)) {
            throw new SchemaError(`Invalid environment '${env}'`, {
                path: `env.${env}`,
                value: env,
                expected: supportedEnvironments
            });
        }

        const envConfig = config.env[env as unknown as Environment];
        ensureObject(envConfig, `env.${env}`);

        ensureProperty(envConfig, 'data', `env.${env}`);
        ensureObject(envConfig.data, `env.${env}.data`);
    }

    return { environmentKeys };
};
