'use client';

import type React from 'react';
import { useState } from 'react';
import { JsonItemEditor } from '@/components/JsonItemEditor';
import { Textarea } from '@/components/ui/textarea';
import { analyzeJsonStructure, parseJson } from '@/lib/utils';
import type { FieldMetadata } from '@/types';

const JsonEditor: React.FC = () => {
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

    return (
        <div className="container mx-auto w-full space-y-6 p-6">
            <div className="space-y-2">
                <Textarea
                    id="json-input"
                    value={jsonText}
                    onFocus={() => {
                        const savedJson = JSON.stringify(editedData, null, 2);
                        setJsonText(savedJson);
                    }}
                    onChange={(e) => handleJsonInput(e.target.value)}
                    placeholder="Paste your JSON array here..."
                    className="min-h-[150px] w-full font-mono text-[10px] md:text-[10px]"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {parsedData && editedData.length > 0 && (
                <div className="space-y-4">
                    {editedData.map((item, index) => (
                        <JsonItemEditor
                            key={index.toString()}
                            item={item}
                            index={index}
                            fields={fields}
                            onUpdate={handleFieldUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JsonEditor;
