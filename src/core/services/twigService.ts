import Twig from 'twig';
import type { TwigConfiguration } from '../../../types';
import { getNestedValue } from '../utils/getNestedValue';

const sort = (a: any, b: any): number => {
    if (!a) {
        return 0;
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

const sortBy = (value: any, key: any): any => {
    if (!Array.isArray(value)) {
        return value;
    }

    value.sort((a, b) => sort(a[key as string], b[key as string]));

    return value;
};

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
