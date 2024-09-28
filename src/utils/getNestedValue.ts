type GetPath = string | number | Array<string | number>;

export function getNestedValue<T>(
    obj: Record<string, any>,
    path: GetPath
): T | undefined {
    // First, try to get the value directly (for i18n-like keys)
    if (typeof path === 'string' && path in obj) {
        return obj[path as string];
    }

    // If not found, proceed with nested object traversal
    const keys = Array.isArray(path) ? path : String(path).split('.');
    let result: any = obj;

    for (const key of keys) {
        if (result === null || typeof result !== 'object') {
            return;
        }

        if (typeof key === 'string' && key.includes('[') && key.includes(']')) {
            const [arrayKey, indexStr] = key.split(/[\[\]]/);
            const index = parseInt(indexStr, 10);
            result = result[arrayKey as string]?.[index as number];
        } else {
            result = result[key as string];
        }
    }

    return result as T | undefined;
}
