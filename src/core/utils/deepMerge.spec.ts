import { describe, test, expect } from 'simple-test-framework';
import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
    test('merges simple objects', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('merges nested objects', () => {
        const obj1 = { a: { x: 1, y: 2 }, b: 3 };
        const obj2 = { a: { y: 3, z: 4 }, c: 5 };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: { x: 1, y: 3, z: 4 }, b: 3, c: 5 });
    });

    test('concatenates arrays', () => {
        const obj1 = { a: [1, 2], b: 2 };
        const obj2 = { a: [3, 4], c: 3 };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: [1, 2, 3, 4], b: 2, c: 3 });
    });

    test('handles arrays of objects', () => {
        const obj1 = { amit: [{ susanta: 20 }, { durgam: 40 }] };
        const obj2 = { amit: [{ chinmoy: 30 }, { kripamoy: 50 }] };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({
            amit: [
                { susanta: 20 },
                { durgam: 40 },
                { chinmoy: 30 },
                { kripamoy: 50 },
            ],
        });
    });

    test('overwrites primitives', () => {
        const obj1 = { a: 1, b: 'hello' };
        const obj2 = { b: 'world', c: true };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: 1, b: 'world', c: true });
    });

    test('handles multiple objects', () => {
        const obj1 = { a: 1 };
        const obj2 = { b: 2 };
        const obj3 = { c: 3 };
        const result = deepMerge(obj1, obj2, obj3);
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test('does not modify original objects', () => {
        const obj1 = { a: { x: 1 } };
        const obj2 = { a: { y: 2 } };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: { x: 1, y: 2 } });
        expect(obj1).toEqual({ a: { x: 1 } });
        expect(obj2).toEqual({ a: { y: 2 } });
    });

    test('handles empty objects', () => {
        const obj1 = {};
        const obj2 = { a: 1 };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: 1 });
    });

    test('returns last item if all are non-objects', () => {
        const result = deepMerge<number>(
            1,
            'string',
            true,
            null,
            undefined,
            42,
        );
        expect(result).toBe(42);
    });
});
