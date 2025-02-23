export const getPagesKeys = (configPages: any, page?: string): string[] => {
    if (page) {
        return [page];
    }

    return Object.keys(configPages);
};
