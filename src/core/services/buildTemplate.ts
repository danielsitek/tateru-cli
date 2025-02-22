import prepareTwigConfiguration from './twig/prepareTwigConfiguration';
import TwigService from './twig/twigService';

/**
 *
 * @param data Object - JSON data with twig variables.
 * @param translation Object - JSON data with translation, used in trans() function.
 * @param templateBase String - path to base dir with twig template files, usually src/twig.
 * @param templateFile String - path to twig template, usually src/twig/page.html.twig
 */
export const buildTemplate = (data: any, translation: any, templateBase: string, templateFile: string): string => {
    const fileTwigConfig = prepareTwigConfiguration(templateFile, templateBase);
    const template = TwigService.render(fileTwigConfig, data, translation);

    return template;
};
