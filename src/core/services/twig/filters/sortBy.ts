const sort = (a: any, b: any): number => {
    if (!a) {
        return 0;
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

export const sortBy = (value: any, key: any): any => {
    if (!Array.isArray(value)) {
        return value;
    }

    value.sort((a, b) => sort(a[key as string], b[key as string]));

    return value;
};
