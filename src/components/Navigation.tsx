import type React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

/**
 * Navigation component for switching between pages.
 * Uses wouter's Link with function-based className for active link styling.
 */
export const Navigation: React.FC = () => {
    const links = [
        { href: '/', label: 'Editor' },
        { href: '/distill', label: 'Distiller' },
    ];

    return (
        <nav className="border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-12 items-center px-6">
                <div className="flex gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={(active) =>
                                cn(
                                    'font-medium text-sm transition-colors hover:text-foreground',
                                    active ? 'text-foreground' : 'text-muted-foreground',
                                )
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};
