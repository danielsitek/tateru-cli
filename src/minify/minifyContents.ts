import { minify } from 'html-minifier-next';

const minifyHtml = async (contents: string): Promise<string> => {
    const minified = await minify(contents, {
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
        return await minifyHtml(contents);
    }

    return contents;
};
