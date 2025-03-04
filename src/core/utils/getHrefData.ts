import type { ConfigFile, PagesUrlObject } from '../../../types';

export const getHrefData = (
    pages: Record<string, Pick<ConfigFile['pages'][string][string], 'ext'>>,
) => {
    const href: PagesUrlObject = {};

    Object.keys(pages).forEach((pageName) => {
        href[pageName] = `/${pages[pageName].ext}`;
    });

    return href;
};
