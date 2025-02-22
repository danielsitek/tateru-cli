import fs from 'fs';
import path from 'path';


export const getTemplateBase = (projectRoot: string, templateSrc: string): string => {
    const templateBaseSrc = path.resolve(projectRoot, templateSrc);

    if (!fs.existsSync(templateBaseSrc)) {
        throw new Error(`Cannot load template base ${templateBaseSrc}`);
    }

    return templateBaseSrc;
};
