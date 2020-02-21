import fs from 'fs'
import path from 'path'
import { TwigConfiguration } from '../../types';

const prepareTwigConfiguration = (pathToTwigFile: string, twigBase: string): TwigConfiguration => {
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
                'Main': twigBase + path.sep,
            },
            data: fileContent.toString('utf-8'),
        };

        return fileTwigConfig;
    } catch (e) {
        throw new Error(e)
    }
}

export default prepareTwigConfiguration
