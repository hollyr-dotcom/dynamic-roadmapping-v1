# Spaces Monorepo — Claude Code Context

## Project Overview

A Bun monorepo of frontend UI prototypes for Miro's Tables team. These are **demo-quality prototypes**, not production code — they need to look great and demonstrate complex functionality, but don't need to be over-engineered.

### Packages

| Package | Description | Dev port |
|---------|-------------|----------|
| `packages/spaces-table` | Main spaces table UI (primary app) | 5000 |
| `packages/sidebar` | Sidebar UI | 5000 |
| `packages/shared` | Shared types, utilities, sample data | — |

## Tech Stack

- **Package manager:** Bun (always use `bun`, never `npm`)
- **Build tool:** Vite 7
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Testing:** Vitest
- **Design system:** `@mirohq/design-system`

## Development Commands

```bash
bun run dev:table       # Start spaces-table on port 5000 (main workflow)
bun run dev:sidebar     # Start sidebar dev server
bun run test            # Run all tests across packages
bun run build           # Build all packages
```

## Architecture

### Monorepo Structure

- Root `package.json` defines workspaces: `packages/*`
- Each package has its own `tsconfig.json`, `vite.config.ts`, etc.
- `@spaces/shared` is referenced via `file:../shared` in package.json (not `workspace:*`)
- After `git pull`, fix `packages/spaces-table/package.json` to use `file:../shared` if it reverts to `workspace:*`

### Z-Index Architecture (CRITICAL)

The main content area uses `div.isolate` in `App.tsx` with CSS `isolation: isolate` to create a scoped stacking context. This prevents internal sticky elements from overlapping fixed overlay panels.

| Layer | z-index | Element |
|-------|---------|---------|
| Internal sticky elements | `z-20`, `z-[9999]` | ViewTabsToolbar, DatabaseTitle |
| Backdrop overlay | `z-40` | Sidebar backdrop |
| Side panels | `z-50` | SidePanel, RowDetailPanel |
| AI Sidekick panel | `z-[10000]` | AI Sidekick |

**Never remove the `isolate` class from the main content wrapper.**

### RowDetailPanel Chat Input

- Absolutely positioned (`absolute bottom-0 left-0 right-0`) inside the main panel column
- Appears on all tabs except Comments (which has its own input)
- Tabs content div uses `paddingBottom: 72px` (non-Comments) to prevent overlap
- Clicking it opens the AI Sidekick panel via `onOpenSidekick` prop

## Code Conventions

### TypeScript

- `tsconfig.app.json` has `noUnusedLocals: false`, `noUnusedParameters: false` — don't add bulk unused-variable errors
- `&&` narrowing → use ternary
- `JSX.Element` namespace → `React.JSX.Element`
- Icon style props → `@ts-expect-error`
- `Record<FieldType, X>` missing keys → `Partial<Record<FieldType, X>>`
- `onPress` handler type → `(e: any) =>`

### ViewTabsToolbar

- "View settings" button `onPress` must be wired to `onToggleSidebar('view-settings')`

### Image Assets

All static images live in `packages/spaces-table/public/images/`. Reference them in code as `/images/filename.svg`.

**Never use Figma MCP asset URLs** (`figma.com/api/mcp/asset/...`) — they expire after 7 days. Always save Figma exports as local files.

## Design Principles

- **Minimal with breathing room** — generous white space, clear hierarchy
- **Typography-driven** — let type do the heavy lifting
- **Motion-forward** — transitions and micro-interactions should feel purposeful
- **Component-minded** — use repeatable patterns; avoid one-off solutions

### Design System Usage

- Use `@mirohq/design-system` components and tokens as the default
- Prefer design system tokens (colours, spacing, type scales) over hardcoded values
- Extending or deviating is fine when the prototype calls for it — document why

## Git Workflow

- Commit working features immediately with clear, descriptive messages
- Never commit broken code
- Pull: `git pull origin main --no-rebase --no-edit`

## Testing Prototypes

- Interact with the running app — click, type, trigger flows
- Test with realistic content for data-heavy elements
- Note what's broken before fixing it
