# Spaces Monorepo — Progress

## Architecture

Bun workspace monorepo with three packages sharing types, fields, and sample data.

```
packages/
  shared/        — types, field definitions, filter config, sample data
  sidebar/       — roadmap settings panel (localhost:5173)
  spaces-table/  — full-screen data table + kanban (localhost:5174)
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
| `src/types.ts` | FieldType, FieldDefinition, Priority, Status, FilterField, FilterCondition |
| `src/fields.ts` | `fields` (5 backlog columns) + `roadmapFields` (5 roadmap columns with status) |
| `src/filterConfig.ts` | FILTER_FIELDS, OPERATORS, STATUS_VALUES, NO_VALUE_OPS, defaultCondition() |
| `src/sampleData.ts` | SpaceRow interface (with `priority` + optional `status`) + `sampleData` (18 backlog rows) + `roadmapData` (14 roadmap rows) |
| `src/fields.test.ts` | 3 tests validating data model |

---

## Spaces Table (`packages/spaces-table`)

Full-screen space with **two pages** (Backlog, Roadmap) and **dynamic views** across them. Structured as five domains: **page** (the space shell), **table** (data table module), **kanban** (kanban board module), **timeline** (timeline module), and **sidebar** (push-panel sidebars).

### Page Architecture

- **Two pages** — Backlog (default) and Roadmap, switchable via Space Menu
- **Page config** — `PAGE_CONFIGS` in App.tsx provides initial tabs per page (with `type: ViewType` on each tab); runtime tabs stored in `pageTabs` state
- **Dynamic views** — users can add new views (Table, Kanban, Timeline) at runtime via the "New View" dropdown; each page manages its own tab list independently; new views share the same page data with different visualisation
- **Page state** — `activePage` + `activeTab` + `pageTabs` in App.tsx; `switchPage()` resets tab, title, and scroll position; dynamically added tabs persist across page switches within a session
- **Type-based rendering** — views render based on `activeTabConfig.type` (`'table'` | `'kanban'` | `'timeline'`), replacing hardcoded per-tab conditionals
- **Data-driven components** — DataTable and KanbanBoard accept `data`, `fields`, and (kanban) `columns` as props

### Page Components (`src/components/page/`)

| File | Description |
|------|-------------|
| `TopNavBar.tsx` | Fixed nav (shrink-0, outside scroll area) with hamburger (toggles space menu), breadcrumb + scroll-linked database title, notification bell, 3 Unsplash photo avatars, Share button; 8px left / 12px right padding; 1px bottom border (#F1F2F5) fades in on scroll; breadcrumb fades in on scroll even when menu is open |
| `DatabaseTitle.tsx` | Always-input editable title (32px Roobert), 48px top spacing; sticky left-0 (pinned horizontally, scrolls vertically); 3 CSS-driven states (idle/hover/focused) matching Figma `.Editable Title`; auto-sizing via hidden measuring span; opacity fades out on scroll; updates per page; **three-dots menu** beside title (medium ghost IconButton, `icon-neutrals-subtle`) — hover-to-reveal with fade+scale animation (`group/title`), stays visible while dropdown is open, hidden when title input is focused; baseline-aligned via `self-end mb-1` |
| `ViewTabsToolbar.tsx` | Dynamic tabs from `TabConfig[]` prop with **tab overflow menu**, **right-click context menu** (Rename/Duplicate/Delete with MDS icons), **"New View" dropdown** (+ button with `icon-neutrals-subtle`, appears on toolbar hover with fade+scale animation, stays visible while menu is open), and **inline tab renaming** (double-click active tab to edit, blur/Enter saves, Escape cancels, tab grows to fit text); search, AI sidekick (toggles sidebar), settings (toggles sidebar), new column icon buttons (all medium/32px); sticky top-0 left-0 z-20 within scroll area; exports `SidebarId`, `TabConfig`, `ViewType`, and `MENU_WIDTH` |

### Sidebar Components (`src/components/sidebar/`)

| File | Description |
|------|-------------|
| `SidebarShell.tsx` | Shared wrapper — configurable width (default 400px), white bg, border on content-facing edge (#F1F2F5), optional close button (`showClose` prop) |
| `SpaceMenu.tsx` | Left nav sidebar (280px) — top bar (Home, Search, Close), "Project Galaxy" header with chevron-up-down + three-dot actions, "1 member" link, interactive page list (Backlog/Roadmap) with active state + `onPageChange` callback, divider, "Add content" + "Pinned content" empty state |
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
| `DataTable.tsx` | Accepts `data: SpaceRow[]` and `fields: FieldDefinition[]` props; selection state, click-outside handler, composes TableHeader + TableRow; table has `min-width: 100%` so rows stretch to viewport; `item-enter` animation on mount |
| `TableHeader.tsx` | Sticky `<thead>` (top-16, below tabs toolbar within scroll area), bookmark icon on primary field, 56px tall, 14px Noto Sans semibold #656B81; fixed column widths (480px primary, 160px data); first column `w-0` to prevent expansion; trailing `table-fill` column absorbs remaining space |
| `TableRow.tsx` | Single `<tr>` — row number, drag handle, comment button (0px margin, no layout shift between idle/hover), MDS DropdownMenu context menu (Duplicate/Delete with icons), cells (12px horizontal padding); trailing `table-fill` column with divider line + rounded hover/selection highlight via `::before`/`::after` |
| `CellRenderer.tsx` | Field-type dispatcher — routes to the correct cell component (text, number, currency, avatars, status) |
| `cells/TextCell.tsx` | Text cell (14px Noto Sans regular) |
| `cells/NumberCell.tsx` | Number cell with locale formatting (Noto Sans) |
| `cells/CurrencyCell.tsx` | Currency cell, $NNK format (Noto Sans) |
| `cells/AvatarStackCell.tsx` | Overlapping avatar initials with overflow count (Noto Sans semibold) |
| `cells/StatusCell.tsx` | Coloured status chip — planning (yellow), in-progress (blue), done (green); rounded-full pill with semibold label |

### Kanban Module (`src/components/kanban/`)

| File | Description |
|------|-------------|
| `index.ts` | Barrel export — single public surface (`KanbanBoard`) |
| `KanbanBoard.tsx` | Accepts `data`, `fields`, and optional `columns` (Priority subset) props; groups data by priority, renders columns in horizontal `flex items-start` layout with 56px left padding, 40px trailing spacer; colour config per priority; staggered `item-enter` animation on mount (60ms increments per column) |
| `KanbanColumn.tsx` | 340px-wide column; two-layer sticky header (`top-16`, z-10) — outer `bg-white` wrapper masks cards area behind rounded corners, inner div has `rounded-t-lg` + column bg colour; cards area has own bg + `rounded-b-lg`; custom Canvas Tag header (28px, 6px radius) with item count + add/options icon buttons on `group` hover; custom `ColumnIconButton` uses `color-mix` for tinted hover/active states |
| `KanbanCard.tsx` | White card with coloured border (1.5px), 8px radius, subtle shadow; title text (14px Noto Sans) + field tags (flex-wrap, 8px gap); inline `FieldTag` sub-component formats values per field type |

### Timeline Module (`src/components/timeline/`)

| File | Description |
|------|-------------|
| `index.ts` | Barrel export — single public surface (`TimelinePlaceholder`) |
| `TimelinePlaceholder.tsx` | Centered empty state — icon, "Timeline view" heading (Roobert), description (Noto Sans), `item-enter` animation |

### Pages & Views

#### Backlog Page (default)
- **10 tabs** (temporary, for overflow testing) — All items, Kanban, By status, Timeline, Revenue breakdown, Customer impact, Team capacity, Sprint planning, Quarterly goals, Archive
- **All items** tab — DataTable with 18 backlog rows, 5 columns (Title, Mentions, Customers, Est. revenue, Companies)
- **Kanban** tab — KanbanBoard with all 5 priority columns (Triage/Now/Next/Later/Icebox)

#### Roadmap Page
- **Roadmap** tab — TimelinePlaceholder (coming soon)
- **Kanban** tab — KanbanBoard with 3 priority columns (Now/Next/Later), roadmap data with status tags on cards
- **Done** tab — DataTable filtered to `status === 'done'`, 5 columns (Title, Status, Customers, Est. revenue, Companies)

### Priority System

- **Priority type:** `'triage' | 'now' | 'next' | 'later' | 'icebox'` (defined in shared `types.ts`)
- **Backlog kanban** uses all 5 priorities; **Roadmap kanban** uses 3 (now/next/later)
- **Column colours** (bg / card border / tag bg / tag text):
  - Triage → coral (`#fff0f0` / `#ffc6c6` / `#ffc6c6` / `#600000`)
  - Now → cyan (`#e4f9ff` / `#b5ecff` / `#b5ecff` / `#003d54`)
  - Next → orange (`#ffeede` / `#ffc795` / `#ffc795` / `#5c3200`)
  - Later → lilac (`#f3eeff` / `#d4bbff` / `#d4bbff` / `#2d0066`)
  - Icebox → coal (`#f7f7f7` / `#dad8d8` / `#dad8d8` / `#222428`)

