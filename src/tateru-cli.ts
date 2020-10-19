#!/usr/bin/env node

'use strict';

import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';
import { buildTemplate } from '.';
import CliService from './app/services/cliService';
import { ConfigFile, PagesUrlObject } from './types';

const { configFile, env, lang, page } = CliService.init();

const processCwd = process.cwd();

export const getProjectDir = (configFileName: string, cwd: string): string => {
    const fileSrc = path.resolve(cwd, configFileName);
    const dirName = path.dirname(fileSrc);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot find project root ${dirName}`);
    }

    return dirName;
};

export const loadConfiguration = (configFileName: string, cwd: string): ConfigFile => {
    const fileSrc = path.resolve(cwd, configFileName);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load configuration file ${fileSrc}`);
    }

    const contentString = fs.readFileSync(fileSrc).toString('utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson
    };
};

export const loadTranslation = (projectRoot: string, translationFilePath: string): any => {
    const fileSrc = path.resolve(projectRoot, translationFilePath);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load translation file ${fileSrc}`);
    }

    const contentString = fs.readFileSync(fileSrc).toString('utf8');
    const contentJson = JSON.parse(contentString);

    return {
        ...contentJson
    };
};

export const hrefData = (pages: any): any => {
    const href: PagesUrlObject = {};

    Object.keys(pages).forEach(pageName => {
        href[pageName] = `/${pages[pageName].ext}`;
    });

    return href;
};

export const getTemplateBase = (projectRoot: string, templateSrc: string): string => {
    const fileSrc = path.resolve(projectRoot, templateSrc);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load template base ${fileSrc}`);
    }

    return fileSrc;
};

export const getTemplateFile = (templateBase: string, templateFilePath: string): string => {
    const fileSrc = path.resolve(templateBase, templateFilePath);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load template file ${fileSrc}`);
    }

    return fileSrc;
};

export const composeData = (lang: string, configOptionsData: any, configEnvData: any, configPageData: any, cofigPages: any): any => {
    const href = hrefData(
        cofigPages // config.pages.cs
    );

    const data = merge(
        {
            ...configOptionsData // config.options.data
        },
        {
            ...configPageData // config.pages.cs.index.data
        },
        {
            ...configEnvData // config.env.dev.data
        },
        {
            lang,
            href
        }
    );

    return data;
}

const getTranslationKeys = (configOptionLang: any, lang: string): string[] => {
    if (lang) {
        return [lang];
    }

    return Object.keys(configOptionLang);
}

const getPagesKeys = (configPages: any, page: string): string[] => {
    if (page) {
        return [page];
    }

    return Object.keys(configPages);
};

export const writeFile = (fileContent: string, filePath: string): boolean => {
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, fileContent);

    if (!fs.existsSync(filePath)) {
        return false;
    }

    return true;
};

try {
    // console.log({ configFile, env, lang, page });

    const projectDir = getProjectDir(configFile, processCwd);

    const config = loadConfiguration(configFile, processCwd);

    const templateBase = getTemplateBase(projectDir, config.options.src);

    const translationsKeys = getTranslationKeys(config.translations, lang);

    // Lang loop
    translationsKeys.map((translationKey) => {
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

        pagesKeys.map((pageKey) => {
            const pageConfig = {
                ...pagesConfig[pageKey]
            };

            const pageData = composeData(
                lang,
                config.options.data,
                envConfig.data,
                pagesConfig.index.data,
                pagesConfig
            );

            const templateFile = getTemplateFile(templateBase, pageConfig.src);

            const distFile = path.resolve(processCwd, config.options.ext, translationConfig.ext ,pageConfig.ext);

            const build = buildTemplate(pageData, translation, templateBase, templateFile);

            writeFile(build, distFile);

            console.log(`Created:\t${pageConfig.ext}`);

            // console.log({ build, distFile });
        });
    });
} catch (e) {
    console.log(e);
    process.exit(1);
}
