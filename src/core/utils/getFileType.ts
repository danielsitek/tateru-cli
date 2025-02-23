export const getFileType = (filePath: string): string | undefined => {
    const split = filePath.split('.');
    const last = split.pop();

    return last;
};