### Status System

- **Status type:** `'planning' | 'in-progress' | 'done'` (defined in shared `types.ts`)
- **Optional on SpaceRow** — backlog items have no status; roadmap items all have status
- **StatusCell colours** (bg / text):
  - Planning → yellow (`#FFF3CD` / `#664D03`)
  - In Progress → blue (`#D1ECF1` / `#0C5460`)
  - Done → green (`#D4EDDA` / `#155724`)

### Typography

- **Headers:** Roobert PRO semibold (`font-heading`) — database title, nav breadcrumb
- **Body copy:** Noto Sans regular (`font-body`) — table cells, card titles, secondary text
- **Labels:** Noto Sans semibold (`font-body font-semibold`) — table header labels, avatar initials, buttons
- Noto Sans loaded via Google Fonts (400 + 600); Roobert PRO self-hosted from `/fonts/`

### Layout & Sidebar Architecture

- **Horizontal flex layout** — App.tsx is `flex` (row): `[left sidebar slot] | [main content] | [right sidebar slot]`
- **Main content column** — `flex-1 min-w-0 overflow-hidden`, split into fixed nav + scroll area
- **Sidebar slots** — `shrink-0 overflow-hidden` wrappers with `transition-[width]` (300ms, `cubic-bezier(0.16, 1, 0.3, 1)`); left sidebar animates 0 → 280px, right sidebars 0 → 400px
- **Single `activeSidebar` state** — `'space-menu' | 'ai-sidekick' | 'view-settings' | null`; only one sidebar open at a time
- **Toggle behaviour** — clicking a trigger while its sidebar is open closes it; clicking a different trigger swaps sidebars
- **Push, not overlay** — sidebars are flex siblings, main content compresses when a sidebar opens

