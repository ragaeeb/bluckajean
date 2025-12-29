import type React from 'react';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
    onFileDrop: (content: string, fileName: string) => void;
    onError: (message: string) => void;
    className?: string;
}

/**
 * A drag-and-drop zone component for JSON file uploads.
 * Provides visual feedback during drag operations and validates file content.
 */
export const DropZone: React.FC<DropZoneProps> = ({ onFileDrop, onError, className }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files.length === 0) {
                onError('No file dropped');
                return;
            }

            const file = files[0];
            if (!file.name.endsWith('.json') && file.type !== 'application/json') {
                onError('Please drop a JSON file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                try {
                    // Validate it's valid JSON
                    JSON.parse(content);
                    onFileDrop(content, file.name);
                } catch {
                    onError('Invalid JSON file');
                }
            };
            reader.onerror = () => {
                onError('Failed to read file');
            };
            reader.readAsText(file);
        },
        [onFileDrop, onError],
    );

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) {
                return;
            }

            const file = files[0];
            if (!file.name.endsWith('.json') && file.type !== 'application/json') {
                onError('Please select a JSON file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                try {
                    JSON.parse(content);
                    onFileDrop(content, file.name);
                } catch {
                    onError('Invalid JSON file');
                }
            };
            reader.onerror = () => {
                onError('Failed to read file');
            };
            reader.readAsText(file);

            // Reset the input so the same file can be selected again
            e.target.value = '';
        },
        [onFileDrop, onError],
    );

    return (
        <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200',
                isDragging
                    ? 'scale-[1.02] border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                className,
            )}
        >
            <input type="file" accept=".json,application/json" onChange={handleFileInputChange} className="sr-only" />
            <div className="text-center">
                <svg
                    className={cn(
                        'mx-auto h-12 w-12 transition-colors',
                        isDragging ? 'text-primary' : 'text-muted-foreground',
                    )}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <p className={cn('mt-4 font-medium text-sm', isDragging ? 'text-primary' : 'text-muted-foreground')}>
                    {isDragging ? 'Drop your JSON file here' : 'Drag & drop a JSON file'}
                </p>
                <p className="mt-1 text-muted-foreground/70 text-xs">or click to browse</p>
            </div>
        </label>
    );
};
