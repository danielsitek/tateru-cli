export const getKeys = <T extends Record<string, unknown>>(data: T, key?: keyof T): (keyof T)[] => {
    if (key) {
        return [key];
    }

    return Object.keys(data) as (keyof T)[];
};
