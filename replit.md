# Spaces Monorepo

## Overview
A Bun monorepo containing two React + TypeScript + Vite packages:
- **`packages/sidebar`** — Main sidebar UI (dev server on port 5000)
- **`packages/spaces-table`** — Spaces table UI (dev server on port 5000, main app)
- **`packages/shared`** — Shared utilities/types used by both packages

## Architecture
- **Package manager:** Bun (workspaces)
- **Build tool:** Vite 7
- **Frontend framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Testing:** Vitest
- **Design system:** @mirohq/design-system

## Development
The main workflow runs the spaces-table package dev server on port 5000:
```
bun run dev:table
```

## Workflow
- **Start application** — runs `bun run dev:table` on port 5000 (webview)

## Image Assets
All static images (logos, icons, templates) live in `packages/spaces-table/public/images/`.
Reference them in code with `/images/filename.svg` paths.

**IMPORTANT:** Never use Figma MCP asset URLs (`figma.com/api/mcp/asset/...`) in code — they expire after 7 days. Always save exported Figma assets as files in `public/images/` and use local paths.

Current image files:
- `jira-logo.svg` — Jira logo for table cells and cards
- `miro-logotype.svg` — Miro wordmark logo
- `board-icon-table.svg` — Table board type icon
- `template-flowchart.svg`, `template-mindmap.svg` — Template thumbnails
- `team-logo.svg`, `miro-team-logo.svg` — Team logos
- `icon-plant.svg`, `icon-paper.svg`, `icon-cursor.svg`, `icon-user.svg`, `icon-orgchart.svg` — Board row icons (exported from Figma)
- `icon-people.svg` — People icon (unused, available for future use)
- `insights-icon.svg` — Insights modal icon

## GitHub Pull Workflow
- Pull: `git pull origin main --no-rebase --no-edit`
- After pull, fix `packages/spaces-table/package.json`: change `workspace:*` to `file:../shared` for `@spaces/shared`
- Restore `vite.config.ts`: `port: 5000, host: '0.0.0.0', allowedHosts: true`

## Deployment
Configured as a static site:
- Build: `bun run --filter @spaces/sidebar build`
- Public dir: `packages/sidebar/dist`
