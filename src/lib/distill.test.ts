import { describe, expect, it } from 'bun:test';
import { distill } from './distill';

describe('distill', () => {
    describe('basic values', () => {
        it('should return null unchanged', () => {
            expect(distill(null)).toBeNull();
        });

        it('should return undefined unchanged', () => {
            expect(distill(undefined)).toBeUndefined();
        });

        it('should return primitives unchanged', () => {
            expect(distill(42)).toBe(42);
            expect(distill('hello')).toBe('hello');
            expect(distill(true)).toBe(true);
        });
    });

    describe('small arrays', () => {
        it('should keep single element per category by default', () => {
            expect(distill([1, 2, 3, 4])).toEqual([1]);
            expect(distill([1, 'a', true])).toEqual([1, 'a', true]);
            expect(distill([])).toEqual([]);
        });

        it('should distill nested structures', () => {
            const input = [{ items: [1, 2, 3, 4, 5, 6, 7, 8] }];
            const result = distill(input) as any[];
            expect(result[0].items).toEqual([1]);
        });
    });

    describe('large arrays', () => {
        it('should reduce arrays to one sample per category by default', () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result = distill(input) as any[];
            expect(result).toEqual([1]);
        });

        it('should extract unique value categories', () => {
            const input = [null, null, 1, 2, 'hello', 'world', true, false];
            const result = distill(input) as any[];

            // Should have null, number, string, boolean
            expect(result).toContain(null);
            expect(result.some((v) => typeof v === 'number')).toBe(true);
            expect(result.some((v) => typeof v === 'string')).toBe(true);
            expect(result.some((v) => typeof v === 'boolean')).toBe(true);
        });

        it('should handle arrays with undefined values', () => {
            const input = [undefined, 1, 2, 3, 4, 5];
            const result = distill(input) as any[];
            expect(result).toContain(undefined);
        });

        it('should handle arrays with mixed objects and primitives', () => {
            const input = [{ name: 'John' }, 1, 'text', null, { name: 'Jane' }, 2, 3];
            const result = distill(input) as any[];
            expect(result.length).toBe(4); // object, number, string, null
        });
    });

    describe('nested structures', () => {
        it('should recursively distill nested arrays', () => {
            const input = { users: Array.from({ length: 200 }, (_, i) => i) };
            const result = distill(input) as any;
            expect(result.users).toEqual([0]);
        });

        it('should handle deeply nested structures', () => {
            const input = { level1: { level2: { items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } } };
            const result = distill(input) as any;
            expect(result.level1.level2.items).toEqual([1]);
        });

        it('should distill array of arrays', () => {
            const input = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12], 'string', null];
            const result = distill(input) as any[];
            // Should have array, string, and null categories (1 each)
            expect(result.length).toBe(3);
            expect(result[0]).toEqual([1]); // nested array also distilled
        });
    });

    describe('edge cases', () => {
        it('should handle empty objects', () => {
            expect(distill({})).toEqual({});
        });

        it('should handle objects with no arrays', () => {
            const input = { active: true, age: 30, name: 'John' };
            expect(distill(input)).toEqual(input);
        });

        it('should preserve object structure while distilling arrays', () => {
            const input = { id: 1, name: 'Test', tags: ['a', 'b', 'c', 'd', 'e', 'f'] };
            const result = distill(input) as any;
            expect(result.id).toBe(1);
            expect(result.name).toBe('Test');
            expect(result.tags).toEqual(['a']);
        });
    });

    describe('maxPerCategory option', () => {
        it('should keep multiple samples per category when configured', () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result = distill(input, { maxPerCategory: 3 }) as number[];
            expect(result).toEqual([1, 2, 3]);
        });

        it('should keep samples from different categories', () => {
            const input = [1, 'a', 2, 'b', 3, 'c', null, true];
            const result = distill(input, { maxPerCategory: 2 }) as any[];
            expect(result.filter((v) => typeof v === 'number').length).toBe(2);
            expect(result.filter((v) => typeof v === 'string').length).toBe(2);
        });

        it('should default to 1 sample per category', () => {
            const input = [1, 2, 3, 'a', 'b', 'c'];
            const result = distill(input) as any[];
            expect(result.filter((v) => typeof v === 'number').length).toBe(1);
            expect(result.filter((v) => typeof v === 'string').length).toBe(1);
        });
    });
});
