import { Translations, ConfigFile, BuilderOptions } from '../types';
import Pipeline from './utils/pipeline';
import path from 'path';
import fs from 'fs';
import prepareTwigConfiguration from './twig/prepareTwigConfiguration';
import { merge } from 'lodash';
import TwigService from './services/twigService';

/**
 * Render Twig template with configuration from config.json.
 *
 * @param {String} pageName Page name in config.json file.
 */
const renderPage = (pageName: string, translations: Translations, configFile: ConfigFile, options: BuilderOptions, renderOptions: any, renderExtDir: string, renderSrcDir: string): Pipeline => {
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
