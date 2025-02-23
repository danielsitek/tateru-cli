import type { ConfigFileOptions, PagesUrlObject } from '../../../types';

export const getHrefData = (
    pages: Record<string, Pick<ConfigFileOptions, 'ext'>>,
) => {
    const href: PagesUrlObject = {};

    Object.keys(pages).forEach((pageName) => {
        href[pageName as string] = `/${pages[pageName as string].ext}`;
    });

    return href;
};
