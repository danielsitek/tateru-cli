import { describe, test, expect } from 'simple-test-framework';
import { sortBy } from './sortBy';

describe('sortBy', () => {
    test('should return the same value if input is not an array', () => {
        expect(sortBy('not an array', 'key')).toBe('not an array');
        expect(sortBy(null, 'key')).toBe(null);
        expect(sortBy(undefined, 'key')).toBe(undefined);
        expect(sortBy({}, 'key')).toEqual({});
    });

    test('should sort array of objects by given key', () => {
        const input = [
            { name: 'Charlie', age: 30 },
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 35 }
        ];

        const expectedByName = [
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 35 },
            { name: 'Charlie', age: 30 }
        ];

        const expectedByAge = [
            { name: 'Alice', age: 25 },
            { name: 'Charlie', age: 30 },
            { name: 'Bob', age: 35 }
        ];

        expect(sortBy(input, 'name')).toEqual(expectedByName);
        expect(sortBy([...input], 'age')).toEqual(expectedByAge);
    });

    test('should handle empty array', () => {
        expect(sortBy([], 'key')).toEqual([]);
    });

    test('should handle array with missing keys', () => {
        const input = [
            { name: 'Charlie' },
            { name: 'Alice', age: 25 },
            { age: 35 }
        ];

        const expected = [
            { name: 'Alice', age: 25 },
            { name: 'Charlie' },
            { age: 35 }
        ];

        expect(sortBy(input, 'name')).toEqual(expected);
    });

    test('should handle array with different value types', () => {
        const input = [
            { value: '2' },
            { value: 1 },
            { value: '3' },
            { value: null },
            { value: undefined },
        ];

        const expected = [
            { value: 1 },
            { value: '2' },
            { value: '3' },
            { value: null },
            { value: undefined },
        ];

        expect(sortBy(input, 'value')).toEqual(expected);
    });

    test('should mutate original array', () => {
        const input = [
            { name: 'Charlie' },
            { name: 'Alice' },
            { name: 'Bob' }
        ];

        const result = sortBy(input, 'name');

        expect(result).toBe(input); // should be the same reference
        expect(input[0].name).toBe('Alice');
        expect(input[1].name).toBe('Bob');
        expect(input[2].name).toBe('Charlie');
    });
});
