import fs from 'fs';
import path from 'path';
import { ConfigFile } from '../types';


export const loadConfiguration = (configFileName: string, cwd: string): ConfigFile => {
    const fileSrc = path.resolve(cwd, configFileName);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load configuration file ${fileSrc}`);
    }

    const contentString = fs.readFileSync(fileSrc).toString('utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson
    };
};
