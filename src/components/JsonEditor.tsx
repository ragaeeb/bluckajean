import type React from 'react';
import { useState } from 'react';
import { JsonItemEditor } from '@/components/JsonItemEditor';
import { Textarea } from '@/components/ui/textarea';
import { analyzeJsonStructure, fastHash, parseJson } from '@/lib/utils';
import type { FieldMetadata } from '@/types';

/**
 * JsonEditor is the main component for editing JSON arrays.
 *
 * This component provides a visual editor for JSON arrays with the following features:
 * - Paste JSON arrays into a textarea
 * - Automatic JSON parsing with error correction (missing brackets, trailing commas)
 * - Dynamic field type detection (string, number, boolean)
 * - Intelligent UI rendering (textareas for long text, number inputs for numbers)
 * - Real-time editing with state management
 * - RTL support for long text fields
 * - Responsive layout
 */
export const JsonEditor: React.FC = () => {
    const [jsonText, setJsonText] = useState('');
    const [parsedData, setParsedData] = useState<any[] | null>(null);
    const [fields, setFields] = useState<FieldMetadata[]>([]);
    const [editedData, setEditedData] = useState<any[]>([]);
    const [error, setError] = useState<string>('');

    const handleJsonInput = (text: string) => {
        setJsonText(text);
        const parsed = parseJson(text);

        if (parsed) {
            setParsedData(parsed);
            setEditedData(JSON.parse(JSON.stringify(parsed)));
            setFields(analyzeJsonStructure(parsed));
            setError('');
        } else if (text.trim()) {
            setError('Invalid JSON format');
            setParsedData(null);
        } else {
            setError('');
            setParsedData(null);
        }
    };

    const handleFieldUpdate = (itemIndex: number, key: string, value: any) => {
        setEditedData((prev) => {
            const updated = [...prev];
            updated[itemIndex] = { ...updated[itemIndex], [key]: value };
            return updated;
        });
    };

    const handleDeleteField = (itemIndex: number, key: string) => {
        setEditedData((prev) => {
            const updated = [...prev];
            const { [key]: _, ...rest } = updated[itemIndex];
            updated[itemIndex] = rest;
            return updated;
        });
    };

    const handleDuplicateItem = (itemIndex: number) => {
        setEditedData((prev) => {
            const updated = [...prev];
            const itemToDuplicate = { ...updated[itemIndex] };
            updated.splice(itemIndex + 1, 0, itemToDuplicate);
            return updated;
        });
    };

    return (
        <main className="container mx-auto w-full flex-1 space-y-6 p-6">
            <div className="space-y-2">
                <Textarea
                    id="json-input"
                    value={jsonText}
                    onFocus={() => {
                        if (editedData.length) {
                            const savedJson = JSON.stringify(editedData, null, 2);
                            setJsonText(savedJson);
                        }
                    }}
                    onChange={(e) => handleJsonInput(e.target.value)}
                    placeholder="Paste your JSON array here..."
                    className="min-h-[150px] w-full text-[10px] md:text-[10px]"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {parsedData && editedData.length > 0 && (
                <div className="space-y-4">
                    {editedData.map((item, index) => (
                        <JsonItemEditor
                            key={fastHash(item)}
                            item={item}
                            index={index}
                            fields={fields}
                            onDeleteField={handleDeleteField}
                            onDuplicate={handleDuplicateItem}
                            onUpdate={handleFieldUpdate}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};
