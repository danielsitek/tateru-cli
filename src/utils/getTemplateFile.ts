import fs from 'fs';
import path from 'path';


export const getTemplateFile = (templateBase: string, templateFilePath: string): string => {
    const fileSrc = path.resolve(templateBase, templateFilePath);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load template file ${fileSrc}`);
    }

    return fileSrc;
};
