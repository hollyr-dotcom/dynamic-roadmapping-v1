# Searchable Overflow Menu

## Problem

The tab overflow chevron dropdown is a flat list of menu items. With many views (10+, up to 100), finding a specific view becomes tedious. Adding a text filter makes the overflow menu scalable.

## Approach

Replace the overflow `DropdownMenu` with an MDS `Popover` containing an `InputSearch` and a custom scrollable list. The Popover gives full control over focus (input auto-focuses on open) without fighting DropdownMenu's focus trapping. Custom list items replicate DropdownMenu.Item visuals and are extensible for future per-view actions.

## Design

### Trigger

Same chevron `IconButton` as today, same position after last visible tab. Same styling:
- Active tab in overflow: blue bg `#F2F4FC`, blue icon `#2B4DF8`
- Menu open (no active in overflow): neutral bg `#F1F2F5`

### Popover

- MDS `Popover`, `variant="light"`, `anchor="none"`, `side="bottom"`, `align="start"`
- Controlled open/close state
- Hidden `Popover.Close` (dismiss via click-outside or Escape)
- Width: `MENU_WIDTH` (220px)

### Content layout

1. **InputSearch** (MDS) — `size="medium"`, `placeholder="Search views..."`, `clearable`. Pinned at top. Auto-focused on open via `onOpenAutoFocus`. Case-insensitive substring filter.

2. **Scrollable list** — `max-height: 320px`, `overflow-y: auto`, thin scrollbar. Each item:
   - 36px height, 8px horizontal padding, 4px border-radius
   - View type icon (Table/Kanban/Timeline) on left, subtle gray
   - Label: 14px Noto Sans regular, `#222428`
   - Hover: `#F1F2F5` background
   - Active tab: `#F2F4FC` bg, `#2B4DF8` text + icon
   - Click selects view and closes popover

3. **Empty state** — "No views found", 14px Noto Sans, `#7D8297`, centered, 32px vertical padding

### Behaviour

- Open popover -> focus lands on InputSearch
- Type to filter list (instant, no debounce)
- Click item -> `onTabChange(tab.id)` + close
- Escape or click-outside -> close + reset search query
- Search query resets on each open

## Implementation

Single file change: `ViewTabsToolbar.tsx`. Replace the overflow `DropdownMenu` block (lines ~219-257) with a `Popover`-based component. Add `InputSearch` and `Popover` to MDS imports.

### Steps

1. Add `Popover` and `InputSearch` to MDS imports
2. Add `overflowSearch` state (string) and a ref for the search input
3. Replace overflow DropdownMenu with Popover:
   - Popover.Trigger wraps the same IconButton
   - Popover.Content contains InputSearch + filtered list + empty state
   - onOpenAutoFocus focuses the search input
   - onClose resets search query
4. Build custom list items matching DropdownMenu.Item visuals (36px, icon + label, hover/active states)
5. Filter overflowTabs by search query (case-insensitive includes)
6. Show "No views found" when filtered list is empty
