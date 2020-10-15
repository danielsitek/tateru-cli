#!/usr/bin/env node

'use strict';

import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';
import { buildTemplate } from '.';
import CliService from './app/services/cliService';
import { ConfigFile, PagesUrlObject } from './types';
// import TateruCLI from './index';

// TateruCLI();

const { configFile, env, lang } = CliService.init();

const processCwd = process.cwd();

const getProjectDirt = (configFileName: string, cwd: string): string => {
    const fileSrc = path.resolve(cwd, configFileName);
    const dirName = path.dirname(fileSrc);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load project root ${dirName}`);
    }

    return dirName;
};

const loadConfiguration = (configFileName: string, cwd: string): ConfigFile => {
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

const loadTranslation = (projectRoot: string, translationFilePath: string): any => {
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

const hrefData = (pages: any): any => {
    const href: PagesUrlObject = {};

    Object.keys(pages).forEach(pageName => {
        href[pageName] = `/${pages[pageName].ext}`;
    });

    return href;
};

const getTemplateBase = (projectRoot: string, templateSrc: string): string => {
    const fileSrc = path.resolve(projectRoot, templateSrc);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load template base ${fileSrc}`);
    }

    return fileSrc;
};

const getTemplateFile = (templateBase: string, templateFilePath: string): string => {
    const fileSrc = path.resolve(templateBase, templateFilePath);

    if (!fs.existsSync(fileSrc)) {
        throw new Error(`Cannot load template file ${fileSrc}`);
    }

    return fileSrc;
};

try {
    const projectDir = getProjectDirt(configFile, processCwd);

    console.log({ projectDir });

    const config = loadConfiguration(configFile, processCwd);

    console.log({ config });

    const translation = loadTranslation(projectDir, config.translations.cs.src);

    console.log({ translation });

    const templateBase = getTemplateBase(projectDir, config.options.src);

    const templateFile = getTemplateFile(templateBase, config.pages.cs.index.src);

    console.log({ configFile, env, lang });

    const href = hrefData(config.pages.cs);

    const pageData = merge(
        {
            ...config.options.data
        },
        {
            ...config.pages.cs.index.data
        },
        {
            ...config.env.dev.data
        },
        {
            lang,
            href
        }
    );

    const distFile = path.resolve(processCwd, config.options.ext, config.pages.cs.index.ext);

    const build = buildTemplate(pageData, translation, templateBase, templateFile);

    console.log({
        build,
        distFile
    });
} catch (e) {
    console.log(e);
    process.exit(1);
}
