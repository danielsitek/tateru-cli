'use strict';

import path from 'path';
import { merge } from 'lodash';
import { PagesUrlObject, PipelineData, Translations, LanguageString, BuilderOptions } from './types';
import minifyHtml from './app/pipes/minifyHtml';
import saveFile from './app/pipes/saveFile';
import printLog from './app/pipes/printLog';
import TranslationsService from './app/services/translationsService';
import renderPage from './app/renderPage';

/**
 * Run builder
 */
const run = (options: BuilderOptions): void => {

    const rootDir = path.resolve(process.cwd())

    const hrefData: PagesUrlObject = {};
    try {
        Object.keys(options.configuration.pages[options.lang]).forEach(pageName => {
            try {
                hrefData[pageName] = `/${options.configuration.pages[options.lang][pageName].ext}`;
            } catch (e) {
                console.error(`Cannot find page ext in lang group "${options.lang}".`);
            }
        });
    } catch (e) {
        console.error(`Cannot find pages in lang group "${options.lang}".`);
        process.exit(1);
    }


    const renderOptions = merge(
        options.configuration.options.data,
        options.configuration.env[options.env].data,
        {
            href: hrefData,
            lang: options.lang
        }
    );

    // console.log(renderOptions);

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
        renderPage(page, translations, options.configuration, options, renderOptions, renderExtDir, renderSrcDir)
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

    const buildSinglePage = (lang: LanguageString): void => {
        const translations = TranslationsService.getTranslations(rootDir, options.configuration.translations[lang].src)
        renderPipeline(options.flags.page, translations);
    }

    try {
        console.log(`Environment:\t${options.env}`);

        if (options.flags.page && options.flags.lang) {
            // Build single page in selected lang
            // const translations = TranslationsService.getTranslations(rootDir, options.configuration.translations[options.flags.lang].src)
            // renderPipeline(options.flags.page, translations);
            buildSinglePage(options.flags.lang);
        } else if (options.flags.page) {
            // const translations = TranslationsService.getTranslations(rootDir, options.configuration.translations[options.lang].src)
            // renderPipeline(options.flags.page, translations);
            buildSinglePage(options.lang);
        } else if (options.flags.lang) {
            // Build all pages in single lang
            buildAllPagesInLang(options.flags.lang);
        } else {
            // Build everything
            Object.keys(options.configuration.pages).forEach(lang => {
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
