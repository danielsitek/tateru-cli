import { merge } from 'lodash';
import { getHrefData } from './getHrefData';


export const composeData = (lang: string, configOptionsData: any, configEnvData: any, configPageData: any, cofigPages: any): any => {
    const href = getHrefData(
        cofigPages // config.pages.cs
    );

    const data = merge(
        {
            ...configOptionsData // config.options.data
        },
        {
            ...configPageData // config.pages.cs.index.data
        },
        {
            ...configEnvData // config.env.dev.data
        },
        {
            lang,
            href
        }
    );

    return data;
};
