# Spaces Monorepo

## Overview
A Bun monorepo containing two React + TypeScript + Vite packages:
- **`packages/sidebar`** — Main sidebar UI (dev server on port 5000)
- **`packages/spaces-table`** — Spaces table UI (dev server on port 5174)
- **`packages/shared`** — Shared utilities/types used by both packages

## Architecture
- **Package manager:** Bun (workspaces)
- **Build tool:** Vite 7
- **Frontend framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Testing:** Vitest
- **Design system:** @mirohq/design-system

## Development
The main workflow runs the sidebar package dev server on port 5000:
```
bun run dev:sidebar
```

To run the spaces-table dev server (port 5174):
```
bun run dev:table
```

## Workflow
- **Start application** — runs `bun run dev:sidebar` on port 5000 (webview)

## Deployment
Configured as a static site:
- Build: `bun run --filter @spaces/sidebar build`
- Public dir: `packages/sidebar/dist`
