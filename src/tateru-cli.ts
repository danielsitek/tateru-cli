#!/usr/bin/env node

'use strict';

const timeStart = process.hrtime();

import path from 'path';
import { buildTemplate } from '.';
import CliService from './app/services/cliService';
import { getProjectDir } from './utils/getProjectDir';
import { loadConfiguration } from './utils/loadConfiguration';
import { loadTranslation } from './utils/loadTranslation';
import { getTemplateBase } from './utils/getTemplateBase';
import { getTemplateFile } from './utils/getTemplateFile';
import { composeData } from './utils/composeData';
import { getTranslationKeys } from './utils/getTranslationKeys';
import { getPagesKeys } from './utils/getPagesKeys';
import { writeFile } from './utils/writeFile';
import { getFileType } from './utils/getFileType';
import { minifyBuildContent } from './utils/minifyBuildContent';
import { printLog } from './utils/printLog';
import { getEndTime } from './utils/getEndTime';
import { formatBuildContent } from './utils/formatBuildContent';

const { configFile, env, lang, page } = CliService.init();

const processCwd = process.cwd();

try {
    const projectDir = getProjectDir(configFile, processCwd);

    const config = loadConfiguration(configFile, processCwd);

    const templateBase = getTemplateBase(projectDir, config.options.src);

    const translationsKeys = getTranslationKeys(config.translations, lang);

    printLog(`Config file "${configFile}" loaded`);
    printLog(`Environment:\t${env}\n`);

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

        const translation = loadTranslation(projectDir, translationConfig.src);

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

            const distFile = path.resolve(processCwd, config.options.ext, translationConfig.ext, pageConfig.ext);

            let build = buildTemplate(pageData, translation, templateBase, templateFile);

            build = formatBuildContent(build, pageFileType);

            if (pageMinify.includes(env)) {
                build = minifyBuildContent(build, pageFileType);
            }

            writeFile(build, distFile);

            printLog(`Created:\t${pageConfig.ext}`);
        });
    });
} catch (e) {
    console.log(e);
    process.exit(1);
} finally {
    const timeEnd = getEndTime(timeStart);
    printLog(`\nTime:\t\t${timeEnd.s}s ${timeEnd.ms}ms`);
}
