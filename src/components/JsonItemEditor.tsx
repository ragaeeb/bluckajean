import type { FieldMetadata } from '@/types';
import { FieldEditor } from './FieldEditor';

type JsonItem = Record<string, any>;

type JsonItemEditorProps = {
    item: JsonItem;
    index: number;
    fields: FieldMetadata[];
    onUpdate: (itemIndex: number, key: string, value: any) => void;
};

export const JsonItemEditor: React.FC<JsonItemEditorProps> = ({ item, index, fields, onUpdate }) => {
    const numericFields = fields.filter((f) => f.type === 'number');
    const otherFields = fields.filter((f) => f.type !== 'number');

    return (
        <div className="space-y-4 rounded-lg border p-6">
            <h3 className="font-semibold text-lg">Item {index + 1}</h3>
            {numericFields.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {numericFields.map((field) => (
                        <FieldEditor
                            key={field.key}
                            field={field}
                            value={item[field.key]}
                            itemIndex={index}
                            onUpdate={onUpdate}
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
                />
            ))}
        </div>
    );
};
