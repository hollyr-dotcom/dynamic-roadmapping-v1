# Filter Page — Design Doc

**Date:** 2026-02-27
**Status:** Approved

---

## Context

The roadmap settings panel already has in-panel navigation: clicking a view-setting row pushes a detail page. The Filter row currently navigates to a blank page. This design fills that page with a functional mid-fidelity filter UI.

---

## Goal

A working filter condition builder: add, edit, duplicate, and delete conditions. State persists when navigating back to the list view.

---

## UI Structure

### Page layout

Follows the existing detail-page pattern:
- Back button (`← View settings`) + FlexAI/Backlog header (always visible)
- Scrollable content area (same `px-4 pt-16 pb-28` padding)
- Floating AI bar (`"How can I filter this view?"`)

Content below the header:
1. Condition list (empty state or one card per condition)
2. "Add filter" button — always visible at the bottom of the list

---

### Condition card

Two lines per card, reading natural language order:

```
Line 1:  [Field ▾]  [Operator ▾]  [··· menu]
Line 2:  [Value control]            (hidden for "is empty" / "is not empty")
```

Example: *Status · is · ···* / *Todo*

**Field dropdown** — MDS `DropdownMenu` with `RadioGroup`:
- Status
- Person
- Title
- Description

**Operator dropdown** — MDS `DropdownMenu` with `RadioGroup`, options depend on field:

| Field | Operators |
|---|---|
| Status | is, is not |
| Person | is, is not, is empty, is not empty |
| Title | contains, does not contain, is empty, is not empty |
| Description | contains, does not contain, is empty, is not empty |

**Value control** — shown when operator is not "is empty" / "is not empty":
- Status → MDS `DropdownMenu` (`RadioGroup`): Todo, In Progress, Done
- Person / Title / Description → plain `<input type="text">` styled to match MDS inputs

**··· button** — MDS `DropdownMenu` positioned at end of line 1:
- Duplicate
- Delete

---

### Empty state

When `conditions.length === 0`:

```
[centered]
No filters applied
[Add filter button]
```

---

## Data Model

```ts
type FilterField = 'Status' | 'Person' | 'Title' | 'Description'

type FilterCondition = {
  id: string        // crypto.randomUUID()
  field: FilterField
  operator: string  // validated against OPERATORS[field]
  value: string     // empty string when operator needs no value
}
```

Operators map:

```ts
const OPERATORS: Record<FilterField, string[]> = {
  Status:      ['is', 'is not'],
  Person:      ['is', 'is not', 'is empty', 'is not empty'],
  Title:       ['contains', 'does not contain', 'is empty', 'is not empty'],
  Description: ['contains', 'does not contain', 'is empty', 'is not empty'],
}
```

Default condition added by "Add filter": `{ field: 'Status', operator: 'is', value: '' }`

---

## State Management

Filter conditions are lifted to `SidePanel` state so they persist across navigation:

```ts
const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([])
```

`FilterPage` receives:
- `conditions: FilterCondition[]`
- `onAdd: () => void`
- `onChange: (id: string, patch: Partial<FilterCondition>) => void`
- `onDuplicate: (id: string) => void`
- `onDelete: (id: string) => void`

When a field changes, the operator resets to the first valid operator for that field, and value resets to `''`.

---

## Files

| File | Change |
|---|---|
| `src/components/FilterPage.tsx` | New component |
| `src/components/SidePanel.tsx` | Add `filterConditions` state + render `<FilterPage>` when `activePage.name === 'Filter'` |

---

## Out of Scope

- Multi-value selection (e.g. "Status is any of [Todo, In Progress]")
- AND / OR grouping logic
- Persisting filters outside React state
- Keyboard navigation within the filter page
