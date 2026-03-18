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

Full-screen space with **two pages** (Backlog, Roadmap) and **dynamic views** across them. Structured as six domains: **page** (the space shell), **table** (data table module), **kanban** (kanban board module), **timeline** (timeline module), **sidebar** (push-panel sidebars), and **canvas** (infinite canvas mode).

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
| `DatabaseTitle.tsx` | Always-input editable title (32px Roobert), 48px top spacing; sticky left-0 (pinned horizontally, scrolls vertically); 3 CSS-driven states (idle/hover/focused) matching Figma `.Editable Title`; auto-sizing via hidden measuring span; opacity fades out on scroll; updates per page; **three-dots menu** beside title — hover-to-reveal with fade+scale animation (`group/title`), stays visible while dropdown is open (`menuOpen` state via `onOpen`/`onClose`), hidden when title input is focused; all icon buttons baseline-aligned via `self-end mb-[7px]`; **sync indicator** (widget variant only) — `IconArrowUpRight` in blue icon button (`#E8ECFC` bg, `#2B4DF8` icon, 8px radius); appears right of h1 with `ml-1.5` when `syncCount > 1`; always visible (not hover-gated); `sync-in` keyframe animation on entrance; MDS Tooltip "Synced with N other view(s)"; **expand button** (widget variant only) — `IconArrowsOutSimple` icon button, hover-to-reveal pattern, calls `onExitCanvas` to return to full view |
| `MoveToRoadmapSnackbar.tsx` | Dark snackbar (`#2B2D33`, `#7D8297` border, 8px radius) — `IconCheckMark` + "Record moved to roadmap" + "Open roadmap" ghost button; blue progress bar (`#3859FF`, 4px tall) shrinks over 6s; slides up/down via `toastSlideUp`/`toastSlideDown` keyframes; auto-dismisses after 6s; "Open roadmap" triggers page transition to roadmap with delayed sidebar open |
| `ViewTabsToolbar.tsx` | Dynamic tabs from `TabConfig[]` prop with **searchable tab overflow popover** (MDS Popover + InputSearch replacing DropdownMenu; auto-focused search input with suppressed focus ring, "Find a view" placeholder, clearable; 16px icons, 36px items with 8px padding matching DropdownMenu.Item spec; 12px container padding; active tab highlighted blue; "No views found" empty state; query resets on close), **right-click context menu** (Rename/Duplicate/Delete with MDS icons, `alignOffset={-8}` to align icons with tab text), **"New View" dropdown** (+ button with `icon-neutrals-subtle`, appears on toolbar hover with fade+scale animation, stays visible while menu is open), **inline tab renaming** (double-click active tab to edit, blur/Enter saves, Escape cancels, tab grows to fit text), and **tab-switch confirmation** (widget variant only) — clicking a non-active tab sets `pendingTabId` instead of switching; shows DropdownMenu with IconUsers "Change view for everyone" and IconArrowUpRight "Make a copy and sync"; tab shows `#F1F2F5` bg while dropdown is open; `pointer-events-none` invisible trigger lets clicks pass through to Tabs.Trigger; **unified 8px border-radius** on all tabs (`Tabs.List` `& button` override) and all `IconButton` components (overflow chevron, add-view, search, AI sidekick, settings, new column); **right-side action buttons** — search, AI sidekick, settings, new column (all medium/32px ghost) with **MDS Tooltips + Hotkey badges** (Search ⌘F, AI Sidekick ⌘K, View settings ⌘,, New column +); new column dropdown is controlled (`newColumnMenuOpen` prop from App.tsx); sticky top-0 left-0 z-20 within scroll area; exports `SidebarId`, `TabConfig`, `ViewType`, and `MENU_WIDTH` |

### Sidebar Components (`src/components/sidebar/`)

