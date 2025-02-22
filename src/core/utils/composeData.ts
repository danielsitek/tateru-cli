import { getHrefData } from './getHrefData';
import { deepMerge } from './deepMerge';


export const composeData = (lang: string, configOptionsData: any, configEnvData: any, configPageData: any, configPages: any) => {
    const href = getHrefData(
        configPages // config.pages.cs
    );

    const data = deepMerge(
        {
            ...configOptionsData, // config.options.data
        },
        {
            ...configPageData, // config.pages.cs.index.data
        },
        {
            ...configEnvData, // config.env.dev.data
        },
        {
            lang,
            href,
        },
    );

    return data;
};
