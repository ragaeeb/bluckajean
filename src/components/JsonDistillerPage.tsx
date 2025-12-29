import type React from 'react';
import { useRef, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { distill } from '@/lib/distill';

/**
 * JSON Distiller page component.
 * Allows users to drag and drop a JSON file to see a distilled version
 * showing only unique value type variations in arrays.
 */
export const JsonDistillerPage: React.FC = () => {
    const [result, setResult] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [maxPerCategory, setMaxPerCategory] = useState(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleFileDrop = (content: string, name: string) => {
        try {
            const parsed = JSON.parse(content);
            const distilled = distill(parsed, { maxPerCategory });
            setResult(JSON.stringify(distilled, null, 2));
            setFileName(name);
            setError('');
        } catch {
            setError('Failed to process JSON');
        }
    };

    const handleError = (message: string) => {
        setError(message);
        setResult(null);
    };

    const handleCopy = async () => {
        const text = textareaRef.current?.value || result;
        if (text) {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleReset = () => {
        setResult(null);
        setFileName('');
        setError('');
    };

    return (
        <main className="container mx-auto w-full flex-1 space-y-6 p-6">
            <div className="space-y-2">
                <h1 className="font-bold text-2xl">JSON Distiller</h1>
                <p className="text-muted-foreground text-sm">
                    Drop a JSON file to extract unique value variations from arrays. Useful for creating minimal JSON
                    samples for AI agents.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <Label htmlFor="max-per-category" className="whitespace-nowrap text-sm">
                    Samples per category:
                </Label>
                <Input
                    id="max-per-category"
                    type="number"
                    min={1}
                    max={10}
                    value={maxPerCategory}
                    onChange={(e) => setMaxPerCategory(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-20"
                />
            </div>

            {!result ? (
                <DropZone onFileDrop={handleFileDrop} onError={handleError} />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{fileName}</span>
                            <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                                distilled
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs transition-colors hover:bg-primary/90"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-md bg-secondary px-3 py-1.5 font-medium text-secondary-foreground text-xs transition-colors hover:bg-secondary/80"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <textarea
                        ref={textareaRef}
                        defaultValue={result}
                        className="max-h-[600px] min-h-[400px] w-full resize-y overflow-auto rounded-lg bg-muted p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </main>
    );
};
