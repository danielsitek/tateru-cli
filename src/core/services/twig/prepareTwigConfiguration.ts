import fs from 'fs';
import type { TwigConfiguration } from '../../../../types';

export const prepareTwigConfiguration = (pathToTwigFile: string, twigBase: string): TwigConfiguration => {
    try {
        if (!fs.existsSync(pathToTwigFile)) {
            throw new Error(`File "${pathToTwigFile}" does not exits`);
        }

        const fileContent = fs.readFileSync(pathToTwigFile);
        const fileTwigConfig = {
            id: Math.floor(Math.random() * 1000000),
            path: pathToTwigFile,
            base: twigBase,
            namespaces: {
                'Main': twigBase,
            },
            data: fileContent.toString('utf-8'),
        };

        return fileTwigConfig;
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error(String(e));
    }
};
