import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render } from '@testing-library/react';
import type { TestNode } from '@testing-library/dom';
import { JsonItemEditor } from '@/components/JsonItemEditor';
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

const getTextContent = (node: TestNode): string => {
    if (node.type === 'text' || node.type === null) {
        return node.text ?? '';
    }
    return node.children.map(getTextContent).join('');
};

describe('JsonItemEditor', () => {
    const buildField = (key: string, type: FieldMetadata['type'], isLongText = false): FieldMetadata => ({
        key,
        type,
        isLongText,
    });

    const fields: FieldMetadata[] = [
        buildField('age', 'number'),
        buildField('name', 'string'),
        buildField('bio', 'string', true),
    ];

    const item = { age: 28, bio: 'A short biography', name: 'Ada' };

    it('renders numeric fields separately from other fields', () => {
        const { container } = render(
            <JsonItemEditor
                fields={fields}
                index={0}
                item={item}
                onUpdate={() => {}}
                onDuplicate={() => {}}
                onDeleteField={() => {}}
            />,
        );

        const heading = findNode(container, (node) => node.type === 'h3');
        expect(getTextContent(heading)).toBe('Item 1');

        const numberInput = findNode(container, (node) => node.type === 'input' && node.props.id === '0-age');
        expect(numberInput.props.type).toBe('number');

        const textInput = findNode(container, (node) => node.type === 'input' && node.props.id === '0-name');
        expect(textInput.props.type).toBe('text');

        const textarea = findNode(container, (node) => node.type === 'textarea' && node.props.id === '0-bio');
        expect(textarea.props.defaultValue).toBe(item.bio);
    });

    it('invokes duplicate and delete handlers', () => {
        const onDuplicate = mock();
        const onDelete = mock();

        const { container } = render(
            <JsonItemEditor
                fields={fields}
                index={1}
                item={item}
                onUpdate={() => {}}
                onDuplicate={onDuplicate}
                onDeleteField={onDelete}
            />,
        );

        const duplicateButton = findNode(container, (node) => node.type === 'button' && getTextContent(node).includes('Duplicate'));
        fireEvent(duplicateButton, 'click');
        expect(onDuplicate).toHaveBeenCalledWith(1);

        const field = findNode(container, (node) => node.type === 'input' && node.props.id === '1-age');
        const deleteButton = findNode(field.parent!.children, (node) => node.type === 'button' && getTextContent(node) === '✕');
        fireEvent(deleteButton, 'click');
        expect(onDelete).toHaveBeenCalledWith(1, 'age');
    });
});
