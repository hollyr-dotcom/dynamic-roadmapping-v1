# Roadmap Settings Sidebar — Design Doc

**Date:** 2026-02-26
**Reference:** [Figma](https://www.figma.com/design/WvjlAkugJjBIvhhExX5ZYA/Roadmap-Space?node-id=11-5091)

## What We're Building

A static prototype of Miro's roadmap settings right-sidebar. It opens when a settings button is pressed. It contains view settings (Layout, Filter, Sort, Columns, Swimlanes) and database field definitions (Title, Description, Status, Person). An AI prompt bar is pinned to the bottom of the panel.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v3
- Lucide React (icon substitutes for `@mirohq/design-system`)
- Google Fonts: Noto Sans (body), Inter (headings — substitute for Roobert PRO)

## Canvas (App)

- Full viewport, background `#F2F2F2`
- Dot grid overlay: CSS `radial-gradient` with `#D8D8D8` dots (~1px), 20px spacing
- Panel fixed: `top-2 right-2 bottom-2` (8px inset on three sides)
- Panel height: `calc(100vh - 16px)`

## Panel (SidePanel)

- White background, `rounded-xl` (12px), large drop shadow
- Width: ~400px fixed
- Close button (X): absolute top-right, ghost icon button
- Header: workspace name "FlexAI" in muted blue-gray (14px semibold), board name "Backlog" (20px semibold)
- Two sections: View settings, Fields
- AI bar: pinned to bottom of panel, pill shape, `#F7F7F7` bg, "How can I help set up this view?" placeholder + Miro icon

## Components

### SectionHeader
- Bold label (14px semibold, `#222428`)
- Optional action buttons: `+` (add) and `⋮` (more) — shown only in Fields section
- 40px tall, full width

### SettingCell
Props: `icon`, `label`, `subtitle`, `iconBg` (`"green" | "blue" | "gray"`)

- 16px padding all sides
- Icon: 32px square, `rounded-lg`, colored bg (`#0FA83C` green, `#3859FF` blue, `#F1F2F5` gray)
- Icon itself: 24px, white (on colored) or dark (on gray)
- Title: 16px semibold
- Subtitle: 12px regular, muted

### FieldRow
Props: `icon`, `label`, `isPrimary?`

- `pl-4 pr-2 py-4` padding
- Icon: 40px square, `rounded-lg`, `#F1F2F5` gray bg
- Title: 16px semibold
- Optional "Primary field" badge: 12px, muted color below title
- Trailing icons: pen (edit) + dots-six-vertical (drag handle), `opacity-0` (hover state deferred)

## Static Data (defined in SidePanel)

```ts
viewSettings = [
  { label: "Layout",    subtitle: "Kanban",                  iconBg: "green", icon: LayoutGrid },
  { label: "Filter",    subtitle: "24 of 48 items showing",  iconBg: "blue",  icon: Filter },
  { label: "Sort",      subtitle: "Sorted by Priority",      iconBg: "blue",  icon: ArrowDownUp },
  { label: "Columns",   subtitle: "Grouped by Status",       iconBg: "blue",  icon: Columns2 },
  { label: "Swimlanes", subtitle: "Add a group",             iconBg: "gray",  icon: Rows3 },
]

fields = [
  { label: "Title",       icon: Type,        isPrimary: true },
  { label: "Description", icon: AlignLeft,   isPrimary: false },
  { label: "Status",      icon: CheckCircle, isPrimary: false },
  { label: "Person",      icon: User,        isPrimary: false },
]
```

## Out of Scope (static prototype)

- Panel open/close animation
- Drag-to-reorder fields
- Filter/sort/layout sub-panels
- Real data
