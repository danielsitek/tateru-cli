'use strict';

import fs from 'fs';
import path from 'path';
import { merge } from 'lodash';
import { ConfigFile, PagesUrlObject, PipelineData, Translations, LanguageString } from './types';
import minifyHtml from './app/pipes/minifyHtml';
import saveFile from './app/pipes/saveFile';
import printLog from './app/pipes/printLog';
import CliService from './app/services/cliService';
import TranslationsService from './app/services/translationsService';
import renderPage from './app/renderPage';

const options = CliService.init();

const rootDir = path.resolve(process.cwd())
const configFileSrc = path.resolve(rootDir, options.configFile);

if (!fs.existsSync(configFileSrc)) {
    console.error(`Cannot find config file "${options.configFile}" on path "${configFileSrc}"`);
    process.exit(1);
} else {
    console.log(`Config file "${options.configFile}" loaded`)
}

let configFile: ConfigFile = {} as ConfigFile;

try {
    configFile = require(configFileSrc);
} catch (e) {
    console.error(`Cannot load config file "${configFileSrc}"`)
    process.exit(1);
}

const hrefData: PagesUrlObject = {};
try {
    Object.keys(configFile.pages[options.lang]).forEach(pageName => {
        try {
            hrefData[pageName] = `/${configFile.pages[options.lang][pageName].ext}`;
        } catch (e) {
            console.error(`Cannot find page ext in lang group "${options.lang}".`);
        }
    });
} catch (e) {
    console.error(`Cannot find pages in lang group "${options.lang}".`);
    process.exit(1);
}


const renderOptions = merge(
    configFile.options.data,
    configFile.env[options.env].data,
    {
        href: hrefData,
        lang: options.lang
    }
);

// console.log(renderOptions);

const renderSrcDir = path.resolve(rootDir, configFile.options.src);
const renderExtDir = path.resolve(rootDir, configFile.options.ext);

/**
 * Save generated html in file.
 *
 * @param {Object} data
 */

const prodMinifyHtml = (data: PipelineData): PipelineData => {
    if (options.env === 'prod') {
        return minifyHtml(data);
    }
    return data;
}

/**
 * Generate page.
 */

const renderPipeline = (page: string, translations: Translations): void => {
    renderPage(page, translations, configFile, options, renderOptions, renderExtDir, renderSrcDir)
        .pipe(prodMinifyHtml)
        .pipe(printLog)
        .pipe(saveFile);
}

const buildAllPagesInLang = (lang: LanguageString): void => {
    const translations = TranslationsService.getTranslations(rootDir, configFile.translations[lang].src)
    Object.keys(configFile.pages[lang]).forEach(page => {
        renderPipeline(page, translations);
    });
}

const buildSinglePage = (lang: LanguageString): void => {
    const translations = TranslationsService.getTranslations(rootDir, configFile.translations[lang].src)
    renderPipeline(options.flags.page, translations);
}

/**
 * Run builder
 */
const run = (): void => {

    try {
        console.log(`Environment:\t${options.env}`);

        if (options.flags.page && options.flags.lang) {
            // Build single page in selected lang
            // const translations = TranslationsService.getTranslations(rootDir, configFile.translations[options.flags.lang].src)
            // renderPipeline(options.flags.page, translations);
            buildSinglePage(options.flags.lang);
        } else if (options.flags.page) {
            // const translations = TranslationsService.getTranslations(rootDir, configFile.translations[options.lang].src)
            // renderPipeline(options.flags.page, translations);
            buildSinglePage(options.lang);
        } else if (options.flags.lang) {
            // Build all pages in single lang
            buildAllPagesInLang(options.flags.lang);
        } else {
            // Build everything
            Object.keys(configFile.pages).forEach(lang => {
                buildAllPagesInLang(lang);
            });

        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

export default run;
