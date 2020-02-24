'use strict';

import fs from 'fs';
import path from 'path';
import { get, merge } from 'lodash';
import Twig from 'twig';
import Pipeline from './app/utils/pipeline';
import { ConfigFile, PagesUrlObject, PipelineData } from './types';
import minifyHtml from './app/pipes/minifyHtml';
import saveFile from './app/pipes/saveFile';
import printLog from './app/pipes/printLog';
import prepareTwigConfiguration from './app/twig/prepareTwigConfiguration';
import CliService from './app/services/cliService';

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
 * Translations
 */
const translationFilePath = path.resolve(rootDir, configFile.translations[options.lang].src);
if (!fs.existsSync(translationFilePath)) {
    console.error(`Cannot find translation file on path "${translationFilePath}"`);
    process.exit(1);
}
const translationFileContent = fs.readFileSync(translationFilePath);
const translations = JSON.parse(translationFileContent.toString());

Twig.extendFunction('trans', (value: string) => {
    return get(translations, value) || value;
});


Twig.extendFilter('sort_by', (value: any, key: any): any => {
    if (!Array.isArray(value)) {
        return value;
    }
    value.sort((a, b) => {
        if (!a[key]) return 0;
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });

    return value;
});



/**
 * Render Twig template with configuration from config.json.
 *
 * @param {String} pageName Page name in config.json file.
 */
const renderPage = (pageName: string): Pipeline => {
    if (!configFile.pages[options.lang][pageName]) {
        console.error(`"${pageName}" were not found in config file.`);
        process.exit(1);
    }

    const buildPageConfig = configFile.pages[options.lang][pageName];
    const pathToExt = path.resolve(renderExtDir, buildPageConfig.ext);
    const pathToSrc = path.resolve(renderSrcDir, buildPageConfig.src);
    const relativeFileExt = path.join(configFile.options.ext, buildPageConfig.ext);
    const relativeFileSrc = path.join(configFile.options.src, buildPageConfig.src);

    if (!fs.existsSync(pathToSrc)) {
        console.error(`File "${pathToSrc}" does not exits`);
        process.exit(1);
    }

    const fileTwigConfig = prepareTwigConfiguration(pathToSrc, renderSrcDir);

    const fileRenderOptions: any = merge(
        renderOptions,
        buildPageConfig.data
    );

    const template = Twig.twig(fileTwigConfig).render(fileRenderOptions) as string;

    return new Pipeline({
        source: template,
        filePathExt: pathToExt,
        filePathSrc: pathToSrc,
        relativeFileExt,
        relativeFileSrc,
        renderSrcDir,
        renderExtDir,
        twigConfig: fileTwigConfig,
        renderOptions: fileRenderOptions
    });
};

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

const renderPipeline = (page: string): void => {
    renderPage(page)
        .pipe(prodMinifyHtml)
        .pipe(printLog)
        .pipe(saveFile);
}

/**
 * Run builder
 */
const run = (): void => {
    try {
        console.log(`Environment:\t${options.env}`);

        if (options.flags.page && options.flags.lang) {
            // Build single page in selected lang
            // console.log(`Going to build page "${options.flags.page}" in "${options.flags.lang}" group.`)
            renderPipeline(options.flags.page);
        } else if (options.flags.page) {
            // console.log(`Going to build page "${options.flags.page}" in "${options.lang}" group.`)
            renderPipeline(options.flags.page);
        } else if (options.flags.lang) {
            // Build all pages in single lang
            // console.log(`Going to build pages in "${options.flags.lang}" group.`)
            Object.keys(configFile.pages[options.lang]).forEach(item => {
                renderPipeline(item);
            });
        } else {
            // Build everything
            // console.log(`Going to build all pages in all groups.`)
            Object.keys(configFile.pages).forEach(lang => {
                Object.keys(configFile.pages[lang]).forEach(item => {
                    renderPipeline(item);
                });
            });

        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

module.exports = run;
