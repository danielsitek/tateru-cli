import { getTemplateBase } from './utils/getTemplateBase';
import { getTranslationKeys } from './utils/getTranslationKeys';
import { getPagesKeys } from './utils/getPagesKeys';
import { loadTranslation } from './utils/loadTranslation';
import { composeData } from './utils/composeData';
// import { getFileType } from './utils/getFileType';
import { getTemplateFile } from './utils/getTemplateFile';
import path from 'path';
import buildTemplate from '.';
// import { formatBuildContent } from './utils/formatBuildContent';
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

            const pageMinify = pageConfig.minify || [];

            const pageFileType = path.extname(pageConfig.ext).toLocaleLowerCase().trim();

            const templateFile = getTemplateFile(templateBase, pageConfig.src);

            let build = buildTemplate(pageData, translation, templateBase, templateFile);

            if (typeof formatter === 'function') {
                build = formatter(build, pageFileType);
            }

            if (pageMinify.includes(env)) {
                if (typeof minify === 'function') {
                    build = minify(build, pageFileType);
                } else {
                    build = minifyBuildContent(build, pageFileType);
                }
            }

            const relativeFilePath = path.join(config.options.ext, translationConfig.ext, pageConfig.ext)

            files.push({
                cwd: cwd as string,
                base: path.dirname(relativeFilePath),
                path: relativeFilePath,
                ext: pageConfig.ext,
                contents: build,
            });
        });
    });

    console.log("core: files", files);

    return files;
};
