# AI Bar — Filter Commands Design

**Date:** 2026-02-27

## Overview

Make the AI prompt bar functional for filter management. Users type natural language commands; a pattern-matching parser translates them into mutations on the `filterConditions` state in `SidePanel`. No LLM API — all matching is deterministic template-based parsing.

---

## Example Prompts

Six prompts covering all three operations:

| Prompt | Operation | Result |
|--------|-----------|--------|
| "Show only In Progress items" | Create | Status **is** In Progress |
| "Filter where title contains 'bug'" | Create | Title **contains** bug |
| "Only show items with no description" | Create | Description **is empty** |
| "Change the status filter to Done" | Edit | Updates existing Status filter value to Done |
| "Remove the status filter" | Delete | Removes all Status conditions |
| "Clear all filters" | Delete | Empties all conditions |

---

## Parser Templates

Matching is case-insensitive throughout.

### Create

| Template | Condition produced |
|----------|--------------------|
| `show only {status} items` | `{ field: 'Status', operator: 'is', value: statusValue }` |
| `filter where {field} contains {text}` | `{ field, operator: 'contains', value: text }` |
| `only show items with no {field}` | `{ field, operator: 'is empty', value: '' }` |

### Edit

| Template | Mutation |
|----------|----------|
| `change the status filter to {status}` | Finds first Status condition and patches `value`; creates one if none exists |

### Delete

| Template | Mutation |
|----------|----------|
| `remove the {field} filter` | Removes all conditions where `field` matches |
| `delete the {field} filter` | Same as above |
| `clear all filters` | Sets conditions to `[]` |
| `remove all filters` | Sets conditions to `[]` |
| `delete all filters` | Sets conditions to `[]` |

### Recognised values

- **Status values:** `todo`, `in progress`, `done`
- **Fields:** `status`, `title`, `description`, `person`

---

## Architecture

### New file: `src/lib/filterParser.ts`

Exports a single function:

```ts
parseFilterCommand(
  input: string,
  current: FilterCondition[]
): FilterCondition[] | null
```

- Returns `null` if no template matches (no state change)
- Returns the new `FilterCondition[]` if matched

### `AiBar` — new optional prop

```ts
onSubmit?: (value: string) => boolean
```

- Called with the input text when the user submits
- `true` = command recognised (or prototype always succeeds)
- If prop is omitted, existing behaviour is unchanged

### `SidePanel` wiring

1. Import `parseFilterCommand`
2. Pass `onSubmit` handler to `<AiBar>`
3. Handler calls `parseFilterCommand(value, filterConditions)`
4. If result is non-null: `setFilterConditions(result)`, navigate to Filter page if not already there
5. Returns `true` regardless (always animate to success)

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/filterParser.ts` | New — parser logic |
| `src/components/AiBar.tsx` | Add optional `onSubmit` prop |
| `src/components/SidePanel.tsx` | Wire parser + auto-navigate to Filter page |
