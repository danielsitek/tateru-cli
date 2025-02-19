import { getTemplateBase } from './utils/getTemplateBase';
import { getTranslationKeys } from './utils/getTranslationKeys';
import { getPagesKeys } from './utils/getPagesKeys';
import { loadTranslation } from './utils/loadTranslation';
import { composeData } from './utils/composeData';
import { getFileType } from './utils/getFileType';
import { getTemplateFile } from './utils/getTemplateFile';
import path from 'path';
import buildTemplate from '.';
import { minifyBuildContent } from './utils/minifyBuildContent';
import { ENV_DEVELOPMENT } from './app/defines';
import type { Environment, ConfigFile } from './types';

export interface CoreOptions {
    config: ConfigFile;
    env?: Environment;
    lang?: string;
    page?: string;
    cwd?: string;
    formatter?: (contents: string, fileType?: string) => string;
    minify?: (contents: string, fileType?: string) => string;
}

export interface CoreFile {
    cwd: string;
    base: string;
    path: string;
    ext: string;
    type?: string;
    contents: string;
}

export type CoreResult = CoreFile[];

export const core = ({
    config,
    env = ENV_DEVELOPMENT,
    lang,
    page,
    cwd = '.',
    formatter,
    minify,
}: CoreOptions): CoreResult => {

    console.log("core: options", { config, env, lang, page, cwd, formatter, minify });

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
                    file.contents = minifyBuildContent(file.contents, file.type);
                }
            }

            files.push(file);
        });
    });

    console.log("core: files", files);

    return files;
};
