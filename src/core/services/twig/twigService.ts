import Twig from 'twig';
import type { TwigConfiguration } from '../../../../types';
import { getNestedValue } from './functions/getNestedValue';
import { sortBy } from './filters/sortBy';

class TwigService {
    public static render(
        fileTwigConfig: TwigConfiguration,
        fileRenderOptions: any,
        translations: any
    ) {
        Twig.extendFunction('trans', (key: string) => {
            return getNestedValue(translations, key) || key;
        });

        Twig.extendFilter('sort_by', sortBy);

        const template = Twig.twig(fileTwigConfig).render(
            fileRenderOptions
        ) as string;
        return template;
    }
}

export default TwigService;
