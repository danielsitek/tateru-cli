import Twig from 'twig';
import { get } from 'lodash';
import { TwigConfigurationInterface } from '../../types';

const sort = (a: any, b: any): number => {
    if (!a) return 0;
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

const sortBy = (value: any, key: any): any => {
    if (!Array.isArray(value)) {
        return value;
    }

    value.sort((a, b) => sort(a[key], b[key]));

    return value;
}

class TwigService {

    public static render (fileTwigConfig: TwigConfigurationInterface, fileRenderOptions: any, translations: any) {

        Twig.extendFunction('trans', (value: string) => {
            return get(translations, value) || value;
        });

        Twig.extendFilter('sort_by', sortBy);

        const template = Twig.twig(fileTwigConfig).render(fileRenderOptions) as string;
        return template;
    }
}

export default TwigService;
