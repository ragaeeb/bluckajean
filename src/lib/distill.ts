import type { ValueCategory } from '@/types';

/**
 * Options for the distill function.
 */
export interface DistillOptions {
    /**
     * Maximum number of samples to keep per value category.
     * @default 1
     */
    maxPerCategory?: number;
}

const DEFAULT_OPTIONS: Required<DistillOptions> = { maxPerCategory: 1 };

/**
 * Categorizes a value into one of the supported value categories.
 */
const categorizeValue = (value: unknown): ValueCategory => {
    if (value === null) {
        return 'null';
    }
    if (value === undefined) {
        return 'undefined';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    if (typeof value === 'object') {
        return 'object';
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'string') {
        return 'string';
    }
    if (typeof value === 'boolean') {
        return 'boolean';
    }
    return 'other';
};

/**
 * Creates distill functions with the given options.
 */
const createDistiller = (options: Required<DistillOptions>) => {
    const distillValue = (value: unknown): unknown => {
        if (value === null || value === undefined) {
            return value;
        }

        if (Array.isArray(value)) {
            return distillArray(value);
        }

        if (typeof value === 'object') {
            return distillObject(value as Record<string, unknown>);
        }

        return value;
    };

    const distillObject = (obj: Record<string, unknown>): Record<string, unknown> => {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(obj)) {
            result[key] = distillValue(value);
        }

        return result;
    };

    const distillArray = (arr: unknown[]): unknown[] => {
        const categoryCounts = new Map<ValueCategory, number>();
        const result: unknown[] = [];

        for (const item of arr) {
            const category = categorizeValue(item);
            const count = categoryCounts.get(category) || 0;

            // If we haven't reached max for this category, add it
            if (count < options.maxPerCategory) {
                const distilled = distillValue(item);
                categoryCounts.set(category, count + 1);
                result.push(distilled);
            }
        }

        return result;
    };

    return distillValue;
};

/**
 * Distills a JSON structure by reducing arrays to show only unique value type variations.
 * This is useful for creating minimal JSON samples that demonstrate structure for AI agents.
 *
 * @param data - The JSON data to distill (can be an object or array)
 * @param options - Configuration options
 * @returns The distilled JSON with reduced arrays showing unique variations
 *
 * @example
 * const input = {
 *   users: [null, undefined, 1, 2, 3, "abc", {name: "John"}, 4, 5]
 * };
 * const output = distill(input);
 * // Returns: { users: [null, undefined, 1, "abc", {name: "John"}] }
 *
 * // Keep 2 samples per category
 * const output2 = distill(input, { maxPerCategory: 2 });
 * // Returns: { users: [null, undefined, 1, 2, "abc", {name: "John"}] }
 */
export const distill = (data: unknown, options: DistillOptions = {}): unknown => {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const distillValue = createDistiller(mergedOptions);
    return distillValue(data);
};
