import type React from 'react';
import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { JsonItemEditor } from '@/components/JsonItemEditor';
import { Textarea } from '@/components/ui/textarea';
import { analyzeJsonStructure, fastHash, parseJson } from '@/lib/utils';
import type { FieldMetadata } from '@/types';

/**
 * JsonEditor is the main application component for editing JSON arrays.
 *
 * This component provides a visual editor for JSON arrays with the following features:
 * - Paste JSON arrays into a textarea
 * - Automatic JSON parsing with error correction (missing brackets, trailing commas)
 * - Dynamic field type detection (string, number, boolean)
 * - Intelligent UI rendering (textareas for long text, number inputs for numbers)
 * - Real-time editing with state management
 * - RTL support for long text fields
 * - Responsive layout
 *
 * The editor automatically:
 * - Detects field types from the first array item
 * - Groups numeric fields horizontally for compact display
 * - Renders long text (>100 chars or multi-line) in textareas
 * - Updates the JSON in the input field when focused
 *
 * @component
 * @returns {React.ReactElement} The main JSON editor interface
 */
const App: React.FC = () => {
    /**
     * Raw JSON text input by the user.
     * Updated whenever the textarea changes.
     */
    const [jsonText, setJsonText] = useState('');

    /**
     * The original parsed JSON data from user input.
     * Null when no valid JSON has been entered.
     */
    const [parsedData, setParsedData] = useState<any[] | null>(null);

    /**
     * Metadata about each field in the JSON structure.
     * Derived from analyzing the first item in the array.
     */
    const [fields, setFields] = useState<FieldMetadata[]>([]);

    /**
     * The working copy of the JSON data being edited.
     * Changes are tracked here before being reflected in the textarea.
     */
    const [editedData, setEditedData] = useState<any[]>([]);

    /**
     * Error message displayed when JSON parsing fails.
     * Empty string when there's no error.
     */
    const [error, setError] = useState<string>('');

    /**
     * Handles changes to the JSON textarea input.
     * Parses the JSON, extracts field metadata, and updates state.
     *
     * @param {string} text - The new JSON text from the textarea
     */
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

    /**
     * Updates a specific field in a JSON array item.
     * Called when a user modifies a field in the editor.
     *
     * @param {number} itemIndex - The index of the item in the array
     * @param {string} key - The field key to update
     * @param {any} value - The new value for the field
     */
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
        <div className="flex min-h-screen flex-col antialiased">
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
            <Footer />
        </div>
    );
};

export default App;
