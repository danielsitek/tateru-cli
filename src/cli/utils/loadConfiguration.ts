import fs from 'fs';
import path from 'path';
import type { ConfigFile } from '../../../types';

export const loadConfiguration = (
    configFileName: string,
    cwd: string,
): ConfigFile => {
    const configurationFileSrc = path.resolve(cwd, configFileName);

    if (!fs.existsSync(configurationFileSrc)) {
        throw new Error(
            `Cannot load configuration file ${configurationFileSrc}`,
        );
    }

    const contentString = fs
        .readFileSync(configurationFileSrc)
        .toString('utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson,
    };
};
