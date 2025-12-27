# AGENTS.md

This document provides guidance for AI agents working with this codebase.

## Project Overview

**bluckajean** is a visual JSON array editor built with Vite + React 19 + TypeScript. It's a single-page application (SPA) with no backend.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | Vite 6 |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Components | Radix UI |
| Package Manager | Bun |
| Linting/Formatting | Biome |

## Project Structure

```
src/
├── main.tsx           # Entry point - renders App
├── App.tsx            # Main component with JSON editing logic
├── index.css          # Global styles, Tailwind theme
├── components/
│   ├── ui/            # Primitives: Input, Label, Textarea
│   ├── FieldEditor    # Renders individual field controls
│   ├── JsonItemEditor # Card wrapper for each JSON item
│   ├── DeleteButton   # Delete field button
│   └── Footer         # App footer with version
├── lib/
│   └── utils.ts       # parseJson, analyzeJsonStructure, cn
└── types/
    └── index.ts       # FieldType, FieldMetadata
```

## Commands

```bash
bun install       # Install dependencies
bun run dev       # Start dev server (localhost:5173)
bun run build     # Production build to dist/
bun run preview   # Preview production build
bun run format    # Format with Biome
bun run lint      # Lint with Biome
```

## Key Patterns

### Path Aliases
Use `@/` for imports from `src/`:
```typescript
import { cn } from '@/lib/utils';
import type { FieldMetadata } from '@/types';
```

### Component Structure
- UI primitives in `src/components/ui/`
- Feature components in `src/components/`
- All components use TypeScript with explicit prop types

### Styling
- Tailwind CSS 4 with `@tailwindcss/vite` plugin
- CSS variables for theming in `src/index.css`
- `cn()` utility for conditional class merging

### JSON Parsing
The `parseJson` function in `lib/utils.ts` auto-corrects common issues:
- Missing brackets
- Trailing commas
- Returns `null` for invalid JSON

## Dependencies

### Runtime
- `react`, `react-dom` - UI framework
- `@radix-ui/react-label`, `@radix-ui/react-slot` - Accessible primitives
- `bitaboom` - Arabic text detection (`getArabicScore`)
- `clsx`, `tailwind-merge`, `class-variance-authority` - Class utilities

### Development
- `vite`, `@vitejs/plugin-react-swc` - Build tooling
- `tailwindcss`, `@tailwindcss/vite` - Styling
- `typescript` - Type safety
- `@biomejs/biome` - Formatting/linting

## Common Tasks

### Adding a UI Component
1. Create in `src/components/ui/`
2. Use `cn()` for class merging
3. Export from the file

### Modifying JSON Parsing
Edit `src/lib/utils.ts`:
- `parseJson` - JSON parsing and error correction
- `analyzeJsonStructure` - Field type detection
- `detectFieldType` - Type inference

### Updating Styles
Edit `src/index.css`:
- CSS variables in `:root` and `.dark`
- Theme tokens in `@theme inline`
