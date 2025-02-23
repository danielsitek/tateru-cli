const isObject = (obj: any): obj is object => obj && typeof obj === 'object';

export function deepMerge<T, O extends any[] = any[]>(...objects: O): T {
    return objects.reduce(
        (prev, obj) => {
            if (!isObject(prev) || !isObject(obj)) {
                return obj;
            }

            Object.keys(obj).forEach((key) => {
                const pVal = prev[key as keyof {}] as object | any[];
                const oVal = obj[key as keyof object] as object | any[];

                if (Array.isArray(pVal) && Array.isArray(oVal)) {
                    (prev as any)[key as keyof {}] = [...pVal, ...oVal];
                } else if (isObject(pVal) && isObject(oVal)) {
                    (prev as any)[key as keyof {}] = deepMerge(pVal, oVal);
                } else {
                    (prev as any)[key as keyof {}] = oVal;
                }
            });

            return prev;
        },
        Array.isArray(objects[0]) ? [] : {},
    ) as T;
}
