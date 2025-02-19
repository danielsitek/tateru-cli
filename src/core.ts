// import { getProjectDir } from './utils/getProjectDir';
// import { loadConfiguration } from './utils/loadConfiguration';
import { getTemplateBase } from './utils/getTemplateBase';
import { getTranslationKeys } from './utils/getTranslationKeys';
// import { printLog } from './utils/printLog';
import { getPagesKeys } from './utils/getPagesKeys';
import { loadTranslation } from './utils/loadTranslation';
import { composeData } from './utils/composeData';
import { getFileType } from './utils/getFileType';
import { getTemplateFile } from './utils/getTemplateFile';
import path from 'path';
import buildTemplate from '.';
import { formatBuildContent } from './utils/formatBuildContent';
import { minifyBuildContent } from './utils/minifyBuildContent';
// import { writeFile } from 'fs';
import { ENV_DEVELOPMENT } from './app/defines';
import type { Environment, ConfigFile } from './types';

export interface CoreOptions {
    config: ConfigFile;
    env?: Environment;
    lang?: string;
    page?: string;
    cwd?: string;
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
    cwd = '.'
}: CoreOptions): CoreResult => {

    console.log("core: options", { config, env, lang, page, cwd });

    const files: CoreFile[] = [];

    // const projectDir = getProjectDir(configFile, cwd);

    // const config = loadConfiguration(configFile, cwd);

    const templateBase = getTemplateBase(cwd, config.options.src);

    const translationsKeys = getTranslationKeys(config.translations, lang);

    // printLog(`Config file "${configFile}" loaded`);
    // printLog(`Environment:\t${env}\n`);

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

            const pageFileType = getFileType(pageConfig.ext);

            const templateFile = getTemplateFile(templateBase, pageConfig.src);

            // const distFile = path.resolve(cwd as string, config.options.ext, translationConfig.ext, pageConfig.ext);

            let build = buildTemplate(pageData, translation, templateBase, templateFile);

            build = formatBuildContent(build, pageFileType);

            if (pageMinify.includes(env)) {
                build = minifyBuildContent(build, pageFileType);
            }

            // writeFile(build, distFile);

            // printLog(`Created:\t${pageConfig.ext}`);

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
