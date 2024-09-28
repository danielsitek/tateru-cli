import { ConfigFileOptions, PagesUrlObject } from '../types';


export const getHrefData = (pages: Record<string, Pick<ConfigFileOptions, 'ext'>>) => {
    const href: PagesUrlObject = {};

    Object.keys(pages).forEach((pageName) => {
        href[`${pageName}`] = `/${pages[pageName].ext}`;
    });

    return href;
};
