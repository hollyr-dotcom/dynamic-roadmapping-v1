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

## Build Fix Patterns
- `tsconfig.app.json`: `noUnusedLocals: false`, `noUnusedParameters: false` — prevents bulk unused-variable errors from upstream code
- `&&` narrowing → use ternary; `JSX.Element` namespace → `React.JSX.Element`
- Icon style props → `@ts-expect-error`; `Record<FieldType, X>` missing keys → `Partial<Record<FieldType, X>>`
- `onPress` handler type → `(e: any) =>`
- ViewTabsToolbar "View settings" button: `onPress` must be wired to `onToggleSidebar('view-settings')`

## Z-Index Architecture (CRITICAL)
The main content area (`div.isolate` in App.tsx) uses CSS `isolation: isolate` to create a scoped stacking context. This ensures internal sticky elements (e.g. DatabaseTitle at `z-[9999]`, ViewTabsToolbar at `z-20`) never compete with the fixed overlay panels:
- `z-40` — Sidebar backdrop overlay
- `z-50` — Left sidebar, Right sidebar (SidePanel, RowDetailPanel)
- `z-[10000]` — AI Sidekick panel

**NEVER remove the `isolate` class from the main content wrapper.** Without it, high z-index sticky elements in the scroll area will render above the sidebar panels, blocking all user interaction with side panel tabs and content.

## RowDetailPanel Chat Input (AI Sidekick)
The "What should we do next?" chat input is absolutely positioned (`absolute bottom-0 left-0 right-0`) inside the main panel column (the "slider" div with `position: relative`). It appears on all tabs EXCEPT Comments (which has its own input). Clicking it opens the AI Sidekick panel via `onOpenSidekick` prop.

**Key structural notes:**
- The main panel column ("slider") contains: tab bar → tabs content → chat input → company panel → detail panel — all as a horizontal sliding strip clipped by `overflow: hidden`
- The tabs content div has `paddingBottom: 72px` (non-Comments tabs) to prevent content overlap with the absolutely positioned chat input
- The inner scroll wrapper `<div>` was removed — only the outer tabs content div remains. The 3 closing `</div>` tags at `{/* end slider */}`, `{/* end overflow wrapper */}`, `{/* end tabs */}` close: main panel column → content row → root panel div

## GitHub Pull Workflow
- Pull: `git pull origin main --no-rebase --no-edit`
- After pull, fix `packages/spaces-table/package.json`: change `workspace:*` to `file:../shared` for `@spaces/shared`
- Restore `vite.config.ts`: `port: 5000, host: '0.0.0.0', allowedHosts: true`

## Deployment
Configured as a static site:
- Build: `bun run --filter @spaces/sidebar build`
- Public dir: `packages/sidebar/dist`
