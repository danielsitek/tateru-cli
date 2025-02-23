import fs from 'fs/promises';
import path from 'path';

export const readJson = async <T = Record<string, unknown>>(
    cwd: string,
    fileName: string,
): Promise<T> => {
    const filePath = path.resolve(cwd, fileName);

    try {
        const contentString = await fs.readFile(filePath, 'utf8');
        const contentJson: T = JSON.parse(contentString);

        return {
            ...contentJson,
        };
    } catch {
        throw new Error(`Cannot read JSON file: "${filePath}"`);
    }
};
