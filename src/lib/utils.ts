import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FieldMetadata, FieldType } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const detectFieldType = (value: any): FieldType => {
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'boolean') {
        return 'boolean';
    }
    return 'string';
};

const isLongText = (value: string): boolean => {
    return value.length > 100 || value.includes('\n');
};

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
