import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FieldMetadata } from '@/types';
import { Textarea } from './ui/textarea';

/**
 * Props for the FieldEditor component.
 *
 * @property {FieldMetadata} field - Metadata about the field being edited (key, type, isLongText)
 * @property {any} value - Current value of the field
 * @property {number} itemIndex - Index of the item in the JSON array
 * @property {Function} onUpdate - Callback function invoked when the field value changes
 */
type FieldEditorProps = {
    field: FieldMetadata;
    value: any;
    itemIndex: number;
    onUpdate: (itemIndex: number, key: string, value: any) => void;
};

/**
 * FieldEditor component renders the appropriate input control based on field metadata.
 *
 * Renders different input types based on the field configuration:
 * - Textarea: For long text fields (> 100 chars or with newlines) with RTL support
 * - Number input: For numeric fields with custom styling to hide spinners
 * - Text input: Default for all other field types
 *
 * @component
 * @param {FieldEditorProps} props - Component props
 * @returns {React.ReactElement} Rendered field editor component
 *
 * @example
 * ```tsx
 * <FieldEditor
 *   field={{ key: 'name', type: 'string', isLongText: false }}
 *   value="John Doe"
 *   itemIndex={0}
 *   onUpdate={(index, key, value) => console.log('Updated', key, value)}
 * />
 * ```
 */
export const FieldEditor: React.FC<FieldEditorProps> = ({ field, value, itemIndex, onUpdate }) => {
    /**
     * Handles changes to the field value.
     * Parses numeric values to float, keeps strings as-is.
     *
     * @param {string} newValue - The new value from the input
     */
    const handleChange = (newValue: string) => {
        const parsedValue = field.type === 'number' ? parseFloat(newValue) : newValue;
        onUpdate(itemIndex, field.key, parsedValue);
    };

    if (field.isLongText) {
        return (
            <div className="space-y-2">
                <Label htmlFor={`${itemIndex}-${field.key}`}>{field.key}</Label>
                <Textarea
                    id={`${itemIndex}-${field.key}`}
                    defaultValue={String(value)}
                    dir="rtl"
                    className="min-h-[120px] w-full font-mono text-sm"
                    onBlur={(e) => handleChange(e.target.value)}
                />
            </div>
        );
    }

    if (field.type === 'number') {
        return (
            <div className="w-auto space-y-1">
                <Label htmlFor={`${itemIndex}-${field.key}`} className="text-xs">
                    {field.key}
                </Label>
                <Input
                    id={`${itemIndex}-${field.key}`}
                    type="number"
                    defaultValue={String(value)}
                    className="w-32 font-mono text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    onBlur={(e) => handleChange(e.target.value)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={`${itemIndex}-${field.key}`}>{field.key}</Label>
            <Input
                id={`${itemIndex}-${field.key}`}
                type="text"
                defaultValue={String(value)}
                className="w-full font-mono text-sm"
                onBlur={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};
