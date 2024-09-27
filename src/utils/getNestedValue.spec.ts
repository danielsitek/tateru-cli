import { describe, test, expect } from 'simple-test-framework';
import { getNestedValue } from './getNestedValue';

describe('getNestedValue', () => {
    const obj = {
        index: {
            header: {
                a: "Some index header A",
                b: [1, 2, 3],
            },
        },
        homepage: {
            hero: {
                title: "Some homepage hero title",
            },
            title: "Some homepage title",
        },
    };

    test('retrieves nested value using dot notation', () => {
        const result = getNestedValue(obj, 'homepage.hero.title');
        expect(result).toBe("Some homepage hero title");
    });

    test('retrieves nested value using array notation', () => {
        const result = getNestedValue(obj, ['index', 'header', 'b', 1]);
        expect(result).toBe(2);
    });

    test('retrieves nested value using dot notation with number', () => {
        const result = getNestedValue(obj, 'index.header.b.0');
        expect(result).toBe(1);
    });

    test('retrieves nested value using bracket notation', () => {
        const result = getNestedValue(obj, 'index.header.b[0]');
        expect(result).toBe(1);
    });

    test('returns undefined for non-existent path', () => {
        const result = getNestedValue(obj, 'index.footer.text');
        expect(result).toBeUndefined();
    });

    test('handles nested objects correctly', () => {
        const result = getNestedValue(obj, 'index.header');
        expect(result).toEqual({ a: "Some index header A", b: [1, 2, 3] });
    });

    test('handles arrays correctly', () => {
        const result = getNestedValue(obj, 'index.header.b');
        expect(result).toEqual([1, 2, 3]);
    });

    test('returns undefined for empty object', () => {
        const result = getNestedValue({}, 'any.path');
        expect(result).toBeUndefined();
    });

    test('returns undefined when accessing property of primitive', () => {
        const result = getNestedValue(obj, 'homepage.hero.title.nonexistent');
        expect(result).toBeUndefined();
    });
});
