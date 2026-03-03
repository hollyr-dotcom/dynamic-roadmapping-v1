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

Full-screen data table page.

### Components

| File | Description |
|------|-------------|
| `src/components/TopNavBar.tsx` | Menu, Miro logo, breadcrumb, presence avatars, notifications, AI sidekick |
| `src/components/DatabaseTitle.tsx` | Editable title with three-dot context menu (Rename, Duplicate, Delete) |
| `src/components/ViewTabsToolbar.tsx` | Tabs (All items / Prioritization), search, settings, "New" dropdown |
| `src/components/DataTable.tsx` | Sticky-header table with row numbers and cell formatters |
| `src/components/cells/TextCell.tsx` | Text cell (bold primary, regular secondary) |
| `src/components/cells/NumberCell.tsx` | Number cell with locale formatting |
| `src/components/cells/CurrencyCell.tsx` | Currency cell ($NNK format) |
| `src/components/cells/AvatarStackCell.tsx` | Overlapping avatar initials with overflow count |

### Features

- Top nav bar with hamburger, Miro logo, breadcrumb, 3 presence avatars (+4 overflow), notifications badge (3), AI sidekick gradient button
- Click-to-edit database title, three-dot menu with Rename/Duplicate/Delete
- MDS Tabs (All items / Prioritization), search + settings icon buttons, "New" dropdown (Text, Number, Status, Person, Date)
- Data table: 18 rows from shared sample data, sticky header, 56px row height, hover highlight
- 4 cell formatters: text (bold primary), number (locale), currency ($NK/dash), avatar stack (3 visible + overflow)
- Thin scrollbar styling

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
    src/components/ (TopNavBar, DatabaseTitle, ViewTabsToolbar, DataTable)
    src/components/cells/ (TextCell, NumberCell, CurrencyCell, AvatarStackCell)
    src/App.tsx, main.tsx, index.css
docs/plans/
  2026-03-03-spaces-table-design.md
```

---

## GitHub

- **Repo:** [mikefrommiro/table-views](https://github.com/mikefrommiro/table-views)
- **Branch:** `master`
