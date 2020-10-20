import { minify } from "html-minifier";

const minifyHtml = (content: string): string => {
    const minified = minify(content, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    return minified;
}

export const minifyBuildContent = (content: string, fileType: string | undefined): string => {
    const type = `${fileType}`.toLocaleLowerCase().trim();

    if (type === 'html') {
        return minifyHtml(content);
    }

    return content;
};
