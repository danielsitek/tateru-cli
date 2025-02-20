import { minify } from 'html-minifier';

const minifyHtml = (contents: string): string => {
    const minified = minify(contents, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeScriptTypeAttributes: false,
    });

    return minified;
};

export const minifyContents = (contents: string, fileType: string | undefined): string => {
    const type = `${fileType}`.toLocaleLowerCase().trim();

    if (type === 'html') {
        return minifyHtml(contents);
    }

    return contents;
};
