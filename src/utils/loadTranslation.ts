import fs from 'fs';
import path from 'path';


export const loadTranslation = (projectRoot: string, translationFilePath: string): any => {
    const translationFileSrc = path.resolve(projectRoot, translationFilePath);

    if (!fs.existsSync(translationFileSrc)) {
        throw new Error(`Cannot load translation file ${translationFileSrc}`);
    }

    const contentString = fs.readFileSync(translationFileSrc).toString('utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson
    };
};
