import fs from 'fs';
import path from 'path';


export const writeFile = (fileContent: string, filePath: string): boolean => {
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, fileContent);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Failed to write file ${filePath}`);
    }

    return true;
};
