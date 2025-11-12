import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render } from '@testing-library/react';
import type { TestNode } from '@testing-library/dom';
import { FieldEditor } from '@/components/FieldEditor';
import type { FieldMetadata } from '@/types';

const findNode = (nodes: TestNode[], predicate: (node: TestNode) => boolean): TestNode => {
    const stack = [...nodes];
    while (stack.length) {
        const node = stack.shift()!;
        if (predicate(node)) {
            return node;
        }
        stack.unshift(...node.children);
    }
    throw new Error('Node not found');
};

describe('FieldEditor', () => {
    const baseField = (overrides: Partial<FieldMetadata> = {}): FieldMetadata => ({
        isLongText: false,
        key: 'name',
        type: 'string',
        ...overrides,
    });

    it('renders a long text textarea with rtl detection and allows deleting', () => {
        const onUpdate = mock();
        const onDelete = mock();
        const longText = 'a'.repeat(120);

        const { container } = render(
            <FieldEditor
                field={baseField({ key: 'bio', isLongText: true })}
                value={longText}
                itemIndex={0}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />,
        );

        const textarea = findNode(container, (node) => node.type === 'textarea' && node.props.id === '0-bio');
        expect(textarea.props.defaultValue).toBe(longText);

        fireEvent(textarea, 'blur', { target: { value: `${longText} updated` } });
        expect(onUpdate).toHaveBeenCalledWith(0, 'bio', `${longText} updated`);

        const deleteButton = findNode(container, (node) => node.type === 'button' && node.props.title === 'Delete field');
        fireEvent(deleteButton, 'click');
        expect(onDelete).toHaveBeenCalledWith(0, 'bio');
    });

    it('parses number inputs before updating', () => {
        const onUpdate = mock();

        const { container } = render(
            <FieldEditor
                field={baseField({ key: 'age', type: 'number' })}
                value={32}
                itemIndex={1}
                onUpdate={onUpdate}
                onDelete={() => {}}
            />,
        );

        const input = findNode(container, (node) => node.type === 'input' && node.props.id === '1-age');
        expect(input.props.type).toBe('number');

        fireEvent(input, 'blur', { target: { value: '42' } });
        expect(onUpdate).toHaveBeenCalledWith(1, 'age', 42);
    });

    it('updates simple text inputs without coercion', () => {
        const onUpdate = mock();

        const { container } = render(
            <FieldEditor
                field={baseField({ key: 'title' })}
                value="Hello"
                itemIndex={2}
                onUpdate={onUpdate}
                onDelete={() => {}}
            />,
        );

        const input = findNode(container, (node) => node.type === 'input' && node.props.id === '2-title');
        expect(input.props.type).toBe('text');

        fireEvent(input, 'blur', { target: { value: 'Updated' } });
        expect(onUpdate).toHaveBeenCalledWith(2, 'title', 'Updated');
    });
});
