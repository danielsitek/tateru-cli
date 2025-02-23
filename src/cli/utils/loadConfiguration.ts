import fs from 'fs/promises';
import path from 'path';
import type { ConfigFile } from '../../../types';

export const loadConfiguration = async (
    configFileName: string,
    cwd: string,
): Promise<ConfigFile> => {
    const configurationFileSrc = path.resolve(cwd, configFileName);

    try {
        await fs.access(configurationFileSrc);
    } catch {
        throw new Error(`Cannot load configuration file ${configurationFileSrc}`);
    }

    const contentString = await fs.readFile(configurationFileSrc, 'utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson,
    };
};
