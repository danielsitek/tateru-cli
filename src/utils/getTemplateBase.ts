import fs from 'fs';
import path from 'path';


export const getTemplateBase = (projectRoot: string, templateSrc: string): string => {
    const fileSrc = path.resolve(projectRoot, templateSrc);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load template base ${fileSrc}`);
    }

    return fileSrc;
};
