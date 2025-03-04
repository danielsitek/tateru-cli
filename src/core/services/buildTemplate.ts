import { prepareTwigConfiguration } from './twig/prepareTwigConfiguration';
import { twigServiceRender } from './twig/twigService';

/**
 * Build twig template with provided data.
 *
 * @param renderData Object - JSON data with twig variables.
 * @param translations Object - JSON data with translation, used in trans() function.
 * @param templateBase String - path to base dir with twig template files, usually src/twig.
 * @param templateFile String - path to twig template, usually src/twig/page.html.twig
 */
export const buildTemplate = (
    renderData: Record<string, unknown>,
    translations: Record<string, unknown>,
    templateBase: string,
    templateFile: string,
): string => {
    const fileTwigConfig = prepareTwigConfiguration(templateFile, templateBase);
    const template = twigServiceRender(fileTwigConfig, renderData, translations);

    return template;
};
