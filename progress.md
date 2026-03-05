# Spaces Monorepo — Progress

## Architecture

Bun workspace monorepo with three packages sharing types, fields, and sample data.

```
packages/
  shared/        — types, field definitions, filter config, sample data
  sidebar/       — roadmap settings panel (localhost:5173)
  spaces-table/  — full-screen data table (localhost:5174)
```

**Stack:** Vite 7 + React 19 + TypeScript 5.9 + Tailwind CSS 3.4 + `@mirohq/design-system` 1.2.15 + Bun 1.3.9

---

## Sidebar (`packages/sidebar`)

A high-fidelity interactive prototype of the Miro roadmap settings sidebar. See original component list and features below.

### Components

| File | Description |
|------|-------------|
| `src/components/SidePanel.tsx` | Root panel, all state, navigation logic |
| `src/components/AiBar.tsx` | Interactive AI prompt bar — 4-state machine (idle/typing/loading/success) |
| `src/components/FilterPage.tsx` | Filter detail page — condition builder |
| `src/components/SectionHeader.tsx` | Section label rows with optional + / ··· action buttons |
| `src/components/SettingCell.tsx` | 72px setting row with coloured icon, label, subtitle, chevron |
| `src/components/FieldRow.tsx` | 72px field row with icon, label, hover pen/drag icons |

### Features

- 400px white panel with slide-in animation, staggered content fade-in
- View settings (Layout, Filter, Sort, Columns, Swimlanes) with in-panel navigation
- Layout dropdown (Table/Kanban/Timeline) with click-position-aware alignment
- AI bar with natural language filter commands (create/edit/delete), fully unit-tested (17 tests)
- Filter page with condition builder, field-aware operators, duplicate/delete
- Filter state lifts to SidePanel, persists across navigation

---

## Shared Package (`packages/shared`)

| File | Description |
|------|-------------|
| `src/types.ts` | FieldType, FieldDefinition, FilterField, FilterCondition |
| `src/fields.ts` | 5 field definitions (title, mentions, customers, estRevenue, companies) |
| `src/filterConfig.ts` | FILTER_FIELDS, OPERATORS, STATUS_VALUES, NO_VALUE_OPS, defaultCondition() |
| `src/sampleData.ts` | SpaceRow interface + 18 rows of product feature request data |
| `src/fields.test.ts` | 3 tests validating data model |

---

## Spaces Table (`packages/spaces-table`)

Full-screen data table page, structured as three domains: **page** (the space shell), **table** (self-contained data table module), and **sidebar** (push-panel sidebars).

### Page Components (`src/components/page/`)

