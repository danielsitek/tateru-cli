import { getHrefData } from './getHrefData';
import { deepMerge } from './deepMerge';
import type { ConfigFile, Environment } from '../../../types';

export const composeData = (
    lang: string,
    configOptionsData: ConfigFile['options']['data'],
    configEnvData: ConfigFile['env'][Environment]['data'],
    configPageData: ConfigFile['pages'][string][string]['data'],
    configPages: ConfigFile['pages'][string],
): Record<string, unknown> => {
    const href = getHrefData(
        configPages, // config.pages.cs
    );

    const data = deepMerge<Record<string, unknown>>(
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
