import fs from 'fs/promises';
import path from 'path';

export const writeFile = async (fileContent: string, filePath: string): Promise<boolean> => {
    const fileDir = path.dirname(filePath);

    try {
        await fs.access(fileDir);
    } catch {
        await fs.mkdir(fileDir, { recursive: true });
    }

    await fs.writeFile(filePath, fileContent, {
        encoding: 'utf8',
    });

    return true;
};
