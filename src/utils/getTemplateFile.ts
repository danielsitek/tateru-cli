import fs from 'fs';
import path from 'path';


export const getTemplateFile = (templateBase: string, templateFilePath: string): string => {
    const templateFileSrc = path.resolve(templateBase, templateFilePath);

    if (!fs.existsSync(templateFileSrc)) {
        throw new Error(`Cannot load template file ${templateFileSrc}`);
    }

    return templateFileSrc;
};
