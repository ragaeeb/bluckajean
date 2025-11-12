import { describe, expect, it } from 'bun:test';
import { deriveEditorState, serializeEditedData } from '@/app/page';

describe('deriveEditorState', () => {
    it('parses valid JSON and builds metadata', () => {
        const json = '[{"name":"Ada","age":28}]';
        const snapshot = deriveEditorState(json);

        expect(snapshot.error).toBe('');
        expect(snapshot.parsedData).not.toBeNull();
        expect(snapshot.fields).toEqual([
            { isLongText: false, key: 'name', type: 'string' },
            { isLongText: false, key: 'age', type: 'number' },
        ]);
        expect(snapshot.editedData).not.toBe(snapshot.parsedData);
        expect(snapshot.editedData).toEqual(snapshot.parsedData);
    });

    it('flags invalid JSON input', () => {
        const snapshot = deriveEditorState('{bad json');
        expect(snapshot.error).toBe('Invalid JSON format');
        expect(snapshot.parsedData).toBeNull();
        expect(snapshot.fields).toHaveLength(0);
    });

    it('returns a clean state for empty input', () => {
        const snapshot = deriveEditorState('   ');
        expect(snapshot.error).toBe('');
        expect(snapshot.parsedData).toEqual([]);
        expect(snapshot.editedData).toEqual([]);
    });
});

describe('serializeEditedData', () => {
    it('formats JSON arrays with indentation', () => {
        const data = [{ name: 'Ada', age: 28 }];
        expect(serializeEditedData(data)).toBe('[\n  {\n    "name": "Ada",\n    "age": 28\n  }\n]');
    });
});
