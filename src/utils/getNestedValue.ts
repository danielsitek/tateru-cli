type GetPath = string | number | Array<string | number>;

export function getNestedValue<T>(
    obj: Record<string, any>,
    path: GetPath
): T | undefined {
    const keys = Array.isArray(path) ? path : String(path).split('.');
    let result: any = obj;

    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return undefined;
        }

        if (typeof key === 'string' && key.includes('[') && key.includes(']')) {
            const [arrayKey, indexStr] = key.split(/[\[\]]/);
            const index = parseInt(indexStr, 10);
            result = result[arrayKey]?.[index];
        } else {
            result = result[key];
        }
    }

    return result as T | undefined;
}

