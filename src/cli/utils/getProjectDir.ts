import fs from 'fs';
import path from 'path';

export const getProjectDir = (configFileName: string, cwd: string): string => {
    const fileSrc = path.resolve(cwd, configFileName);
    const dirName = path.dirname(fileSrc);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot find project config: ${fileSrc}`);
    }

    if (!fs.existsSync(dirName)) {
        throw new Error(`Cannot find project root: ${dirName}`);
    }

    return dirName;
};
