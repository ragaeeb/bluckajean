import type { ReactElement, ReactNode } from 'react';
import { Fragment } from 'react';

export type TestNode = {
    type: string | null;
    props: Record<string, any>;
    children: TestNode[];
    text?: string;
    parent: TestNode | null;
};

export type Matcher = string | RegExp | ((content: string, node: TestNode) => boolean);

const REACT_ELEMENT_TYPE = Symbol.for('react.element');
const REACT_TRANSITIONAL_ELEMENT = Symbol.for('react.transitional.element');

type ReactElementLike = {
    $$typeof: symbol;
    type: any;
    props: Record<string, any>;
};

const isReactElement = (value: unknown): value is ReactElementLike => {
    return (
        typeof value === 'object' &&
        value !== null &&
        ((value as any).$$typeof === REACT_ELEMENT_TYPE || (value as any).$$typeof === REACT_TRANSITIONAL_ELEMENT)
    );
};

let currentTree: TestNode[] = [];

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

const toArray = (children: ReactNode): ReactNode[] => {
    if (Array.isArray(children)) {
        return children;
    }
    if (children === undefined || children === null || typeof children === 'boolean') {
        return [];
    }
    return [children];
};

const resolveNode = (node: ReactNode, parent: TestNode | null): TestNode[] => {
    if (node === undefined || node === null || typeof node === 'boolean') {
        return [];
    }

    if (typeof node === 'string' || typeof node === 'number') {
        return [
            {
                children: [],
                parent,
                props: {},
                text: String(node),
                type: null,
            },
        ];
    }

    if (Array.isArray(node)) {
        return node.flatMap((child) => resolveNode(child, parent));
    }

    if (!isReactElement(node)) {
        return [];
    }

    if (node.type === Fragment) {
        return resolveNode(node.props.children, parent);
    }

    if (typeof node.type === 'function') {
        const rendered = (node.type as (props: any) => ReactNode)(node.props);
        return resolveNode(rendered, parent);
    }

    if (typeof node.type === 'string') {
        const element: TestNode = {
            children: [],
            parent,
            props: node.props ?? {},
            type: node.type,
        };
        element.children = toArray(node.props?.children).flatMap((child) => resolveNode(child, element));
        return [element];
    }

    return [];
};

export const buildTree = (ui: ReactElement) => {
    currentTree = resolveNode(ui, null);
    return currentTree;
};

export const clearTree = () => {
    currentTree = [];
};

const gatherText = (node: TestNode): string => {
    if (node.type === null) {
        return node.text ?? '';
    }
    return node.children.map(gatherText).join(' ');
};

const matches = (text: string, matcher: Matcher, node: TestNode): boolean => {
    if (typeof matcher === 'string') {
        return normalize(text) === normalize(matcher);
    }
    if (matcher instanceof RegExp) {
        return matcher.test(text);
    }
    return matcher(text, node);
};

const collect = (root: TestNode | null, predicate: (node: TestNode) => boolean): TestNode[] => {
    const source = root ? [root] : currentTree;
    const results: TestNode[] = [];

    const visit = (node: TestNode) => {
        if (predicate(node)) {
            results.push(node);
        }
        for (const child of node.children) {
            visit(child);
        }
    };

    for (const node of source) {
        visit(node);
    }

    return results;
};

const ensureOne = (nodes: TestNode[], message: string): TestNode => {
    if (nodes.length === 0) {
        throw new Error(`Unable to find ${message}`);
    }
    if (nodes.length > 1) {
        throw new Error(`Found multiple instances of ${message}`);
    }
    return nodes[0]!;
};

const buildLabelMap = (root: TestNode | null): Map<string, TestNode> => {
    const map = new Map<string, TestNode>();
    collect(root, (node) => Boolean(node.props?.id)).forEach((node) => {
        map.set(String(node.props.id), node);
    });
    return map;
};

const createQueries = (scope: TestNode | null) => {
    const labelTargets = buildLabelMap(scope);

    const getByText = (matcher: Matcher) => {
        const nodes = collect(scope, (node) => {
            if (node.type === null) {
                return matches(node.text ?? '', matcher, node);
            }
            return matches(gatherText(node), matcher, node);
        });
        return ensureOne(nodes, `text matching ${String(matcher)}`);
    };

    const getByRole = (role: string, options?: { name?: Matcher }) => {
        const nodes = collect(scope, (node) => {
            if (!node.type) {
                return false;
            }
            if (role === 'button') {
                if (node.type !== 'button') {
                    return false;
                }
            } else if (role === 'heading') {
                if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.type)) {
                    return false;
                }
            } else {
                return false;
            }

            if (!options?.name) {
                return true;
            }
            const text = gatherText(node);
            return matches(text, options.name, node);
        });
        return ensureOne(nodes, `role ${role}`);
    };

    const getByPlaceholderText = (matcher: Matcher) => {
        const nodes = collect(scope, (node) => {
            if (!node.type) {
                return false;
            }
            if (!['input', 'textarea'].includes(node.type)) {
                return false;
            }
            const placeholder = node.props?.placeholder;
            if (!placeholder) {
                return false;
            }
            return matches(String(placeholder), matcher, node);
        });
        return ensureOne(nodes, `placeholder ${String(matcher)}`);
    };

    const getByLabelText = (matcher: Matcher) => {
        const labelNodes = collect(scope, (node) => node.type === 'label');
        for (const label of labelNodes) {
            const text = gatherText(label);
            if (!matches(text, matcher, label)) {
                continue;
            }
            const htmlFor = label.props?.htmlFor;
            if (htmlFor && labelTargets.has(String(htmlFor))) {
                return labelTargets.get(String(htmlFor))!;
            }
            const target = collect(label, (node) => ['input', 'textarea', 'select'].includes(node.type ?? '')).at(0);
            if (target) {
                return target;
            }
        }
        throw new Error(`Unable to find label matching ${String(matcher)}`);
    };

    return {
        getByLabelText,
        getByPlaceholderText,
        getByRole,
        getByText,
    };
};

export const screen = new Proxy({} as ReturnType<typeof createQueries>, {
    get(_target, key: keyof ReturnType<typeof createQueries>) {
        return createQueries(null)[key];
    },
});

export const within = (node: TestNode) => createQueries(node);

export type FireEventInit = {
    target?: { value?: any; checked?: boolean };
};

const toHandlerName = (type: string) => `on${type.charAt(0).toUpperCase()}${type.slice(1)}`;

export const fireEvent = (node: TestNode, type: string, init: FireEventInit = {}) => {
    const handlerName = toHandlerName(type);
    const handler = node.props?.[handlerName];
    if (typeof handler !== 'function') {
        throw new Error(`No handler found for ${handlerName}`);
    }
    const event = {
        target: {
            checked: init.target?.checked,
            value: init.target?.value,
        },
        type,
    };
    handler(event);
    return event;
};

export const waitFor = async <T>(callback: () => T): Promise<T> => callback();

export const getCurrentTree = () => currentTree;