| File | Description |
|------|-------------|
| `TopNavBar.tsx` | Sticky nav (top-0, z-30) with hamburger (toggles space menu), breadcrumb + scroll-linked database title, notification bell, 3 Unsplash photo avatars, Share button; 8px left / 12px right padding; 1px bottom border (#F1F2F5) fades in on scroll |
| `DatabaseTitle.tsx` | Always-input editable "Backlog" title (32px Roobert), 48px top spacing; 3 CSS-driven states (idle/hover/focused) matching Figma `.Editable Title`; auto-sizing via hidden measuring span; opacity fades out on scroll |
| `ViewTabsToolbar.tsx` | Panel-style tabs (All items / Prioritization), search, AI sidekick (toggles sidebar), settings (toggles sidebar), plus, three-dot icon buttons (all medium/32px); sticky at top-14 (56px, below nav); exports `SidebarId` type |

### Sidebar Components (`src/components/sidebar/`)

| File | Description |
|------|-------------|
| `SidebarShell.tsx` | Shared wrapper — configurable width (default 400px), white bg, border on content-facing edge (#F1F2F5), optional close button (`showClose` prop) |
| `SpaceMenu.tsx` | Left nav sidebar (280px) — top bar (Home, Search, Close), "Project Galaxy" header (20px Roobert) with chevron-up-down + three-dot actions, "1 member" link, page list (Backlog/Roadmap with lightbulb/map icons), divider, "Space content" section with + button, empty state |
| `AiSidekickPanel.tsx` | Right placeholder — sparkle icon, "AI Sidekick" heading, empty state message |
| `SidePanel.tsx` | View settings sidebar — copied from sidebar package, adapted (no close button, no shadow/rounding, w-full); full filter/layout/fields functionality with AI bar |
| `AiBar.tsx` | AI prompt bar (copied from sidebar package) — 4-state machine |
| `FilterPage.tsx` | Filter condition builder (copied from sidebar package) |
| `SectionHeader.tsx` | Section label rows (copied from sidebar package) |
| `SettingCell.tsx` | Setting row with coloured icon (copied from sidebar package) |
| `FieldRow.tsx` | Field row with hover icons (copied from sidebar package) |

### Table Module (`src/components/table/`)

| File | Description |
|------|-------------|
| `index.ts` | Barrel export — single public surface (`DataTable`) |
| `DataTable.tsx` | Orchestrator — selection state, click-outside handler, composes TableHeader + TableRow; horizontal scroll only |
| `TableHeader.tsx` | Sticky `<thead>` (top-[120px], below nav + tabs), bookmark icon on primary field, 56px tall, 14px Noto Sans semibold #656B81 |
| `TableRow.tsx` | Single `<tr>` — row number, drag handle, comment button, context menu, cells |
| `CellRenderer.tsx` | Field-type dispatcher — routes to the correct cell component |
| `cells/TextCell.tsx` | Text cell (14px Noto Sans regular) |
| `cells/NumberCell.tsx` | Number cell with locale formatting (Noto Sans) |
| `cells/CurrencyCell.tsx` | Currency cell, $NNK format (Noto Sans) |
| `cells/AvatarStackCell.tsx` | Overlapping avatar initials with overflow count (Noto Sans semibold) |

### Typography

- **Headers:** Roobert PRO semibold (`font-heading`) — database title, nav breadcrumb
- **Body copy:** Noto Sans regular (`font-body`) — table cells, secondary text
- **Labels:** Noto Sans semibold (`font-body font-semibold`) — table header labels, avatar initials, buttons
- Noto Sans loaded via Google Fonts (400 + 600); Roobert PRO self-hosted from `/fonts/`

### Layout & Sidebar Architecture

- **Horizontal flex layout** — App.tsx is `flex` (row): `[left sidebar slot] | [main content] | [right sidebar slot]`
- **Main content column** — `flex-1 min-w-0`, contains all page + table components, scroll container
- **Sidebar slots** — `shrink-0 overflow-hidden` wrappers with `transition-[width]` (300ms, `cubic-bezier(0.16, 1, 0.3, 1)`); left sidebar animates 0 → 280px, right sidebars 0 → 400px
- **Single `activeSidebar` state** — `'space-menu' | 'ai-sidekick' | 'view-settings' | null`; only one sidebar open at a time
- **Toggle behaviour** — clicking a trigger while its sidebar is open closes it; clicking a different trigger swaps sidebars
- **Push, not overlay** — sidebars are flex siblings, main content compresses when a sidebar opens

### Scroll & Sticky Behaviour

- **Full-page scroll** — main content column is the scroll container (`overflow-y-auto`), scroll state managed in App
- **Three sticky layers:** nav (top-0, z-30, 56px) → tabs toolbar (top-14, z-20, 64px) → table header (top-[120px], z-10, 56px)
- **Scroll-linked fade** — App computes a single `scrollFade` value (0→1) from scroll position; title opacity = `1 - scrollFade`, nav border opacity = `scrollFade`; fade starts at 10px scroll, completes by 35px
- Nav bottom border: 1px inset box-shadow `rgba(241, 242, 245, borderOpacity)` — matches table row divider colour (#F1F2F5)
- Sticky elements remain correct when sidebars push content narrower — they're relative to the main content scroll container

### Features

- **Sticky nav** — TopNavBar stays at top (z-30) with fading 1px bottom border on scroll
- Top nav: hamburger + breadcrumb fade out (opacity 0) when space menu is open; breadcrumb (Roobert #222428) with scroll-linked chevron + database title, notification bell, 3 Unsplash photo avatars (28px, overlapping), Share button (MDS primary medium); 8px left / 12px right padding
- **Editable database title** "Backlog" (32px Roobert), 48px top spacing; always-input pattern (single `<input>`, no element swap); auto-sizing via hidden measuring span; fades out on scroll; 3 CSS-driven states modelled on Figma `.Editable Title` component:
  - **Idle** — transparent background, 4px horizontal padding, `cursor: default`
  - **Hover** — `#F1F2F5` background, 4px border-radius, `cursor: pointer`, 150ms transition
  - **Focused** — white background, double-ring focus: `0 0 0 2px white, 0 0 0 4px #2B4DF8`, `cursor: text`, click selects all text, Enter saves + blurs, Escape reverts + blurs, placeholder "Enter a title ..." in `#7D8297`
- **Sticky tabs** — ViewTabsToolbar locks below nav (top-14, z-20) with 16px top / 16px bottom padding
- MDS panel-style tabs (`variant="buttons"`), search + AI sidekick + settings + plus + three-dot icon buttons (all medium/32px ghost)
- **Three push sidebars** — hamburger opens Space Menu (left, 280px), sparkle opens AI Sidekick (right, 400px), settings icon opens View Settings (right, 400px); smooth 300ms width animation; active toolbar buttons show #F1F2F5 background; Space Menu has its own close button in top bar, right sidebars use SidebarShell close button
- **Sticky table header** — sticks below tabs (top-[120px], z-10), content scrolls underneath
- Data table: 18 rows from shared sample data, 56px row height
- 56px page padding on title/tabs/table, horizontally scrollable edge-to-edge
- Table header: 56px tall, 14px semibold text (#656B81), bookmark icon on primary field, 12px/20px cell padding
- Inset row dividers (56px from each edge), hidden on hover/selection
- Row hover: rounded 8px background (#FAFBFC), row number replaced by drag handle + comment button (no layout shift — idle state reserves space for both controls)
- Row selection: click drag handle to select (blue #F2F4FC background, blue icon), context menu with Duplicate/Delete
- Click outside table or re-click drag handle to deselect
- 4 cell formatters: text (14px), number (locale), currency ($NK/dash), avatar stack (3 visible + overflow)
- Thin scrollbar styling (`.page-scroll` on App container), `border-separate` for per-cell border-radius support

---

## Tests

- **20 tests total** — 17 sidebar filter parser + 3 shared data model
- Run: `bun run test`

---

## Key Files

```
packages/
  shared/
    src/types.ts, fields.ts, filterConfig.ts, sampleData.ts, index.ts
    src/fields.test.ts
  sidebar/
    src/components/ (SidePanel, AiBar, FilterPage, SectionHeader, SettingCell, FieldRow)
    src/lib/filterParser.ts, filterParser.test.ts
  spaces-table/
    src/components/page/ (TopNavBar, DatabaseTitle, ViewTabsToolbar)
    src/components/sidebar/ (SidebarShell, SpaceMenu, AiSidekickPanel, SidePanel, AiBar, FilterPage, SectionHeader, SettingCell, FieldRow)
    src/components/table/ (index, DataTable, TableHeader, TableRow, CellRenderer)
    src/components/table/cells/ (TextCell, NumberCell, CurrencyCell, AvatarStackCell)
    src/lib/filterParser.ts
    src/App.tsx, main.tsx, index.css
docs/plans/
  2026-03-03-spaces-table-design.md
  2026-03-05-editable-title-design.md
```

---

## Next Steps

### Immediate
- **AI Sidekick content** — design and build the AI Sidekick panel content
- **Space Menu interactions** — hover states on page list items, active page switching, space switcher dropdown

### Table Interactions
- **Column resizing** — drag column edges to resize, persist widths
- **Inline cell editing** — click to edit text/number/currency cells in place
- **Status column** — add a status field with colour-coded chips (e.g. In Progress, Done, Blocked)
- **Sort interaction** — click column headers to sort ascending/descending with indicator arrow
- **Filter integration** — connect sidebar filter panel to table data (shared filter state)
- **Empty state** — design for zero-row / no-results scenarios
- **Row reordering** — drag handle actually reorders rows with animation
- **Keyboard navigation** — arrow keys to move between cells, Enter to edit

---

## GitHub

- **Repo:** [mikefrommiro/table-views](https://github.com/mikefrommiro/table-views)
- **Branch:** `master`
