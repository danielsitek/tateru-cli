import fs from 'fs/promises';
import path from 'path';

export const loadTranslation = async (
    projectRoot: string,
    translationFilePath: string,
): Promise<Record<string, unknown>> => {
    const translationFileSrc = path.resolve(projectRoot, translationFilePath);

    try {
        await fs.access(translationFileSrc);
    } catch {
        throw new Error(`Cannot load translation file ${translationFileSrc}`);
    }

    const contentString = await fs.readFile(translationFileSrc, 'utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson,
    };
};
