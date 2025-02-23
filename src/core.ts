import path from 'path';
import { getTemplateBase } from './core/utils/getTemplateBase';
import { iterateKeys } from './core/utils/iterateKeys';
import { readJson } from './utils/readJson';
import { composeData } from './core/utils/composeData';
import { getFileType } from './core/utils/getFileType';
import { getTemplateFile } from './core/utils/getTemplateFile';
import { buildTemplate } from './core/services/buildTemplate';
import { minifyContents } from './minify/minifyContents';
import { ENV_DEVELOPMENT } from './definition/defines';
import type { CoreOptions, CoreResult, CoreFile, ConfigFile } from '../types';

const loopTranslations = async ({
    config,
    lang,
    cwd,
}: {
    config: ConfigFile;
    lang?: string;
    cwd: string;
}) => {
    return Promise.all(
        Array.from(iterateKeys(config.translations, lang)).map(async (translationKey) => {
            const translationConfig = {
                ...config.translations[translationKey],
            };

            const translationData = await readJson(cwd, translationConfig.src);

            return {
                translationKey,
                translationConfig,
                translationData,
            };
        })
    );
};

export const core = async ({
    config,
    env = ENV_DEVELOPMENT,
    lang,
    page,
    cwd = '.',
    formatter,
    minify,
}: CoreOptions): Promise<CoreResult> => {
    const files: CoreFile[] = [];

    const templateBase = getTemplateBase(cwd, config.options.src);
    const translations = await loopTranslations({ config, lang, cwd })

    // Translations loop
    for (const { translationKey, translationConfig, translationData } of translations) {
        const pagesConfig = {
            ...config.pages[translationKey],
        };
        const envConfig = {
            ...config.env[env],
        };

        // Pages loop
        for (const pageKey of iterateKeys(pagesConfig, page)) {
            const pageConfig = {
                ...pagesConfig[pageKey],
            };

            const pageData = composeData(
                translationKey,
                config.options.data,
                envConfig.data,
                pageConfig.data,
                pagesConfig,
            );

            const relativeFilePath = path.join(
                config.options.ext,
                translationConfig.ext,
                pageConfig.ext,
            );

            const file: CoreFile = {
                cwd,
                base: path.dirname(relativeFilePath),
                path: relativeFilePath,
                ext: pageConfig.ext,
                type: getFileType(pageConfig.ext)?.toLocaleLowerCase().trim(),
                contents: '',
            };

            const templateFile = getTemplateFile(templateBase, pageConfig.src);

            file.contents = buildTemplate(
                pageData,
                translationData,
                templateBase,
                templateFile,
            );

            if (typeof formatter === 'function') {
                file.contents = await formatter(file.contents, file.type);
            }

            if ((pageConfig.minify || []).includes(env)) {
                if (typeof minify === 'function') {
                    file.contents = await minify(file.contents, file.type);
                } else {
                    file.contents = await minifyContents(file.contents, file.type);
                }
            }

            files.push(file);
        };
    };

    return files;
};
