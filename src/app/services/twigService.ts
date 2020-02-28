import Twig from 'twig';
import { get } from 'lodash';
import { TwigConfiguration } from '../../types';

const sortBy = (value: any, key: any): any => {
    if (!Array.isArray(value)) {
        return value;
    }
    value.sort((a, b) => {
        if (!a[key]) return 0;
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });

    return value;
}

class TwigService {

    public static render (fileTwigConfig: TwigConfiguration, fileRenderOptions: any, translations: any) {

        Twig.extendFunction('trans', (value: string) => {
            return get(translations, value) || value;
        });

        Twig.extendFilter('sort_by', sortBy);

        const template = Twig.twig(fileTwigConfig).render(fileRenderOptions) as string;
        return template;
    }
}

export default TwigService;
