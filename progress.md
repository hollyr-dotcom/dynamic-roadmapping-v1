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
| `DatabaseTitle.tsx` | Always-input editable title (32px Roobert), 48px top spacing; sticky left-0 (pinned horizontally, scrolls vertically); 3 CSS-driven states (idle/hover/focused) matching Figma `.Editable Title`; auto-sizing via hidden measuring span; opacity fades out on scroll; updates per page; **three-dots menu** beside title — hover-to-reveal with fade+scale animation (`group/title`), stays visible while dropdown is open (`menuOpen` state via `onOpen`/`onClose`), hidden when title input is focused; baseline-aligned via `self-end mb-1` |
| `ViewTabsToolbar.tsx` | Dynamic tabs from `TabConfig[]` prop with **searchable tab overflow popover** (MDS Popover + InputSearch replacing DropdownMenu; auto-focused search input with suppressed focus ring, "Find a view" placeholder, clearable; 16px icons, 36px items with 8px padding matching DropdownMenu.Item spec; 12px container padding; active tab highlighted blue; "No views found" empty state; query resets on close), **right-click context menu** (Rename/Duplicate/Delete with MDS icons), **"New View" dropdown** (+ button with `icon-neutrals-subtle`, appears on toolbar hover with fade+scale animation, stays visible while menu is open), and **inline tab renaming** (double-click active tab to edit, blur/Enter saves, Escape cancels, tab grows to fit text); **right-side action buttons** — search, AI sidekick, settings, new column (all medium/32px ghost) with **MDS Tooltips + Hotkey badges** (Search ⌘F, AI Sidekick ⌘K, View settings ⌘,, New column +); new column dropdown is controlled (`newColumnMenuOpen` prop from App.tsx); sticky top-0 left-0 z-20 within scroll area; exports `SidebarId`, `TabConfig`, `ViewType`, and `MENU_WIDTH` |

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

### Canvas Module (`src/components/canvas/`)

| File | Description |
|------|-------------|
| `CanvasOverlay.tsx` | Full-viewport overlay with Miro dot grid background (`#F2F2F2` base, `#D5D8DE` 1px dots at 24px spacing via CSS `radial-gradient`); always in DOM, visibility controlled via opacity + pointer-events for smooth CSS transitions; `position: fixed; inset: 0; z-index: 60` |
| `CanvasPillButton.tsx` | Floating pill button (MDS `Button` with `rounded` + `ghost` variant) — centered within the toolbar area via `fixed` positioning with dynamic `left`/`right` values matching sidebar widths; two visual states: **table mode** (`#F1F2F5` bg, `IconArrowsInSimple`, "Go to canvas") and **canvas mode** (white bg + shadow, `IconArrowsOutSimple`, "Go to {pageTitle}"); hover-to-reveal in table mode (visible when hovering nav/title/tabs area or the pill itself), always visible on canvas; `onHoverChange` callback prevents flicker when cursor moves between nav and pill; `z-index: 110` above all other layers |
| `CanvasNavPanels.tsx` | Two floating white panels on canvas — **left** (menu + breadcrumb, `pl-2 pr-4`) and **right** (bell + avatars + Share, `px-2`); 40px tall (navbar 56px − 16px), positioned 8px from top and left/right edges (`rounded-lg`, subtle shadow `0 2px 8px rgba(0,0,0,0.08)`); content vertically aligns with navbar elements so no visual movement during transition; fade in/out with canvas overlay |
| `CanvasTableWidget.tsx` | Floating table widget on canvas — renders DatabaseTitle + ViewTabsToolbar + active view (table/kanban/timeline) as a second copy sharing App.tsx state; white bg, 12px rounded corners, `0 2px 4px 0 rgba(34,36,40,0.08)` shadow, `32px 40px 40px` padding; `position: fixed`, horizontally centered via `translateX(-50%)`, `top: 128px`, `z-index: 70` (between dot grid z-60 and nav panels z-100); fades in from `scale(0.96)` with 500ms expo-out easing; `overflow: hidden` clips content to rounded corners; `.canvas-widget-view` CSS class zeroes out built-in `pl-14` page gutters and realigns row divider pseudo-elements; `variant="widget"` prop on DatabaseTitle (removes top/side padding) and ViewTabsToolbar (tighter padding) |

### Timeline Module (`src/components/timeline/`)

| File | Description |
|------|-------------|
| `index.ts` | Barrel export — single public surface (`TimelinePlaceholder`) |
| `TimelinePlaceholder.tsx` | Centered empty state — icon, "Timeline view" heading (Roobert), description (Noto Sans), `item-enter` animation |

### Pages & Views

#### Backlog Page (default)
- **3 tabs** — All items, Kanban, Timeline
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
- **Sidebar slots** — `shrink-0 overflow-hidden` wrappers with `transition-[width]` (300ms, `cubic-bezier(0.16, 1, 0.3, 1)`); all sidebars animate 0 → 320px
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
- **Canvas mode** — full-screen infinite canvas with Miro dot grid background; toggled via "Go to canvas" pill button; **full-viewport takeover** hides nav, sidebars, and all table content; smooth 500ms transition (app layout scales to 0.92 + fades out, canvas fades in) using `cubic-bezier(0.16, 1, 0.3, 1)` expo-out easing; sidebars force-closed on canvas open; Escape key closes canvas; **floating nav panels** on canvas replicate left (menu + breadcrumb) and right (bell + avatars + Share) nav sections as white rounded panels at 8px from edges; **hover-to-reveal pill** in table mode — button appears when hovering anywhere above the table (nav bar, database title, or tabs toolbar); `canvasOpen` boolean state in App.tsx; **table widget on canvas** — full table (title, tabs, active view) rendered as a floating widget with white bg, 12px rounded corners, subtle shadow, 32/40px padding; horizontally centered at `top: 128px`; shares state with App.tsx so tab switching and title editing work on canvas; `.canvas-widget-view` CSS zeroes out page gutters for even side padding; `variant="widget"` prop on DatabaseTitle and ViewTabsToolbar for compact layout
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
    src/components/page/ (TopNavBar, DatabaseTitle, ViewTabsToolbar)
    src/components/sidebar/ (SidebarShell, SpaceMenu, AiSidekickPanel, SidePanel, AiBar, FilterPage, SectionHeader, SettingCell, FieldRow)
    src/components/table/ (index, DataTable, TableHeader, TableRow, CellRenderer)
    src/components/table/cells/ (TextCell, NumberCell, CurrencyCell, AvatarStackCell, StatusCell)
    src/components/kanban/ (index, KanbanBoard, KanbanColumn, KanbanCard)
    src/components/canvas/ (CanvasOverlay, CanvasPillButton, CanvasNavPanels)
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

### Immediate
- Canvas widget polish — drag/pan on canvas, resize widget, zoom transitions

### Backlog — Tab Bar
- **Tab reorder on tab bar** — inline drag on the tab bar itself still blocked by Radix `Tabs.Trigger` intercepting pointer events; reordering is now available via the overflow menu's drag-to-reorder; visual reorder on the bar itself is a future enhancement. See `docs/plans/2026-03-06-tab-drag-reorder-design.md` for decision log.

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

- **Repo:** [mike-walk/table-views](https://github.com/mike-walk/table-views)
- **Main branch:** `master`
- **Canvas exploration:** `canvas-interactions`
