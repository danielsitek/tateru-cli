'use strict';

import path from 'path';
import { merge } from 'lodash';
import { PagesUrlObject, PipelineData, Translations, LanguageString, BuilderOptions } from './types';
import minifyHtml from './app/pipes/minifyHtml';
import saveFile from './app/pipes/saveFile';
import printLog from './app/pipes/printLog';
import TranslationsService from './app/services/translationsService';
import renderPage from './app/renderPage';

const rootDir = path.resolve(process.cwd())

const prepareRenderOptions = (options: BuilderOptions) => {
    const hrefData: PagesUrlObject = {};
    try {
        Object.keys(options.configuration.pages[options.lang]).forEach(pageName => {
            try {
                hrefData[pageName] = `/${options.configuration.pages[options.lang][pageName].ext}`;
            } catch (e) {
                throw new Error(`Cannot find page ext in lang group "${options.lang}".`);
            }
        });
    } catch (e) {
        throw new Error(`Cannot find pages in lang group "${options.lang}".`);
    }

    const renderOptions = merge(
        options.configuration.options.data,
        options.configuration.env[options.env].data,
        {
            href: hrefData,
            lang: options.lang
        }
    );

    return renderOptions
}

/**
 * Run builder
 */
const run = (options: BuilderOptions): void => {

    const renderOptions = prepareRenderOptions(options)
    const renderSrcDir = path.resolve(rootDir, options.configuration.options.src);
    const renderExtDir = path.resolve(rootDir, options.configuration.options.ext);

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
        renderPage(page, translations, options, renderOptions, renderExtDir, renderSrcDir)
            .pipe(prodMinifyHtml)
            .pipe(printLog)
            .pipe(saveFile);
    }

    const buildAllPagesInLang = (lang: LanguageString): void => {
        const translations = TranslationsService.getTranslations(rootDir, options.configuration.translations[lang].src)
        Object.keys(options.configuration.pages[lang]).forEach(page => {
            renderPipeline(page, translations);
        });
    }

    const buildAllPagesInAllLangs = (): void => {
        Object.keys(options.configuration.pages).forEach(lang => {
            buildAllPagesInLang(lang);
        });
    }

    const buildSinglePage = (lang: LanguageString): void => {
        const translations = TranslationsService.getTranslations(rootDir, options.configuration.translations[lang].src)
        renderPipeline(options.flags.page, translations);
    }

    try {
        console.log(`Environment:\t${options.env}`);

        if (options.flags.page && options.flags.lang) {
            // Build single page in selected lang
            buildSinglePage(options.flags.lang);
        } else if (options.flags.page) {
            buildSinglePage(options.lang);
        } else if (options.flags.lang) {
            // Build all pages in single lang
            buildAllPagesInLang(options.flags.lang);
        } else {
            // Build everything
            buildAllPagesInAllLangs();
        }
    } catch (e) {
        throw new Error(e);
    }
}

export default run;
