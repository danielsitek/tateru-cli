import fs from 'fs';
import path from 'path';

class TranslationsService {

    public static getTranslations (rootDir: string, translationsFilePath: string): any {
        try {
            const translationFilePath = path.resolve(rootDir, translationsFilePath);

            if (!fs.existsSync(translationFilePath)) {
                console.error(`Cannot find translation file on path "${translationFilePath}"`);
            }

            const translationFileContent = fs.readFileSync(translationFilePath);
            const translations = JSON.parse(translationFileContent.toString());

            return translations;
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default TranslationsService
