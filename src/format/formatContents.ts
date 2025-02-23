export const formatContents = async (
    contents: string,
    fileType?: string
): Promise<string> => {
    if (fileType && ['json', 'webmanifest'].includes(fileType)) {
        try {
            return JSON.stringify(JSON.parse(contents), null, 2);
        } catch (error) {
            return contents;
        }
    }

    return contents;
};
