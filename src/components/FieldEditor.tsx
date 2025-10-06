import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FieldMetadata } from '@/types';
import { Textarea } from './ui/textarea';

type FieldEditorProps = {
    field: FieldMetadata;
    value: any;
    itemIndex: number;
    onUpdate: (itemIndex: number, key: string, value: any) => void;
};

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, value, itemIndex, onUpdate }) => {
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
