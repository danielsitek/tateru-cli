import minifyHtml from "@minify-html/node";

const minifyContentsHtml = async (contents: string): Promise<string> => {
    const minified = await minifyHtml.minify(Buffer.from(contents), {
        minify_css: true,
        minify_js: true,
    });

    return minified.toString();
};

export const minifyContents = async (
    contents: string,
    fileType: string | undefined,
): Promise<string> => {
    const type = `${fileType}`.toLocaleLowerCase().trim();

    if (type === 'html') {
        return await minifyContentsHtml(contents);
    }

    return contents;
};