| File | Description |
|------|-------------|
| `SidebarShell.tsx` | Shared wrapper — configurable width (default 320px), white bg, border on content-facing edge (#F1F2F5), optional close button (`showClose` prop) |
| `SpaceMenu.tsx` | Left nav sidebar (320px) — top bar (Home, Search, Close), "Project Galaxy" header with chevron-up-down + three-dot actions, "1 member" link, interactive page list (Backlog/Roadmap) with active state + `onPageChange` callback, divider, "Add content" + "Pinned content" empty state |
| `AiSidekickPanel.tsx` | Right placeholder — sparkle icon, "AI Sidekick" heading, empty state message |
| `SidePanel.tsx` | View settings sidebar — accepts `onClose` and `fields` props; **header bar** with "Settings" title on main view (14px Roobert semibold), back button on detail pages, close button (IconCross); scroll-linked bottom border (200ms transition); "View" and "Fields" section headers inside scrollable content; **dynamic layout icon** — Layout setting cell icon updates to match selected layout (Table→IconTable, Kanban→IconKanban, Timeline→IconTimelineFormat) via `LAYOUT_ICONS` map; **dynamic fields** — Fields list driven by `pageFields` from App.tsx (backlog fields or roadmap fields), icons mapped via `FIELD_TYPE_ICONS` (text→IconTextT, number→IconNumber, currency→IconDollarSignCurrency, avatars→IconOffice, status→IconTickCircle); full filter/layout/fields functionality with AI bar |
| `AiBar.tsx` | AI prompt bar — 4-state machine, 14px text, fluid width (fills container via `left-4 right-4` positioning) |
| `FilterPage.tsx` | Filter condition builder (copied from sidebar package) |
| `SectionHeader.tsx` | Section label rows — 14px Roobert semibold in neutrals-subtle (`#7D8297`), optional + / ··· action buttons |
| `SettingCell.tsx` | Setting row — 14px Roobert semibold label, 40px rounded-lg icon container with 20px icons; **3-state icon bg** — on (blue): idle `#F2F4FC` → hover `#E8ECFC` → pressed `#D9DFFC`; off (gray): idle `#F1F2F5` → hover `#E6E6E6`; icon hover driven by whole-cell hover via ref; `pressed` prop locks pressed bg (used for layout dropdown); chevron at far right (subtle gray `#7D8297`, show on hover); down chevron for layout, right chevron for others; no cell background hover |
| `FieldRow.tsx` | Field row — 14px Roobert semibold label, 40px rounded-lg icon container with 20px icons; **visible state**: blue icon (`#F2F4FC`/`#E8ECFC`/`#D9DFFC`), dark label; **hidden state**: gray icon (`#F1F2F5`/`#E6E6E6`, `#7D8297` icon+label colour); action buttons: drag handle + edit `IconButton` + eye toggle `IconButton` (right-most); drag+edit show on hover only; eye-closed stays visible when field is hidden; hidden fields auto-sort to bottom of list; `onEdit` opens field detail page; `onToggleVisibility` toggles visibility state; no cell background hover |

### Table Module (`src/components/table/`)

| File | Description |
|------|-------------|
| `index.ts` | Barrel export — single public surface (`DataTable`) |
| `DataTable.tsx` | Accepts `data: SpaceRow[]` and `fields: FieldDefinition[]` props; selection state, click-outside handler, composes TableHeader + TableRow; table has `min-width: 100%` so rows stretch to viewport; `item-enter` animation on mount; threads `onMoveToRoadmap` and `showMoveToRoadmap` props to rows |
| `TableHeader.tsx` | Sticky `<thead>` (top-16, below tabs toolbar within scroll area), bookmark icon on primary field, 56px tall, 14px Noto Sans semibold #656B81; fixed column widths (480px primary, 208px data); first column `w-0` to prevent expansion; trailing `table-fill` column absorbs remaining space |
| `TableRow.tsx` | Single `<tr>` — row number, drag handle, comment button (0px margin, no layout shift between idle/hover), MDS DropdownMenu context menu (9 items + 3 separators: Open in side panel, View comments, Move to roadmap, Add record above/below, Add sub-record, Duplicate, Delete; "Move to roadmap" is functional on backlog page only, others close menu), cells (12px horizontal padding); trailing `table-fill` column with divider line + rounded hover/selection highlight via `::before`/`::after`; selected row bg `#F2F4FC` (light blue) |
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
| `KanbanBoard.tsx` | Accepts `data`, `fields`, and optional `columns` (Priority subset) props; groups data by priority, renders columns in horizontal `flex items-stretch` layout with 56px left padding, 40px trailing spacer; columns stretch to match tallest column height; colour config per priority; staggered `item-enter` animation on mount (60ms increments per column) |
| `KanbanColumn.tsx` | 340px-wide column (`h-full` to fill stretched parent); two-layer sticky header (`top: 64px` with `paddingTop: 12px`, z-10) — outer `bg-white` wrapper masks cards area behind rounded corners and covers gap below tabs, inner div has `rounded-t-lg` + column bg colour; cards area has own bg + `rounded-b-lg` + `flex-1` to fill remaining height; custom Canvas Tag header (28px, 6px radius) with item count + add/options icon buttons on `group` hover; custom `ColumnIconButton` uses `color-mix` for tinted hover/active states |
| `KanbanCard.tsx` | White card with coloured border (1.5px), 8px radius, subtle shadow; title text (14px Noto Sans) + field tags (flex-wrap, 8px gap); inline `FieldTag` sub-component formats values per field type |

### Canvas Module (`src/components/canvas/`)

| File | Description |
|------|-------------|
| `CanvasOverlay.tsx` | Full-viewport overlay with Miro dot grid background (`#F2F2F2` base, `#D5D8DE` 1px dots via CSS `radial-gradient`); **adaptive grid density** — `getGridSpacing()` uses power-of-2 multiplier to keep on-screen dot spacing in 16–48px range as zoom changes (base 24px); background-size and background-position update dynamically from `panX`, `panY`, `zoom` props; **wheel event handler** (`passive: false` via `useEffect`) — `ctrlKey`/`metaKey` + scroll = pinch-to-zoom toward cursor via `onZoom(newZoom, focalX, focalY)`, plain scroll = pan via `onPan(dx, dy)`; click on overlay = `onDeselect()` to clear widget selection; always in DOM, visibility controlled via opacity + pointer-events; `position: fixed; inset: 0; z-index: 60` |
| `CanvasPillButton.tsx` | Floating pill button (MDS `Button` with `rounded` + `ghost` variant) — centered within the toolbar area via `fixed` positioning with dynamic `left`/`right` values matching sidebar widths; two visual states: **table mode** (`#F1F2F5` bg, `IconArrowsInSimple`, "Go to canvas") and **canvas mode** (white bg + shadow, `IconArrowsOutSimple`, "Go to {pageTitle}"); hover-to-reveal in table mode (visible when hovering nav/title/tabs area or the pill itself), always visible on canvas; `onHoverChange` callback prevents flicker when cursor moves between nav and pill; `z-index: 110` above all other layers |
| `CanvasNavPanels.tsx` | Two floating white panels on canvas — **left** (menu + breadcrumb, `pl-2 pr-4`) and **right** (bell + avatars + Share, `px-2`); 40px tall (navbar 56px − 16px), positioned 8px from top and left/right edges (`rounded-lg`, subtle shadow `0 2px 8px rgba(0,0,0,0.08)`); content vertically aligns with navbar elements so no visual movement during transition; fade in/out with canvas overlay; **not affected by pan/zoom** — stays fixed as UI chrome |
| `CanvasTableWidget.tsx` | Floating table widget on canvas — renders DatabaseTitle + ViewTabsToolbar + active view (table/kanban/timeline); white bg, 12px rounded corners, `0 2px 4px 0 rgba(34,36,40,0.08)` shadow, `32px 40px 40px` padding; `data-widget-id` and `data-widget-card` attributes for DOM measurement; **multi-widget support** — App.tsx manages `CanvasWidget[]` array (`id`, `activeTab`, `x`, `y`); each widget gets its own active tab and position; `selectedWidgetId` tracks which widget is selected (one at a time); selected widget gets higher z-index (80 vs 70); **position lifting** — `initialX`/`initialY` from parent, local state for responsive drag, `onMove` syncs back on drag end; first widget centers in viewport on canvas open (centering effect triggers on `isOpen` change); **smart widget placement** — duplicated widgets measure source widget's actual DOM width via `data-widget-card` and position the copy to its right with 60px gap (no overlap); **tab-switch confirmation** — on canvas widget, clicking a non-active tab shows a DropdownMenu (IconUsers "Change view for everyone" / IconArrowUpRight "Make a copy and sync") instead of switching immediately; tab gets `#F1F2F5` background while dropdown is open; controlled via `pendingTabId` state with `pointer-events-none` invisible trigger so clicks pass through to Tabs.Trigger; "Change view" calls `onTabChange`, "Make a copy" calls `onDuplicateWidget`; **sync indicator** — when 2+ widgets exist, a blue `IconArrowUpRight` icon button appears in the DatabaseTitle header (right of h1, before expand/dots); always visible with `#E8ECFC` bg, `#2B4DF8` icon; `sync-in` entrance animation (scale 0.7→1, 300ms) with static `translate-y-1` offset (decoupled from animation fill to avoid jump when pulse overrides); MDS Tooltip shows "Synced with N other view(s)"; `syncCount` prop flows App.tsx → CanvasTableWidget → DatabaseTitle; **sync pulse** — `sync-pulse` CSS class (opacity 1→0.15→1, 1.4s ease-in-out, 3 iterations, 500ms delay) triggered on all sync indicators when a new widget is created via `syncShimmering` state + 3.5s auto-clear timeout; **Backspace/Delete to remove** — selected duplicated widgets can be deleted via keyboard (at least one widget must remain); **two-layer transform architecture** — outer `fixed top-0 left-0` container applies `translate(panX, panY) scale(zoom)` from `transformOrigin: 0 0`, inner `absolute` div holds widget at world-space position; `overflow: visible` on card so tooltips escape widget bounds; `.canvas-widget-view` CSS hides `table-fill` column and zeroes out `pl-14` page gutters; row hover/selection backgrounds get 8px border-radius on both edges; `variant="widget"` prop on DatabaseTitle (expand button + sync indicator) and ViewTabsToolbar (tighter padding, tab-switch confirmation, disabled right-side action buttons); **click-to-select**, **drag-to-reposition**, **wheel event forwarding**, **Miro-style selection border** (1.5px `#3859FF`, square corners, 4 white corner handles); `grab` cursor when selected; right-side toolbar buttons (Search, AI Sidekick, Settings, New Column) visible but non-functional on widget |

### Timeline Module (`src/components/timeline/`)

| File | Description |
|------|-------------|
| `index.ts` | Barrel export — single public surface (`TimelinePlaceholder`) |
| `TimelinePlaceholder.tsx` | Interactive Gantt-style timeline — accepts `data: SpaceRow[]` prop (was static import); draggable bars (move, resize-left, resize-right) with avatar + title + optional Jira icon; March 1 – April 15 date range; sticky month header (`top: 64px`) and day numbers (`top: 108px`) below tabs toolbar with gap-cover box-shadow; drag-to-pan via `parentScrollRef` (scrolls main page container); drag-to-reorder rows vertically with swap preview; date tooltip while dragging; alternating weekend column backgrounds; grid fills viewport height; deferred pointer capture with 3px drag threshold; contextual toolbar rendered outside bar DOM; ghost bar placement flow via `ghostRowId`/`onBarPlaced` props; milestone line + diamond commented out (date highlight retained); `item-enter` animation |

### Pages & Views

#### Backlog Page (default)
- **3 tabs** — All items, Kanban, Timeline
- **All items** tab — DataTable with 18 backlog rows, 5 columns (Title, Mentions, Customers, Est. revenue, Companies)
- **Kanban** tab — KanbanBoard with all 5 priority columns (Triage/Now/Next/Later/Icebox)

#### Roadmap Page
- **Roadmap** tab — Interactive timeline with 14 draggable bars, sticky date headers, drag-to-pan and drag-to-reorder
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
- **Sidebar slots** — `shrink-0 overflow-hidden` wrappers with `transition-[width]` (300ms, `cubic-bezier(0.16, 1, 0.3, 1)`); all sidebars animate 0 → 320px
- **Single `activeSidebar` state** — `'space-menu' | 'ai-sidekick' | 'view-settings' | null`; only one sidebar open at a time
- **Toggle behaviour** — clicking a trigger while its sidebar is open closes it; clicking a different trigger swaps sidebars
- **Push, not overlay** — sidebars are flex siblings, main content compresses when a sidebar opens

### Scroll & Sticky Behaviour

- **Two-zone layout** — TopNavBar is fixed (`shrink-0`, outside scroll area); everything else (title, tabs, table/kanban/timeline) lives in a single scroll area (`flex-1 min-h-0 overflow-auto flex flex-col`)
- **Horizontal scroll isolation** — main scroll container uses `overflow: auto` for both axes; DatabaseTitle and ViewTabsToolbar use `sticky left-0` to stay pinned while table/kanban/timeline content scrolls horizontally
- **Vertical sticky layers within scroll area:** tabs toolbar wrapper (`sticky top-0 left-0 z-20`) → table header `<th>` cells (`sticky top-[64px] z-10`) → kanban column headers (`sticky top-[64px] z-10 with 12px paddingTop`) → timeline month header (`sticky top-[64px] z-10`) → timeline day numbers (`sticky top-[108px] z-10`)
- **Gap coverage** — table header uses `box-shadow: 0 -12px 0 0 white` to cover the gap between tabs and header; kanban column headers use `top: 64px` with `paddingTop: 12px` on a white bg wrapper to mask cards scrolling behind; timeline month header uses the same box-shadow technique
- **Database title fade** — title stays at fixed 48px font size and fades to 0% opacity on scroll (`opacity: 1 - scrollFade`), replacing the previous font-size-shrink approach
- **Fixed column widths** — Title: 480px, data columns: 208px; table uses `min-width: 100%` with a trailing fill column to extend row dividers and hover highlights to the viewport edge
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
- **Editable database title** (32px Roobert), 48px top spacing; sticky left-0 z-30 (pinned horizontally, above tabs toolbar); always-input pattern (single `<input>`, no element swap); auto-sizing via hidden measuring span; fades out on scroll; title updates when switching pages; **three-dots menu** hover-to-reveal beside title (`group/title` hover shows with fade+scale, stays visible while dropdown is open, hidden when editing); menu items: Set as default view (IconStar), Copy link (IconLink), Version history (IconClockCounterClockwise), Info (IconInformationMarkCircle), Rename (IconPen), Duplicate (IconSquaresTwoOverlap), Delete (IconTrash) with separators; 3 CSS-driven states modelled on Figma `.Editable Title` component:
  - **Idle** — transparent background, 2px horizontal padding, `cursor: default`
  - **Hover** — `#F1F2F5` background, 4px border-radius, `cursor: pointer`, 150ms transition
  - **Focused** — white background, double-ring focus: `0 0 0 2px white, 0 0 0 4px #2B4DF8`, `cursor: text`, click selects all text, Enter saves + blurs, Escape reverts + blurs, placeholder "Enter a title ..." in `#7D8297`; three-dots button hidden
- **Sticky tabs** — ViewTabsToolbar sticky top-0 left-0 z-20 within scroll area, 16px top / 24px bottom padding
- MDS panel-style tabs (`variant="buttons"`, controlled via `value`/`onChange`, 8px gap), dynamic tab labels from page config; **searchable tab overflow with drag-to-reorder** — when tabs exceed available width, overflow tabs trigger a chevron; clicking opens a **Popover** (12px border-radius) listing **all tabs** (not just overflow) with MDS `InputSearch` ("Find a view" placeholder, clearable, auto-focused, no focus ring); 16px icons (`size="small"`), 36px items with 8px padding, 2px item gap, 8px spacing after search input, 12px container padding; black icons (`#222428`); hover swaps view type icon for gray `IconDotsSixVertical` drag handle (`#AEB2C0`) via `group/item` pattern; **drag-to-reorder with live preview** — mousedown initiates drag, floating ghost row (white bg, 75% opacity, elevation shadow `0 4px 16px`) follows cursor outside popover DOM (escapes Radix transform clipping), original item goes `opacity-0`; non-dragged items use `translateY(±38px)` with `transition: transform 150ms ease` to physically shuffle into the preview order as the cursor moves past item midpoints (items between drag source and drop target shift up or down by one slot), creating a natural white-space gap at the drop position with no styled indicator; mouseup commits reorder via `onReorderTabs`; drag disabled during search; popover `onClose` guarded during drag; `didDragRef` prevents tab switch on drop; "No views found" empty state; query resets on close; overflow detection via ResizeObserver + estimated/measured tab widths; chevron highlighted when active tab is in overflow; 16px gap separates tab group from right actions; **"New View" dropdown** — ghost `IconPlus` button (`icon-neutrals-subtle`) after chevron, hidden by default, fades in with scale+slide on toolbar hover (`group` on outer div), stays visible while dropdown is open via `onOpen`/`onClose` state; dropdown offers Table, Kanban, Timeline with MDS icons; **inline tab rename** — double-click active tab overlays an input (absolute inset-0) matching tab styling, trigger content swaps to draft text (visibility hidden) so tab grows to fit; search + AI sidekick + settings + new column icon buttons (all medium/32px ghost)
- **Tab overflow selected state** — when the active tab is in the overflow menu, the chevron button shows pale blue bg (`#F2F4FC`) + blue icon (`#2B4DF8`) matching the MDS selected tab style; the selected overflow menu item also shows blue text and blue icon; when the menu is just open (no active tab in overflow), chevron uses neutral grey (`#F1F2F5`)
- **Tooltips on tab toolbar buttons** — MDS Tooltip on overflow chevron ("All views"), new view + button ("Add a view"), and all 4 right-side action buttons with `Tooltip.Hotkey` badges (Search ⌘F, AI Sidekick ⌘K, View settings ⌘,, New column +); `side="top"` with `sideOffset={4}` for 4px gap; Tooltip wraps DropdownMenu with `Tooltip.Trigger asChild` around `DropdownMenu.Trigger asChild` for correct composition; MDS auto-hides tooltip when dropdown opens
- **Global keyboard shortcuts** — `useEffect` keydown listener in App.tsx: ⌘K toggles AI Sidekick sidebar, ⌘, toggles View Settings sidebar, + opens New Column dropdown (only when not in an input/textarea); `toggleSidebar` wrapped in `useCallback`; new column dropdown controlled via `newColumnMenuOpen` state passed to ViewTabsToolbar
- **Tab context menu** — right-click any tab (active or inactive) opens MDS DropdownMenu with Rename (IconPen), Duplicate (IconSquaresTwoOverlap), Delete (IconTrash); Rename switches to the tab and triggers inline edit; Duplicate copies the tab with incremented label ("Kanban" → "Kanban 2") inserted after the source; Delete removes the tab and selects nearest right neighbour (or left if last); Delete is `aria-disabled` when only 1 tab remains; controlled via `open` prop + `contextTabId` state
- **View management** — "New View" dropdown (Table/Kanban/Timeline with icons) creates a new tab and auto-switches to it; naming avoids collisions by checking existing labels (not types), so renamed tabs don't cause spurious numbering; double-click active tab to rename inline (blur saves, Enter saves, Escape cancels); tab input grows to fit text via invisible trigger-as-spacer pattern; duplicate and delete via right-click context menu
- **Page switching** — Space Menu page list is interactive; clicking Backlog/Roadmap switches page, resets tabs and scroll
- **Three push sidebars** — hamburger opens Space Menu (left, 320px), sparkle opens AI Sidekick (right, 320px), settings icon opens View Settings (right, 320px); smooth 300ms width animation; active toolbar buttons show #F1F2F5 background; Space Menu has its own close button in top bar; AI Sidekick uses SidebarShell close button; View Settings has its own header bar with integrated close button (SidebarShell close hidden via `showClose={activeSidebar !== 'view-settings'}`)
- **Sticky table header** — sticks below tabs (top-16, z-10) within scroll area, scrolls horizontally with table
- **Staggered view transitions** — switching tabs always replays `item-enter` animation (via `key={activeTab}` forcing remount), even when switching between tabs of the same view type; table fades in as a unit (80ms delay); kanban columns stagger left-to-right (80ms–320ms, 60ms increments)
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
- **Shared dropdown menu width** — `MENU_WIDTH = 220` exported from ViewTabsToolbar, applied as `minWidth` on all MDS DropdownMenu.Content instances (tab context menu, new view, new column, row context menu, title menu) for consistent sizing
- **Dropdown icon alignment** — `alignOffset={-12}` on icon-button-triggered menus (title three-dots, overflow chevron, new view +, row context) aligns menu item icons with the center of the trigger icon button
- **View Settings sidebar** — header bar with "Settings" title (14px Roobert semibold) + close button on main view, back button on detail pages; scroll-linked 1px bottom border (200ms transition); `pt-14` (56px) scroll padding aligns first setting icon with tab bar action icons; "View" and "Fields" as section headers (14px Roobert, neutrals-subtle `#7D8297`) inside scrollable content; **dynamic layout icon** — Layout setting cell icon updates to match selected layout via `LAYOUT_ICONS` map; **dynamic fields** driven by active page's field definitions; **setting cells** — 14px labels, 20px icons in 40px rounded-lg containers; no cell bg hover — icon square changes colour on cell hover instead; 3-state icon bg (idle/hover/pressed) with `pressed` prop for dropdown-open state; chevron at far right in subtle gray, show on hover; **default states** — Layout (Kanban, on/green), Filter (off/gray by default, blue when active), Sort (off), Group by (off), Swimlanes (off); **field rows** — visible/hidden toggle via eye icon button (IconEyeOpen/IconEyeClosed); hidden fields use off-state styling (gray icon `#F1F2F5`, muted label+icon `#7D8297`) and auto-sort to bottom; edit icon button opens field detail page; drag handle + edit show on hover, eye-closed stays visible; `hiddenFields` Set state in SidePanel; `onClose` + `fields` props from App.tsx
- **Canvas mode** — full-screen infinite canvas with Miro dot grid background; toggled via "Go to canvas" pill button (table mode only — canvas-mode "Go to Backlog" pill disabled, expand button on widget is the exit path); **full-viewport takeover** hides nav, sidebars, and all table content; smooth 500ms transition (app layout scales to 0.92 + fades out, canvas fades in) using `cubic-bezier(0.16, 1, 0.3, 1)` expo-out easing; sidebars force-closed on canvas open; Escape key closes canvas; **floating nav panels** on canvas replicate left (menu + breadcrumb) and right (bell + avatars + Share) nav sections as white rounded panels at 8px from edges; **hover-to-reveal pill** in table mode only; **canvas pan/zoom** — `panX`, `panY`, `zoom` state in App.tsx; trackpad scroll = pan, trackpad pinch / keyboard +/- = zoom toward focal point; `zoomTo()` helper applies focal-point math; zoom clamped 0.1–3; all canvas state resets on enter/exit; **adaptive dot grid** — grid spacing uses power-of-2 density resets so on-screen dot gap stays 16–48px at any zoom level; **multi-widget canvas** — `widgets: CanvasWidget[]` state in App.tsx (each with `id`, `activeTab`, `x`, `y`); canvas opens with one centered widget; additional widgets created via "Make a copy and sync" tab-switch action; each widget has its own active tab and position; `selectedWidgetId` tracks selection (one at a time, higher z-index); **tab-switch confirmation dropdown** — clicking a non-active tab on a canvas widget shows a DropdownMenu with "Change view for everyone" (switches tab) and "Make a copy and sync" (creates offset duplicate with the new view); adds deliberate friction to make users aware that tab changes affect what others see; **auto-pan on copy-and-sync** — after creating a new widget, canvas smoothly pans (600ms CSS transition on widget transforms + overlay background-position) to place the new widget's top-left at `(80px, 100px)` from viewport origin, clearing floating nav panels; `smoothPanning` flag enables transitions then auto-clears after 700ms; **drag-to-reposition** — pointer events with 3px threshold, screen deltas divided by zoom for world-space movement, `onMove` syncs position to parent; **click-to-select** with Miro-style selection border (1.5px `#3859FF`, square corners, 4 white corner handles); **expand button** on widget title exits canvas; **widget toolbar** — right-side action buttons visible but non-functional on canvas; `overflow: visible` on card so tooltips escape widget bounds; last table row has no bottom border
- Thin scrollbar styling (`.page-scroll` on scroll area), `border-separate` for per-cell border-radius support

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
    src/components/page/ (TopNavBar, DatabaseTitle, ViewTabsToolbar, JiraImportModal, MoveToRoadmapSnackbar)
    src/components/sidebar/ (SidebarShell, SpaceMenu, AiSidekickPanel, SidePanel, AiBar, FilterPage, SectionHeader, SettingCell, FieldRow)
    src/components/table/ (index, DataTable, TableHeader, TableRow, CellRenderer)
    src/components/table/cells/ (TextCell, NumberCell, CurrencyCell, AvatarStackCell, StatusCell)
    src/components/kanban/ (index, KanbanBoard, KanbanColumn, KanbanCard)
    src/components/canvas/ (CanvasOverlay, CanvasPillButton, CanvasNavPanels, CanvasTableWidget)
    src/components/timeline/ (index, TimelinePlaceholder)
    src/lib/filterParser.ts
    src/App.tsx, main.tsx, index.css
docs/plans/
  2026-03-03-spaces-table-design.md
  2026-03-05-editable-title-design.md
  2026-03-06-tab-drag-reorder-design.md
```

---

## Next Steps

### Immediate — Brownfield creation flow (`feature-brownfield-creation`)

**Done:**
- Replaced Home sidebar "Spaces" `+` dropdown with MDS `DropdownMenu` (EPD WoW v2.2, Roadmap, Blueprint, Blank items; proper separators, `alignOffset={-16}`, active state on button, instant MDS Tooltip)
- Combined old two-step modal ("Create Space" + "Set up your Roadmap") into single "Name your roadmap space" modal
- MDS `Input` at `size="x-large"`, pre-filled "Project Galaxy"
- **Redesigned pill tags** (Figma review) — MDS icons (`IconTable`, `IconFileSpreadsheet`, Jira logo) + MDS `Checkbox` per pill; fully rounded checkboxes (CSS override on Stitches `borderRadius`); white bg in all states, border-only interaction (off: `#e9eaef` → hover `#d5d8de` → pressed `#c2c5cc`; on: `#4262FF` → hover `#3350e0` → pressed `#2b44c7`); 48px pill height, 1.5px border
- **Mutual exclusion on import pills** — only one import source (Jira/Tables/CSV) can be selected at a time; Insights pill remains independent
- **Section labels updated** — "Import records from" / "Enrich records with" (16px Noto Sans semibold)
- **Insights pill pre-selected** by default; resets to selected on modal close
- **Dynamic primary button** — "Create and import" when any import pill is checked, "Create" when none; "Cancel" button (was "Skip for now") closes modal without opening app
- **Close button** — MDS `IconButton` large with `IconCross`, positioned top-right
- **Buttons in content flow** — removed absolute positioning, buttons sit naturally in flex column
- **End-to-end import journey** — "Create and import" opens app with empty table state, then Jira import modal appears after 1.5s delay with smooth entrance animation (backdrop fade + modal slide-up/scale from 97%, expo-out easing)
- **Empty table state** — centered blank state with table icon, "No records yet" heading, "Add your first record to get started" subtext, MDS "Add record" button with plus icon
- **JiraImportModal extracted** to standalone component (`JiraImportModal.tsx`) — renders as overlay in App.tsx; "Import" loads data and dismisses; close/backdrop dismisses without loading data
- **Disabled auto-opens** — AI Sidekick sidebar no longer opens on app load; Insights modal removed from app open flow; share step skipped in import journey

**Next:**
- Design and build import step modals for Tables and CSV sources
- End-to-end test: dropdown → modal → empty state → import → populated table
- Wire "Enrich data" toggle to downstream behaviour

### Immediate — Promote to Roadmap flow (`flow-promote-to-roadmap`)

**Done:**
- Restored Jira ID column to backlog fields (was removed in PR #5 merge)
- `sampleData` and `roadmapData` converted from static imports to React state (`backlogData`/`roadmapItems`) in App.tsx for data mutation
- Expanded row context menu from 2 items to full Figma spec: Open in side panel, View comments, Move to roadmap (with separator), Add record above/below, Add sub-record, Duplicate, Delete — 9 items + 3 separators; inline SVG icons for `IconAddLineTop`, `IconAddLineBottom`, `IconFilledBottomBox` (not in MDS)
- "Move to roadmap" functional on backlog page only — removes row from backlog, adds to roadmap with `status: 'planning'`
- Selected row background changed to light blue `#F2F4FC` (was neutral `#F1F2F5`)
- `MoveToRoadmapSnackbar` component — dark pill matching Figma design, checkmark + "Record moved to roadmap" + "Open roadmap" action button, blue progress bar filling left-to-right over 6s, auto-dismiss with slide-down
- "Open roadmap" action triggers page transition: content fades out (150ms), switches to Roadmap timeline view
- `handleMoveToRoadmap` closes any open sidebar to prevent stale row detail from lingering
- Removed click-to-open-sidebar from table rows, kanban cards, and timeline — sidebar now opens only via "Open in side panel" in context menus
- **Kanban contextual toolbar** (`KanbanCardToolbar.tsx`) — click a card to select (3px blue outline with 4px gap), floating toolbar appears 16px above card; medium ghost IconButtons with 4px padding/spacing, no borders, shadow only; MDS Tooltips on each button; 5 actions: Open in side panel, Open comments, Move to roadmap (backlog only), Card color, More; toolbar entrance animation (fade+scale 150ms); click-outside deselects; tabs z-index lowers when card selected so toolbar renders above sticky headers
- **Timeline contextual toolbar** — same `KanbanCardToolbar` reused on timeline bars; click (not drag) selects bar with blue outline; white card color dot; "Move to roadmap" only on backlog page; `data-card-toolbar` attribute guards against event conflicts with pan/drag handlers
- **Timeline toolbar pointer event fix** — toolbar moved outside bar DOM tree (rendered as sibling in grid area, positioned via bar coordinates) to avoid pointer capture conflicts; removed `onPointerUp` stopPropagation from `KanbanCardToolbar` (was blocking React Aria's document-level `pointerup` listener, preventing `onPress` from completing); added deferred pointer capture with 3px drag threshold (captures only after movement, not on initial press) to cleanly separate click-to-select from drag-to-move
- **"Open roadmap" opens sidebar** — `handleOpenMovedRow` now sets `selectedRow` and `activeSidebar('row-detail')` after page transition, so the moved record's detail panel opens automatically on the roadmap timeline
- **Milestone line + diamond hidden** — dashed vertical line and diamond marker commented out (available for later); date number highlight on hover retained; date hover disabled when a timeline bar is selected
- **Ghost bar placement flow** — when an item is moved to roadmap and user clicks "Open roadmap", a ghost bar appears as the top row on the timeline; 50% opacity, dashed border, title only (no avatar/Jira logo), 7-day default length; bar follows cursor horizontally on hover with date tooltip; click to place commits position, converts to normal bar, and updates sidebar start/end date fields; `TimelinePlaceholder` now accepts `data` prop (was static import), plus `ghostRowId` and `onBarPlaced` callback; sidebar date fields show "—" placeholder before placement, real dates after
- **Sidebar date fields** — `timelineDates` prop (already existed but was never populated) now receives `{ startDate: '—', endDate: '—' }` on ghost flow entry, updated to real dates on placement

**In progress:**
- **Ghost bar click-to-place not working** — clicking to place the ghost bar doesn't commit the position; the click also closes the sidebar; likely the timeline root's `onPointerDown` handler is firing (deselects bar + starts pan), overriding the ghost hit zone's `onClick`
- **Ghost date tooltip clipped** — the date tooltip above the ghost bar is being clipped by the sticky day numbers header (`position: sticky, top: 108px, zIndex: 10`); tooltip needs higher z-index or to render above the sticky header layer

### Other immediate
- **Sync mode communication** — design how read-only vs two-way sync modes are communicated to users on canvas widgets (sync indicator, UI affordances, state differences)
- Canvas widget polish — resize widget, widget-to-widget navigation (clicking sync indicator scrolls/pans to linked widget)

### Recently completed
- **Jira import animation** (`flow-import-jira-pre-merge`) — staggered row-by-row import animation with accelerating ease-in curve (cubic `t³`); rows stream in over ~1.8s with slow start and rapid finish; table header fades in first, then rows cascade with subtle blue arrival wash; toast notification deferred until all rows have landed (600ms pause after last row); toast visibility extended to 4 seconds; cherry-picked Jira detail panel, TopNavBar share tooltip, JiraPanel and RowDetailPanel updates from main while preserving pill tooltips, Jira ID column, and timeline Jira logo approach
- **Jira integration** (`feature-jira`) — added jiraId field type with Jira logo + key in table cells and kanban card tags; Jira import modal polished (matching sample data titles, cleaner layout, status pills, "Import Jira issues" header, IconCog for settings); replaced MDS IconSocialJira with Figma asset logo on all timeline rows; tooltips on import/enrichment pills in creation modal; description tags filtered from kanban cards; 8/10 issues pre-selected for demo flow
- **Visual fixes** (`improvement-visual-fixes`) — tightened spacing between drag handle and comment button on table rows; row hover/selection highlight end caps aligned with divider insets (left cap starts at 56px, right cap rounds last data cell via `:has(+ td.table-fill)`); removed unused `row-drag` element and CSS; narrowed description column to 320px (⅔ title width) with ellipsis truncation; breadcrumb nudged 2px right; view settings sidebar disabled; title cells and kanban card titles changed from semibold to regular weight; kanban card titles wrap up to 3 lines before truncating
- **Sticky headers & scroll improvements** (`improvement-sticky-headers`) — table header sticks below tabs; kanban column headers stick with gap coverage; timeline date headers stick below tabs; DatabaseTitle fades instead of scaling; kanban columns stretch to equal height; horizontal scroll only moves content (tabs/title pinned via `sticky left-0`); timeline integrated into main page scroll with `parentScrollRef` for drag-to-pan; space menu button click propagation fixed
- **Brownfield creation flow** — see above
- **Sync indicator animation fix** — the sync indicator icon button was jumping vertically when the pulse animation fired. Root cause: `translate-y-1` (Tailwind transform) was overridden by the `sync-in` keyframe animation's `transform: scale(...)`, and when `sync-pulse` replaced the animation property, the translateY snapped back. Fix: (1) swapped `translate-y-1` → `mt-[6px]` so vertical offset uses margin instead of transform, (2) separated entrance and pulse onto different elements (outer div for `sync-in`, inner span for `sync-pulse`) so removing the pulse class doesn't re-trigger the entrance animation, (3) extended `syncShimmering` timeout from 3.5s → 4.8s so all 3 pulse iterations complete (500ms delay + 3 × 1.4s = 4.7s)

### Backlog — Tab Bar
- **Tab reorder on tab bar** — inline drag on the tab bar itself still blocked by Radix `Tabs.Trigger` intercepting pointer events; reordering is now available via the overflow menu's drag-to-reorder; visual reorder on the bar itself is a future enhancement. See `docs/plans/2026-03-06-tab-drag-reorder-design.md` for decision log.

### Backlog — Table Interactions
- **Column resizing** — drag column edges to resize, persist widths
- **Inline cell editing** — click to edit text/number/currency cells in place
- **Sort interaction** — click column headers to sort ascending/descending with indicator arrow
- **Filter integration** — connect sidebar filter panel to table data (shared filter state)
- ~~**Empty state**~~ — done (blank state in DataTable with "No records yet" message + Add record CTA)
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

- **Repo:** [mike-walk/table-views](https://github.com/mike-walk/table-views)
- **Main branch:** `master`
- **Canvas exploration:** `canvas-interactions`
