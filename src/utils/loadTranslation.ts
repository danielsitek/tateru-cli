import fs from 'fs';
import path from 'path';


export const loadTranslation = (projectRoot: string, translationFilePath: string): any => {
    const fileSrc = path.resolve(projectRoot, translationFilePath);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load translation file ${fileSrc}`);
    }

    const contentString = fs.readFileSync(fileSrc).toString('utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson
    };
};