### Scroll & Sticky Behaviour

- **Two-zone layout** — TopNavBar is fixed (`shrink-0`, outside scroll area); everything else (title, tabs, table/kanban) lives in a single scroll area (`flex-1 min-h-0 overflow-auto flex flex-col`)
- **Horizontal scroll isolation** — only the table/kanban scrolls horizontally; DatabaseTitle and ViewTabsToolbar use `sticky left-0` to stay pinned while content scrolls sideways
- **Vertical sticky layers within scroll area:** tabs toolbar (top-0, z-20) → table header (top-16, z-10) → kanban column headers (top-16, z-10)
- **Fixed column widths** — Title: 480px, data columns: 160px; table uses `min-width: 100%` with a trailing fill column to extend row dividers and hover highlights to the viewport edge
- **Scroll-linked fade** — App `onScroll` handler computes `scrollFade` (0→1) from `scrollTop`; title opacity = `1 - scrollFade`, nav border opacity = `scrollFade`; fade starts at 10px, completes by 35px; breadcrumb fades in on scroll even when space menu is open (`opacity: isMenuOpen ? scrollFade : 1`)
- **Page switch scroll reset** — `switchPage()` resets `scrollTop` and `scrollFade` to 0 via scroll container ref
- Nav bottom border: 1px inset box-shadow `rgba(241, 242, 245, borderOpacity)` — matches table row divider colour (#F1F2F5)

#### Scroll architecture decision log

The original layout used a single full-page scroll container with three sticky layers (nav → tabs → table header). This worked for vertical scroll but caused the entire page to scroll horizontally when the table exceeded viewport width.

**Approaches tried:**
1. `overflow-x-auto` on DataTable wrapper — broke `<thead>` sticky positioning (CSS sticky only works relative to nearest scrolling ancestor; adding `overflow` on a parent creates a new scroll context)
2. `overflow-x-hidden` on page container + fixed column widths — prevented horizontal scroll entirely
3. Separate vertical/horizontal scroll containers — CSS doesn't allow `overflow-x: auto; overflow-y: visible` (the visible axis gets coerced to auto)

**Final approach:** single scroll area for both axes (`overflow: auto`), with `sticky left-0` on non-table elements to pin them horizontally. Nav sits outside the scroll area entirely. This gives independent horizontal table scroll while preserving vertical sticky behaviour and scroll-linked fade.

### Features

- **Fixed nav** — TopNavBar fixed at top (shrink-0, outside scroll area) with fading 1px bottom border on scroll
- Top nav: hamburger fades out when space menu is open; breadcrumb (Roobert #222428) with scroll-linked chevron + database title fades in on scroll (including when menu is open), notification bell, 3 Unsplash photo avatars (28px, overlapping), Share button (MDS primary medium); 8px left / 12px right padding
- **Editable database title** (32px Roobert), 48px top spacing; sticky left-0 (pinned horizontally); always-input pattern (single `<input>`, no element swap); auto-sizing via hidden measuring span; fades out on scroll; title updates when switching pages; **three-dots menu** appears on title hover (baseline-aligned, hidden when editing); 3 CSS-driven states modelled on Figma `.Editable Title` component:
  - **Idle** — transparent background, 2px horizontal padding, `cursor: default`
  - **Hover** — `#F1F2F5` background, 4px border-radius, `cursor: pointer`, 150ms transition
  - **Focused** — white background, double-ring focus: `0 0 0 2px white, 0 0 0 4px #2B4DF8`, `cursor: text`, click selects all text, Enter saves + blurs, Escape reverts + blurs, placeholder "Enter a title ..." in `#7D8297`; three-dots button hidden
- **Sticky tabs** — ViewTabsToolbar sticky top-0 left-0 z-20 within scroll area, 16px top / 16px bottom padding
- MDS panel-style tabs (`variant="buttons"`, controlled via `value`/`onChange`, 8px gap), dynamic tab labels from page config; **tab overflow** — when tabs exceed available width, overflow tabs move into a chevron-down dropdown (IconChevronDown) with layout-type icons (Table/Kanban/Timeline) and tab names; overflow detection via ResizeObserver + estimated/measured tab widths; chevron sits tight (8px) after last visible tab, before the + button; chevron highlighted when active tab is in overflow; 16px gap separates tab group from right actions; **"New View" dropdown** — ghost `IconPlus` button (`icon-neutrals-subtle`) after chevron, hidden by default, fades in with scale+slide on toolbar hover (`group` on outer div), stays visible while dropdown is open via `onOpen`/`onClose` state; dropdown offers Table, Kanban, Timeline with MDS icons; **inline tab rename** — double-click active tab overlays an input (absolute inset-0) matching tab styling, trigger content swaps to draft text (visibility hidden) so tab grows to fit; search + AI sidekick + settings + new column icon buttons (all medium/32px ghost)
- **Tab overflow selected state** — when the active tab is in the overflow menu, the chevron button shows pale blue bg (`#F2F4FC`) + blue icon (`#2B4DF8`) matching the MDS selected tab style; the selected overflow menu item also shows blue text and blue icon; when the menu is just open (no active tab in overflow), chevron uses neutral grey (`#F1F2F5`)
- **Tooltips on tab toolbar buttons** — MDS Tooltip on overflow chevron ("More views") and new view + button ("Add a view"); `side="top"` with `sideOffset={4}` for 4px gap; Tooltip wraps DropdownMenu with `Tooltip.Trigger asChild` around `DropdownMenu.Trigger asChild` for correct composition; MDS auto-hides tooltip when dropdown opens
- **Tab context menu** — right-click any tab (active or inactive) opens MDS DropdownMenu with Rename (IconPen), Duplicate (IconSquaresTwoOverlap), Delete (IconTrash); Rename switches to the tab and triggers inline edit; Duplicate copies the tab with incremented label ("Kanban" → "Kanban 2") inserted after the source; Delete removes the tab and selects nearest right neighbour (or left if last); Delete is `aria-disabled` when only 1 tab remains; controlled via `open` prop + `contextTabId` state
- **View management** — "New View" dropdown (Table/Kanban/Timeline with icons) creates a new tab and auto-switches to it; naming avoids collisions by checking existing labels (not types), so renamed tabs don't cause spurious numbering; double-click active tab to rename inline (blur saves, Enter saves, Escape cancels); tab input grows to fit text via invisible trigger-as-spacer pattern; duplicate and delete via right-click context menu
- **Page switching** — Space Menu page list is interactive; clicking Backlog/Roadmap switches page, resets tabs and scroll
- **Three push sidebars** — hamburger opens Space Menu (left, 280px), sparkle opens AI Sidekick (right, 400px), settings icon opens View Settings (right, 400px); smooth 300ms width animation; active toolbar buttons show #F1F2F5 background; Space Menu has its own close button in top bar, right sidebars use SidebarShell close button
- **Sticky table header** — sticks below tabs (top-16, z-10) within scroll area, scrolls horizontally with table
- **Staggered view transitions** — switching tabs triggers `item-enter` animation; table fades in as a unit (80ms delay); kanban columns stagger left-to-right (80ms–320ms, 60ms increments)
- Data table: 18 backlog rows / 3 done rows (filtered), 56px row height
- **Kanban board** — 5 priority columns (backlog) or 3 columns (roadmap) with coloured backgrounds and card borders; cards show title + field tags; board scrolls horizontally
- **Kanban sticky headers** — two-layer construction: outer `bg-white` sticky wrapper masks card area behind inner div's `rounded-t-lg` corners; cards area has own bg + `rounded-b-lg`; rounded corners preserved at every scroll depth
- **Fill-width table rows** — table has `min-width: 100%`; trailing `table-fill` column absorbs remaining viewport space; divider lines extend to 56px from right edge via `::after`; hover/selection highlight extends with rounded right corners via `::before`; first column uses `w-0` to prevent expansion
- 56px page padding on title/tabs/table
- Table header: 56px tall, 14px semibold text (#656B81), bookmark icon on primary field, 12px/20px cell padding
- Inset row dividers (56px from each edge), hidden on hover/selection
- Row hover: rounded 8px background (#FAFBFC), row number replaced by drag handle + comment button (no layout shift — idle state reserves space for both controls with matching 0px margin)
- Row selection: click drag handle to select (blue #F2F4FC background, blue icon), MDS DropdownMenu context menu with Duplicate (IconSquaresTwoOverlap) / Delete (IconTrash)
- Click outside table or re-click drag handle to deselect
- 5 cell formatters: text (14px), number (locale), currency ($NK/dash), avatar stack (3 visible + overflow), status (coloured pill)
- **Shared dropdown menu width** — `MENU_WIDTH = 192` exported from ViewTabsToolbar, applied as `minWidth` on all MDS DropdownMenu.Content instances (tab context menu, new view, new column, row context menu) for consistent sizing
- Thin scrollbar styling (`.page-scroll` on scroll area), `border-separate` for per-cell border-radius support

#### Tab drag-to-reorder (WIP — not yet working)

Goal: click-hold and drag visible tabs to reposition them in the tab bar. Overflow tabs excluded from drag.

**State added:**
- `handleReorderTabs(reorderedTabs: TabConfig[])` in App.tsx — receives full reordered array, updates `pageTabs[activePage]`
- `onReorderTabs` prop on ViewTabsToolbar
- `draggedTabId`, `dropIndex` state + `dragRef` ref in ViewTabsToolbar
- `computeDropIndex(clientX)` walks visible tab elements via `tabElMap` to find insertion point
- `finishDrag()` maps visible drop index to full-array index, splices, calls `onReorderTabs`
- `showIndicatorAt(visibleIndex)` — returns true when a 2px blue line should appear (suppressed at dragged tab's own position)
- Drop indicator: `absolute -left-[5px]` / `-right-[5px]`, 2px wide, 20px tall, `#2B4DF8`, `rounded-full`

**DOM structure:** outer draggable `<div>` wraps each tab's `<DropdownMenu>` (context menu). The `DropdownMenu.Trigger asChild` wraps an inner `<div>` containing `<Tabs.Trigger>`. The `tabElMap` ref is on the inner div for width measurement.

**Approaches tried and failed:**
1. **Native HTML5 `draggable` on outer div** — Radix `Tabs.Trigger` calls `preventDefault()` on `pointerdown` events, which blocks the browser from initiating native drag. Moving the `draggable` div outside `DropdownMenu.Trigger` didn't help because `Tabs.Trigger` (deeper in the tree) still intercepts pointer events before drag can start.
2. **Custom mouse-based drag (current code)** — `onMouseDown` on outer wrapper records start position in `dragRef`; document-level `mousemove` listener checks 5px threshold then sets `draggedTabId`; `mouseup` calls `finishDrag`. The `useEffect` attaches/detaches document listeners when `dragRef.current` is set. **Problem:** the effect depends on `dragRef.current` (a ref, not state) so it doesn't re-run when `onMouseDown` sets the ref — the document listeners never get attached. The drag state never activates.

**Next steps to try:**
- Fix the effect trigger: use a piece of state (e.g. `isDragPending`) set alongside `dragRef.current` in `handleTabMouseDown` so the `useEffect` re-runs and attaches listeners. Or attach listeners in `handleTabMouseDown` directly (no effect needed) and clean up in the mouseup handler.
- Alternative: use `onPointerDown` with `e.stopPropagation()` on the outer wrapper to prevent Radix from seeing the event, combined with native `draggable`. But this would also block tab-switching clicks — would need a threshold to distinguish click vs drag before deciding whether to stop propagation.

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
    src/components/table/cells/ (TextCell, NumberCell, CurrencyCell, AvatarStackCell, StatusCell)
    src/components/kanban/ (index, KanbanBoard, KanbanColumn, KanbanCard)
    src/components/timeline/ (index, TimelinePlaceholder)
    src/lib/filterParser.ts
    src/App.tsx, main.tsx, index.css
docs/plans/
  2026-03-03-spaces-table-design.md
  2026-03-05-editable-title-design.md
```

---

## Next Steps

### Immediate
- Design and build the timeline view for the Roadmap page

### Backlog — Table Interactions
- **Row hover corner radius** — left and right corners of hover/selected highlight render at visually different radii despite identical CSS values (8px); likely a browser compositing issue with separate `::before` pseudo-elements on `divider-first` vs `table-fill` cells; tried unifying to `border-radius: 8px` on both and a single `<tr>::before` approach (didn't work — `<tr>` positioned box doesn't span full table width); needs a different strategy
- **Column resizing** — drag column edges to resize, persist widths
- **Inline cell editing** — click to edit text/number/currency cells in place
- **Sort interaction** — click column headers to sort ascending/descending with indicator arrow
- **Filter integration** — connect sidebar filter panel to table data (shared filter state)
- **Empty state** — design for zero-row / no-results scenarios
- **Row reordering** — drag handle actually reorders rows with animation
- **Keyboard navigation** — arrow keys to move between cells, Enter to edit

### Backlog — Kanban Interactions
- **Drag and drop** — move cards between priority columns
- **Card expansion** — click card to open detail view
- **Column collapse** — collapse/expand columns

### Backlog — Sidebar
- **AI Sidekick content** — design and build the AI Sidekick panel content
- **Space Menu interactions** — space switcher dropdown, search functionality

---

## GitHub

- **Repo:** [mikefrommiro/table-views](https://github.com/mikefrommiro/table-views)
- **Branch:** `master`
