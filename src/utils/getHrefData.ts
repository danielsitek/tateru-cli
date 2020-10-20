import { PagesUrlObject } from '../types';


export const getHrefData = (pages: any): any => {
    const href: PagesUrlObject = {};

    Object.keys(pages).forEach(pageName => {
        href[pageName] = `/${pages[pageName].ext}`;
    });

    return href;
};
