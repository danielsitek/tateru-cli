import path from 'path';
import { getTemplateBase } from './core/utils/getTemplateBase';
import { getTranslationKeys } from './core/utils/getTranslationKeys';
import { getPagesKeys } from './core/utils/getPagesKeys';
import { loadTranslation } from './core/utils/loadTranslation';
import { composeData } from './core/utils/composeData';
import { getFileType } from './core/utils/getFileType';
import { getTemplateFile } from './core/utils/getTemplateFile';
import { buildTemplate } from './core/services/buildTemplate';
import { minifyContents } from './minify/minifyContents';
import { ENV_DEVELOPMENT } from './definition/defines';
import type { CoreOptions, CoreResult, CoreFile } from '../types';

export const core = ({
    config,
    env = ENV_DEVELOPMENT,
    lang,
    page,
    cwd = '.',
    formatter,
    minify,
}: CoreOptions): CoreResult => {
    const files: CoreFile[] = [];

    const templateBase = getTemplateBase(cwd, config.options.src);

    const translationsKeys = getTranslationKeys(config.translations, lang);

    // Translations loop
    translationsKeys.forEach((translationKey) => {
        const translationConfig = {
            ...config.translations[translationKey]
        };
        const pagesConfig = {
            ...config.pages[translationKey]
        };
        const envConfig = {
            ...config.env[env]
        };
        const pagesKeys = getPagesKeys(pagesConfig, page);

        const translation = loadTranslation(cwd, translationConfig.src);

        // Pages loop
        pagesKeys.forEach((pageKey) => {
            const pageConfig = {
                ...pagesConfig[pageKey]
            };

            const pageData = composeData(
                translationKey,
                config.options.data,
                envConfig.data,
                pageConfig.data,
                pagesConfig
            );

            const relativeFilePath = path.join(config.options.ext, translationConfig.ext, pageConfig.ext);

            const file: CoreFile = {
                cwd,
                base: path.dirname(relativeFilePath),
                path: relativeFilePath,
                ext: pageConfig.ext,
                type: getFileType(pageConfig.ext)?.toLocaleLowerCase().trim(),
                contents: '',
            };

            const templateFile = getTemplateFile(templateBase, pageConfig.src);

            file.contents = buildTemplate(pageData, translation, templateBase, templateFile);

            if (typeof formatter === 'function') {
                file.contents = formatter(file.contents, file.type);
            }

            if ((pageConfig.minify || []).includes(env)) {
                if (typeof minify === 'function') {
                    file.contents = minify(file.contents, file.type);
                } else {
                    file.contents = minifyContents(file.contents, file.type);
                }
            }

            files.push(file);
        });
    });

    return files;
};
