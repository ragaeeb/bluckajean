import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FieldMetadata, FieldType } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Detects the type of a JavaScript value for JSON field analysis.
 * Numbers and booleans are detected, everything else defaults to string.
 *
 * @param {any} value - The value to analyze
 * @returns {FieldType} The detected field type ('string', 'number', or 'boolean')
 */
const detectFieldType = (value: any): FieldType => {
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'boolean') {
        return 'boolean';
    }
    return 'string';
};

/**
 * Determines if a string value should be rendered as a long text area.
 * Returns true if the string is longer than 100 characters or contains newlines.
 *
 * @param {string} value - The string value to check
 * @returns {boolean} True if the value should be rendered as a textarea, false otherwise
 */
const isLongText = (value: string): boolean => {
    return value.length > 100 || value.includes('\n');
};

/**
 * Analyzes the structure of a JSON array to extract field metadata.
 * Examines the first item in the array to determine field types and display requirements.
 *
 * @param {any[]} data - Array of JSON objects to analyze
 * @returns {FieldMetadata[]} Array of field metadata containing key, type, and display information
 * @example
 * const data = [{ name: 'John', age: 30, bio: 'A very long biography...' }];
 * const fields = analyzeJsonStructure(data);
 * // Returns: [
 * //   { key: 'name', type: 'string', isLongText: false },
 * //   { key: 'age', type: 'number', isLongText: false },
 * //   { key: 'bio', type: 'string', isLongText: true }
 * // ]
 */
export const analyzeJsonStructure = (data: any[]): FieldMetadata[] => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    const firstItem = data[0];
    return Object.keys(firstItem).map((key) => ({
        isLongText: typeof firstItem[key] === 'string' && isLongText(firstItem[key]),
        key,
        type: detectFieldType(firstItem[key]),
    }));
};

/**
 * Parses a JSON string into an array, with automatic error correction.
 * Attempts to fix common JSON formatting issues like missing brackets and trailing commas.
 *
 * @param {string} text - The JSON string to parse
 * @returns {any[] | null} Parsed array if successful, null if parsing fails
 * @example
 * // Valid JSON
 * parseJson('[{"name": "John"}]'); // Returns: [{ name: 'John' }]
 *
 * // Auto-corrects missing brackets
 * parseJson('{"name": "John"}'); // Returns: [{ name: 'John' }]
 *
 * // Handles trailing commas
 * parseJson('[{"name": "John",}]'); // Returns: [{ name: 'John' }]
 *
 * // Invalid JSON returns null
 * parseJson('{invalid}'); // Returns: null
 */
export const parseJson = (text: string): any[] | null => {
    try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        let cleaned = text.trim();

        if (!cleaned.startsWith('[')) {
            cleaned = `[${cleaned}`;
        }
        if (!cleaned.endsWith(']')) {
            cleaned = `${cleaned}]`;
        }

        cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

        try {
            const parsed = JSON.parse(cleaned);
            return Array.isArray(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }
};
