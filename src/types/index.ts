/**
 * Represents the data type of a JSON field.
 * Used to determine the appropriate input component for editing.
 */
export type FieldType = 'string' | 'number' | 'boolean';

/**
 * Metadata about a field in a JSON object.
 * Contains information about the field's key, type, and whether it should be rendered as a long text area.
 *
 * @property {string} key - The property name/key of the field in the JSON object
 * @property {FieldType} type - The data type of the field (string, number, or boolean)
 * @property {boolean} isLongText - Whether the field should be rendered as a textarea (true for text > 100 chars or containing newlines)
 */
export type FieldMetadata = { key: string; type: FieldType; isLongText: boolean };

/**
 * Categories of values for distillation.
 * Used to identify unique value types when reducing arrays.
 */
export type ValueCategory = 'null' | 'undefined' | 'number' | 'string' | 'boolean' | 'object' | 'array' | 'other';

/**
 * Represents a distilled value with its category.
 */
export type DistilledValue = { category: ValueCategory; value: unknown };
