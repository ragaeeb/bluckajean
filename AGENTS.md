# Contributor Notes

- Use Bun for installing dependencies, running the dev server, and executing the test suite.
- Run `bun test` and `bun run build` before delivering changes.
- Component tests should import helpers from `@testing-library/react`. A lightweight vendored implementation lives in `vendor/` and is preloaded through `bunfig.toml`.
- Keep TypeScript path aliases intact when moving files and prefer existing utility helpers over re-implementations.
- Format code with `bun run format` (Biome) to match the repository style.
