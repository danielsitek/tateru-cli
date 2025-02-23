export function* iterateKeys<T>(data: T, key?: keyof T): IterableIterator<keyof T> {
    if (key) {
        yield key;
    } else {
        for (const k of Object.keys(data) as (keyof T)[]) {
            yield k;
        }
    }
}
