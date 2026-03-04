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

Full-screen data table page, structured as two domains: **page** (the space shell) and **table** (self-contained data table module).

### Page Components (`src/components/page/`)

| File | Description |
|------|-------------|
| `TopNavBar.tsx` | Sticky nav (top-0, z-30) with hamburger, breadcrumb (Roobert #222428), notification bell, 3 Unsplash photo avatars; 8px padding all sides; 1px bottom border (#F1F2F5) fades in on scroll |
| `DatabaseTitle.tsx` | Editable "Backlog" title (32px Roobert), 48px top spacing; opacity fades out on scroll in sync with nav border |
| `ViewTabsToolbar.tsx` | Panel-style tabs (All items / Prioritization), search, AI sidekick, settings, plus, three-dot icon buttons (all medium/32px); sticky at top-14 (56px, below nav) |

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

### Scroll & Sticky Behaviour

- **Full-page scroll** — App.tsx is the scroll container (`overflow-y-auto`), scroll state managed in App
- **Three sticky layers:** nav (top-0, z-30, 56px) → tabs toolbar (top-14, z-20, 64px) → table header (top-[120px], z-10, 56px)
- **Scroll-linked fade** — App computes a single `scrollFade` value (0→1) from scroll position; title opacity = `1 - scrollFade`, nav border opacity = `scrollFade`; fade starts at 10px scroll, completes by 35px
- Nav bottom border: 1px inset box-shadow `rgba(241, 242, 245, borderOpacity)` — matches table row divider colour (#F1F2F5)

### Features

- **Sticky nav** — TopNavBar stays at top (z-30) with fading 1px bottom border on scroll
- Top nav: hamburger, breadcrumb (Roobert #222428), notification bell, 3 Unsplash photo avatars (28px, overlapping); 8px padding all sides
- Click-to-edit database title "Backlog" (32px Roobert), 48px top spacing; fades out on scroll
- **Sticky tabs** — ViewTabsToolbar locks below nav (top-14, z-20) with 16px top / 16px bottom padding
- MDS panel-style tabs (`variant="buttons"`), search + AI sidekick + settings + plus + three-dot icon buttons (all medium/32px ghost)
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
    src/components/table/ (index, DataTable, TableHeader, TableRow, CellRenderer)
    src/components/table/cells/ (TextCell, NumberCell, CurrencyCell, AvatarStackCell)
    src/App.tsx, main.tsx, index.css
docs/plans/
  2026-03-03-spaces-table-design.md
```

---

## Next Steps

- **Column resizing** — drag column edges to resize, persist widths
- **Inline cell editing** — click to edit text/number/currency cells in place
- **Status column** — add a status field with colour-coded chips (e.g. In Progress, Done, Blocked)
- **Sort interaction** — click column headers to sort ascending/descending with indicator arrow
- **Filter integration** — connect sidebar filter panel to table data (shared filter state)
- **Sidebar trigger** — wire the settings icon button in the toolbar to open the sidebar panel
- **Empty state** — design for zero-row / no-results scenarios
- **Row reordering** — drag handle actually reorders rows with animation
- **Keyboard navigation** — arrow keys to move between cells, Enter to edit

---

## GitHub

- **Repo:** [mikefrommiro/table-views](https://github.com/mikefrommiro/table-views)
- **Branch:** `master`
