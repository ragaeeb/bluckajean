import type { ReactElement } from 'react';
import { act } from 'react';
import { buildTree, clearTree, fireEvent, screen, within, type TestNode } from '@testing-library/dom';

export type RenderResult = {
    container: TestNode[];
    rerender: (ui: ReactElement) => void;
    unmount: () => void;
};

export const render = (ui: ReactElement): RenderResult => {
    let tree: TestNode[] = [];
    act(() => {
        tree = buildTree(ui);
    });
    return {
        container: tree,
        rerender: (next: ReactElement) => {
            act(() => {
                tree = buildTree(next);
            });
        },
        unmount: () => {
            clearTree();
        },
    };
};

export const cleanup = () => {
    clearTree();
};

export { fireEvent, screen, within };
