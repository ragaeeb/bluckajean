import { describe, expect, it } from 'bun:test';
import { analyzeJsonStructure, parseJson } from './utils';

describe('parseJson', () => {
    it('should parse valid JSON array', () => {
        const input = '[{"name": "John", "age": 30}]';
        const result = parseJson(input);
        expect(result).toEqual([{ age: 30, name: 'John' }]);
    });

    it('should parse valid JSON array with multiple items', () => {
        const input = '[{"id": 1}, {"id": 2}, {"id": 3}]';
        const result = parseJson(input);
        expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('should return null for invalid JSON', () => {
        const input = '{invalid json}';
        const result = parseJson(input);
        expect(result).toBeNull();
    });

    it('should return null for non-array JSON', () => {
        const input = '{"name": "John"}';
        const result = parseJson(input);
        expect(result).toBeNull();
    });

    it('should handle empty array', () => {
        const input = '[]';
        const result = parseJson(input);
        expect(result).toEqual([]);
    });

    it('should auto-wrap objects in array brackets if missing opening bracket', () => {
        const input = '{"name": "John"}]';
        const result = parseJson(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    it('should auto-wrap objects in array brackets if missing closing bracket', () => {
        const input = '[{"name": "John"}';
        const result = parseJson(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    it('should handle trailing commas', () => {
        const input = '[{"name": "John",}]';
        const result = parseJson(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    it('should handle trailing commas in arrays', () => {
        const input = '[{"name": "John"},]';
        const result = parseJson(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    it('should handle whitespace', () => {
        const input = '  [  { "name" : "John" }  ]  ';
        const result = parseJson(input);
        expect(result).toEqual([{ name: 'John' }]);
    });

    it('should handle complex nested objects', () => {
        const input = '[{"user": {"name": "John", "age": 30}, "active": true}]';
        const result = parseJson(input);
        expect(result).toEqual([{ active: true, user: { age: 30, name: 'John' } }]);
    });
});

describe('analyzeJsonStructure', () => {
    it('should detect number fields', () => {
        const data = [{ age: 30, salary: 50000 }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([
            { isLongText: false, key: 'age', type: 'number' },
            { isLongText: false, key: 'salary', type: 'number' },
        ]);
    });

    it('should detect boolean fields', () => {
        const data = [{ active: true, verified: false }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([
            { isLongText: false, key: 'active', type: 'boolean' },
            { isLongText: false, key: 'verified', type: 'boolean' },
        ]);
    });

    it('should detect long text fields (more than 100 characters)', () => {
        const longText = 'a'.repeat(101);
        const data = [{ description: longText }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: true, key: 'description', type: 'string' }]);
    });

    it('should detect long text fields with newlines', () => {
        const data = [{ description: 'Line 1\nLine 2\nLine 3' }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: true, key: 'description', type: 'string' }]);
    });

    it('should not mark short text as long text', () => {
        const data = [{ description: 'Short text' }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: false, key: 'description', type: 'string' }]);
    });

    it('should return empty array for empty data', () => {
        const data: any[] = [];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([]);
    });

    it('should handle nested objects as strings', () => {
        const data = [{ user: { name: 'John' } }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: false, key: 'user', type: 'string' }]);
    });

    it('should handle arrays as strings', () => {
        const data = [{ tags: ['tag1', 'tag2'] }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: false, key: 'tags', type: 'string' }]);
    });

    it('should handle null values as strings', () => {
        const data = [{ value: null }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: false, key: 'value', type: 'string' }]);
    });

    it('should handle exactly 100 characters as not long text', () => {
        const text = 'a'.repeat(100);
        const data = [{ description: text }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: false, key: 'description', type: 'string' }]);
    });

    it('should handle empty strings as not long text', () => {
        const data = [{ description: '' }];
        const result = analyzeJsonStructure(data);
        expect(result).toEqual([{ isLongText: false, key: 'description', type: 'string' }]);
    });
});
