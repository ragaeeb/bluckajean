import type * as React from 'react';

export function DeleteButton(props: React.ComponentProps<'button'>) {
    return (
        <button
            className="cursor-pointer font-bold text-red-500 text-xs hover:text-red-700"
            title="Delete field"
            type="button"
            {...props}
        >
            ✕
        </button>
    );
}
