import type { FieldMetadata } from '@/types';
import { FieldEditor } from './FieldEditor';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

/**
 * Represents a single item in the JSON array.
 * Can contain any number of key-value pairs.
 */
type JsonItem = Record<string, any>;

/**
 * Props for the JsonItemEditor component.
 *
 * @property {JsonItem} item - The JSON object item to edit
 * @property {number} index - The position of this item in the array (zero-indexed)
 * @property {FieldMetadata[]} fields - Array of field metadata describing the structure
 * @property {Function} onUpdate - Callback invoked when any field in this item is updated
 */
type JsonItemEditorProps = {
    item: JsonItem;
    index: number;
    fields: FieldMetadata[];
    onDeleteField: (itemIndex: number, key: string) => void;
    onDuplicate: (itemIndex: number) => void;
    onUpdate: (itemIndex: number, key: string, value: any) => void;
};

/**
 * JsonItemEditor component renders an editable card for a single JSON array item.
 *
 * The component organizes fields by type:
 * - Numeric fields are grouped horizontally at the top for compact display
 * - Other fields (strings, long text) are stacked vertically below
 *
 * Each field is rendered using the FieldEditor component with appropriate controls.
 *
 * @component
 * @param {JsonItemEditorProps} props - Component props
 * @returns {React.ReactElement} Rendered item editor card
 *
 * @example
 * ```tsx
 * <JsonItemEditor
 *   item={{ name: 'John', age: 30, bio: 'Long text...' }}
 *   index={0}
 *   fields={[
 *     { key: 'name', type: 'string', isLongText: false },
 *     { key: 'age', type: 'number', isLongText: false },
 *     { key: 'bio', type: 'string', isLongText: true }
 *   ]}
 *   onUpdate={(index, key, value) => console.log('Updated', key)}
 * />
 * ```
 */
export const JsonItemEditor: React.FC<JsonItemEditorProps> = ({
    item,
    index,
    fields,
    onUpdate,
    onDeleteField,
    onDuplicate,
}) => {
    const numericFields = fields.filter((f) => f.type === 'number');
    const otherFields = fields.filter((f) => f.type !== 'number');

    return (
        <div className="space-y-4 rounded-lg border p-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Item {index + 1}</h3>
                <InteractiveHoverButton onClick={() => onDuplicate(index)}>Duplicate</InteractiveHoverButton>
            </div>
            {numericFields.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {numericFields.map((field) => (
                        <FieldEditor
                            key={field.key}
                            field={field}
                            value={item[field.key]}
                            itemIndex={index}
                            onUpdate={onUpdate}
                            onDelete={onDeleteField}
                        />
                    ))}
                </div>
            )}
            {otherFields.map((field) => (
                <FieldEditor
                    key={field.key}
                    field={field}
                    value={item[field.key]}
                    itemIndex={index}
                    onUpdate={onUpdate}
                    onDelete={onDeleteField}
                />
            ))}
        </div>
    );
};
