import fs from 'fs';
import path from 'path';
import { Translations } from '../../types';

const cache: any = {};

const translationCache = (filePath: string): any => {
    if (cache[filePath]) {
        return cache[filePath]
    }

    if (!fs.existsSync(filePath)) {
        throw new Error(`Cannot find translation file on path "${filePath}"`);
    }

    const fileContent = fs.readFileSync(filePath);
    cache[filePath] = JSON.parse(fileContent.toString());

    return cache[filePath]
}

class TranslationsService {

    public static getTranslations (rootDir: string, translationsFilePath: string): Translations {
        try {
            const fullFilePath = path.resolve(rootDir, translationsFilePath);
            const translation = translationCache(fullFilePath);

            return translation
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default TranslationsService
