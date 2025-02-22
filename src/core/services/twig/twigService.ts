import Twig from 'twig';
import type { TwigConfiguration } from '../../../../types';
import { getNestedValue } from './functions/getNestedValue';
import { sortBy } from './filters/sortBy';

export const twigServiceRender = (
    fileTwigConfig: TwigConfiguration,
    fileRenderOptions: any,
    translations: any
) => {
    Twig.extendFunction('trans', (key: string) => {
        return getNestedValue(translations, key) || key;
    });

    Twig.extendFilter('sort_by', sortBy);

    try {
        const template = Twig.twig(fileTwigConfig).render(
            fileRenderOptions
        );

        return template;
    } catch (error) {
        throw new Error(`Failed to render template: ${error instanceof Error ? error.message : String(error)}`);
    }
}
