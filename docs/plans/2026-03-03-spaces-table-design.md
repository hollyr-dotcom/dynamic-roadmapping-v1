# Spaces Table — Design Doc

**Date:** 2026-03-03
**Reference:** [Figma](https://www.figma.com/design/PMIoPYBmCns4BQJ1MtzSfa/StratPack-v1--Roadmaps?node-id=1481-29905)

## What We're Building

A full-screen data table page — the primary view for a Miro Spaces database. Sits alongside the existing sidebar prototype in a Bun workspace monorepo with a shared data model. The table and sidebar are driven by the same field definitions, so changing columns automatically updates sidebar settings, filters, and sort options.

## Project Structure

Bun workspace monorepo with three packages:

```
packages/
  shared/         ← shared data model, types, field definitions, sample data
  sidebar/        ← existing sidebar project (moved from root)
  spaces-table/   ← new full-screen table page
```

Each package has its own Vite dev server and `package.json`. MDS is installed once at the root. The `shared` package exports field definitions, filter types, and sample data consumed by both apps.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v3
- `@mirohq/design-system` (Tabs, IconButton, Button, DropdownMenu, Badge, icons)
- Roobert PRO (headings) + Noto Sans (body)

## Page Layout

Full viewport, white background. Four vertical zones stacked top to bottom:

1. **Top nav bar** (~64px)
2. **Database title** row
3. **View tabs + toolbar** row
4. **Data table** (fills remaining height, scrolls)

---

## 1. Top Navigation Bar

Full-width, white background, 16–24px horizontal padding. Everything vertically centered.

**Left side:**
- Hamburger menu icon button (`IconLinesThreeHorizontal`) — toggles left sidebar nav (content out of scope)
- Miro logotype
- Breadcrumb separator (`/`)
- Page name text (e.g. "Project Galaxy")

**Right side:**
- Presence avatars — 2–3 overlapping circles with photos, `+N` overflow indicator
- Bell icon button (`IconBell`) with MDS `Badge` (notification count)
- AI Sidekick button — gradient circle with `IconSparksFilled` (toggles right panel, content out of scope)

## 2. Database Title

Left-aligned below the nav bar.

- **Editable title** — 24–28px, Roobert PRO SemiBold. Renders as plain text, becomes an input on click. Enter or blur saves.
- **Three-dot icon button** — ghost variant, immediately right of title. Opens MDS `DropdownMenu` with placeholder actions (Rename, Duplicate, Delete).

## 3. View Tabs & Toolbar

Single horizontal row below the title. Two zones separated by flexible space.

**Left — View tabs:**
- MDS `Tabs`, `variant="tabs"`, `size="medium"`
- Two tabs: "All items" (table view, active default), "Prioritization" (kanban, future)
- Static — no add/rename/reorder

**Right — Toolbar:**
- Search icon button (ghost) — toggle only, no search input
- View settings icon button (filter/sliders icon) — opens the sidebar
- "New" button (MDS `Button`, primary, small, with chevron) — `DropdownMenu` with field type options: Text, Number, Status, Person, Date

White space separates this row from the table below (no border).

## 4. Data Table

Fills remaining viewport height. Scrolls vertically and horizontally, edge to edge.

**Columns:**

| Column | Field type | Formatting |
|--------|-----------|------------|
| Row # | (implicit) | Narrow, muted, non-sortable |
| Title | text | Wide, 16px semibold, primary field |
| Mentions | number | Right-aligned or left-aligned number |
| Customers | number | Plain number |
| Est. revenue | currency | `$` prefix, `K` suffix |
| Companies | avatars | 2–3 small avatar icons + `+N` overflow |

**Styling:**
- Horizontal row dividers only, no vertical grid lines, no zebra striping
- Header row: small muted text (12–13px, semibold), sticky on vertical scroll
- Data rows: 56px height
- Hover: subtle background tint on full row

**Scrolling:**
- Vertical: body scrolls, header sticky
- Horizontal: all columns scroll together, edge to edge (no frozen columns)

**Sample data:** ~15–20 rows of realistic product feature requests.

## 5. Shared Data Model (`packages/shared/`)

Single field definitions array drives everything:

```ts
type FieldType = "text" | "number" | "currency" | "avatars" | "status" | "person" | "date"

interface FieldDefinition {
  id: string
  label: string
  type: FieldType
  isPrimary?: boolean
}

const fields: FieldDefinition[] = [
  { id: "title",       label: "Title",        type: "text",     isPrimary: true },
  { id: "mentions",    label: "Mentions",      type: "number"   },
  { id: "customers",   label: "Customers",     type: "number"   },
  { id: "estRevenue",  label: "Est. revenue",  type: "currency" },
  { id: "companies",   label: "Companies",     type: "avatars"  },
]
```

**Consumers:**
- **Table** — renders column headers and determines cell formatting
- **Sidebar** — populates Fields section, filter dropdowns, sort options
- **Filter logic** — uses field types for available operators (contains for text, greater than for numbers, etc.)

## Out of Scope

- Left sidebar nav content (hamburger toggles only)
- AI Sidekick panel content (button toggles only)
- Kanban view ("Prioritization" tab present but not built)
- Column resizing, reordering, or sorting interactions
- Row selection or inline editing
- Search input/filtering
- Wiring sidebar to shared data model (shared package is set up and ready; wiring is a follow-up)
