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

export const minifyContents = async (
    contents: string,
    fileType: string | undefined,
): Promise<string> => {
    const type = `${fileType}`.toLocaleLowerCase().trim();

    if (type === 'html') {
        return minifyHtml(contents);
    }

    return contents;
};
