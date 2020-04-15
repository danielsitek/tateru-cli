import { Translations, BuilderOptions } from '../types';
import Pipeline from './utils/pipeline';
import path from 'path';
import fs from 'fs';
import { merge } from 'lodash';
import TwigService from './services/twigService';
import TwigConfiguration from './twig/TwigConfiguration';

/**
 * Render Twig template with configuration from config.json.
 *
 * @param {String} pageName Page name in config.json file.
 */
const renderPage = (pageName: string, translations: Translations, options: BuilderOptions, renderOptions: any, renderExtDir: string, renderSrcDir: string): Pipeline => {
    if (!options.configuration.pages[options.lang][pageName]) {
        throw new Error(`"${pageName}" were not found in config file.`);
    }

    const buildPageConfig = options.configuration.pages[options.lang][pageName];
    const pathToExt = path.resolve(renderExtDir, buildPageConfig.ext);
    const pathToSrc = path.resolve(renderSrcDir, buildPageConfig.src);
    const relativeFileExt = path.join(options.configuration.options.ext, buildPageConfig.ext);
    const relativeFileSrc = path.join(options.configuration.options.src, buildPageConfig.src);

    if (!fs.existsSync(pathToSrc)) {
        throw new Error(`File "${pathToSrc}" does not exits`);
    }

    const fileTwigConfig = new TwigConfiguration(pathToSrc, renderSrcDir);

    const fileRenderOptions: any = merge(
        renderOptions,
        buildPageConfig.data
    );

    const template = TwigService.render(fileTwigConfig, fileRenderOptions, translations);

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

export default renderPage;
