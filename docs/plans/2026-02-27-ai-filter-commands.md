# AI Filter Commands Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire the AI prompt bar to parse natural language filter commands and mutate filter state in real time.

**Architecture:** A pure `filterParser.ts` module exports one function that maps a string + current conditions to a new conditions array (or null if unrecognised). AiBar gains an optional `onSubmit` prop. SidePanel wires them together and auto-navigates to the Filter page on success.

**Tech Stack:** React 19, TypeScript, Vite, Vitest (added in Task 1)

---

### Task 1: Add Vitest

No test runner exists yet. Vitest integrates with Vite with minimal config.

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/lib/filterParser.test.ts` (empty placeholder)

**Step 1: Install vitest**

Run:
```bash
npm install --save-dev vitest
```
Expected: vitest appears in `devDependencies`

**Step 2: Add test script to package.json**

In `package.json` scripts, add:
```json
"test": "vitest run"
```

**Step 3: Add test config to vite.config.ts**

Read the file first, then add a `test` block. The file likely looks like:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Change it to:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
```

**Step 4: Create the lib directory and empty test file**

```bash
mkdir -p src/lib
touch src/lib/filterParser.test.ts
```

**Step 5: Run tests to confirm zero tests pass**

Run: `npm test`
Expected: `No test files found` or `0 tests passed` — no errors

**Step 6: Commit**

```bash
git add package.json vite.config.ts src/lib/filterParser.test.ts
git commit -m "feat: add vitest"
```

---

### Task 2: Write failing tests for filterParser

Write all tests before any implementation. The parser takes `(input: string, current: FilterCondition[])` and returns `FilterCondition[] | null`.

**Files:**
- Modify: `src/lib/filterParser.test.ts`

**Step 1: Write the tests**

```ts
import { describe, it, expect } from 'vitest'
import { parseFilterCommand } from './filterParser'
import type { FilterCondition } from '../components/FilterPage'

const empty: FilterCondition[] = []

function cond(field: FilterCondition['field'], operator: string, value: string): FilterCondition {
  return { id: 'test-id', field, operator, value }
}

describe('parseFilterCommand', () => {

  // ── CREATE ──────────────────────────────────────────────
  it('creates a Status is filter from "show only in progress items"', () => {
    const result = parseFilterCommand('show only in progress items', empty)
    expect(result).toHaveLength(1)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'In Progress' })
  })

  it('creates a Status is filter from "Show only Todo items"', () => {
    const result = parseFilterCommand('Show only Todo items', empty)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'Todo' })
  })

  it('creates a Status is filter from "show only done items"', () => {
    const result = parseFilterCommand('show only done items', empty)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'Done' })
  })

  it('creates a Title contains filter', () => {
    const result = parseFilterCommand("filter where title contains 'bug'", empty)
    expect(result![0]).toMatchObject({ field: 'Title', operator: 'contains', value: 'bug' })
  })

  it('strips quotes from contains value', () => {
    const result = parseFilterCommand('filter where title contains "feature"', empty)
    expect(result![0]).toMatchObject({ field: 'Title', operator: 'contains', value: 'feature' })
  })

  it('works without quotes on contains value', () => {
    const result = parseFilterCommand('filter where description contains sprint', empty)
    expect(result![0]).toMatchObject({ field: 'Description', operator: 'contains', value: 'sprint' })
  })

  it('creates a Description is empty filter', () => {
    const result = parseFilterCommand('only show items with no description', empty)
    expect(result![0]).toMatchObject({ field: 'Description', operator: 'is empty', value: '' })
  })

  it('creates a Title is empty filter', () => {
    const result = parseFilterCommand('only show items with no title', empty)
    expect(result![0]).toMatchObject({ field: 'Title', operator: 'is empty', value: '' })
  })

  it('appends a new filter to existing ones', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('filter where title contains bug', existing)
    expect(result).toHaveLength(2)
  })

  // ── EDIT ────────────────────────────────────────────────
  it('edits existing status filter value', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('change the status filter to Done', existing)
    expect(result).toHaveLength(1)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'Done' })
  })

  it('creates status filter if none exists when editing', () => {
    const result = parseFilterCommand('change the status filter to In Progress', empty)
    expect(result).toHaveLength(1)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'In Progress' })
  })

  // ── DELETE ──────────────────────────────────────────────
  it('removes status filter with "remove the status filter"', () => {
    const existing = [cond('Status', 'is', 'Todo'), cond('Title', 'contains', 'bug')]
    const result = parseFilterCommand('remove the status filter', existing)
    expect(result).toHaveLength(1)
    expect(result![0].field).toBe('Title')
  })

  it('removes status filter with "delete the status filter"', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('delete the status filter', existing)
    expect(result).toHaveLength(0)
  })

  it('clears all with "clear all filters"', () => {
    const existing = [cond('Status', 'is', 'Todo'), cond('Title', 'contains', 'bug')]
    const result = parseFilterCommand('clear all filters', existing)
    expect(result).toHaveLength(0)
  })

  it('clears all with "remove all filters"', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('remove all filters', existing)
    expect(result).toHaveLength(0)
  })

  it('clears all with "delete all filters"', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('delete all filters', existing)
    expect(result).toHaveLength(0)
  })

  // ── UNRECOGNISED ─────────────────────────────────────────
  it('returns null for unrecognised input', () => {
    expect(parseFilterCommand('hello', empty)).toBeNull()
    expect(parseFilterCommand('what is the status', empty)).toBeNull()
  })

})
```

**Step 2: Run tests — confirm they all fail**

Run: `npm test`
Expected: all tests FAIL with `Cannot find module './filterParser'`

**Step 3: Commit the failing tests**

```bash
git add src/lib/filterParser.test.ts
git commit -m "test: add failing tests for filterParser"
```

---

### Task 3: Implement filterParser

**Files:**
- Create: `src/lib/filterParser.ts`

**Step 1: Create the file**

```ts
import type { FilterCondition } from '../components/FilterPage'

const STATUS_MAP: Record<string, string> = {
  'todo':        'Todo',
  'in progress': 'In Progress',
  'done':        'Done',
}

const FIELD_MAP: Record<string, FilterCondition['field']> = {
  'status':      'Status',
  'title':       'Title',
  'description': 'Description',
  'person':      'Person',
}

function newCond(field: FilterCondition['field'], operator: string, value: string): FilterCondition {
  return { id: crypto.randomUUID(), field, operator, value }
}

export function parseFilterCommand(
  input: string,
  current: FilterCondition[]
): FilterCondition[] | null {
  const s = input.trim().toLowerCase()

  // ── CLEAR ALL ──────────────────────────────────────────
  if (
    s === 'clear all filters' ||
    s === 'remove all filters' ||
    s === 'delete all filters'
  ) {
    return []
  }

  // ── DELETE FIELD FILTER ────────────────────────────────
  // "remove the {field} filter" | "delete the {field} filter"
  const deleteMatch = s.match(/^(?:remove|delete) the (\w+) filter$/)
  if (deleteMatch) {
    const field = FIELD_MAP[deleteMatch[1]]
    if (field) return current.filter((c) => c.field !== field)
  }

  // ── EDIT STATUS FILTER ─────────────────────────────────
  // "change the status filter to {status}"
  const editMatch = s.match(/^change the status filter to (.+)$/)
  if (editMatch) {
    const statusValue = STATUS_MAP[editMatch[1].trim()]
    if (statusValue) {
      const existingIdx = current.findIndex((c) => c.field === 'Status')
      if (existingIdx !== -1) {
        const updated = [...current]
        updated[existingIdx] = { ...updated[existingIdx], value: statusValue }
        return updated
      }
      return [...current, newCond('Status', 'is', statusValue)]
    }
  }

  // ── CREATE: show only {status} items ──────────────────
  const showOnlyMatch = s.match(/^show only (.+?) items?$/)
  if (showOnlyMatch) {
    const statusValue = STATUS_MAP[showOnlyMatch[1].trim()]
    if (statusValue) {
      return [...current, newCond('Status', 'is', statusValue)]
    }
  }

  // ── CREATE: filter where {field} contains {text} ──────
  const containsMatch = s.match(/^filter where (\w+) contains ['"]?(.+?)['"]?$/)
  if (containsMatch) {
    const field = FIELD_MAP[containsMatch[1]]
    const value = containsMatch[2].trim()
    if (field && value) {
      return [...current, newCond(field, 'contains', value)]
    }
  }

  // ── CREATE: only show items with no {field} ───────────
  const emptyMatch = s.match(/^only show items with no (\w+)$/)
  if (emptyMatch) {
    const field = FIELD_MAP[emptyMatch[1]]
    if (field) {
      return [...current, newCond(field, 'is empty', '')]
    }
  }

  return null
}
```

**Step 2: Run tests — all should pass**

Run: `npm test`
Expected: all tests PASS

**Step 3: Commit**

```bash
git add src/lib/filterParser.ts
git commit -m "feat: add filterParser with template-matching for filter commands"
```

---

### Task 4: Add onSubmit prop to AiBar

**Files:**
- Modify: `src/components/AiBar.tsx`

**Step 1: Read the current AiBar.tsx**

Read `src/components/AiBar.tsx` before editing.

**Step 2: Update the props interface and handleSubmit**

Change the `AiBarProps` interface from:
```ts
interface AiBarProps {
  placeholder: string
}
```
to:
```ts
interface AiBarProps {
  placeholder: string
  onSubmit?: (value: string) => void
}
```

Update the component signature:
```ts
export function AiBar({ placeholder, onSubmit }: AiBarProps) {
```

Update `handleSubmit` to call `onSubmit` before starting the animation:
```ts
const handleSubmit = () => {
  if (!hasContent || state !== 'typing') return
  onSubmit?.(value)
  setState('loading')
  setValue('')
  setTimeout(() => {
    setState('success')
    setTimeout(() => {
      setState('idle')
    }, 1500)
  }, 2000)
}
```

**Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: no TypeScript errors

**Step 4: Commit**

```bash
git add src/components/AiBar.tsx
git commit -m "feat: add onSubmit prop to AiBar"
```

---

### Task 5: Wire parser into SidePanel

**Files:**
- Modify: `src/components/SidePanel.tsx`

**Step 1: Read the current SidePanel.tsx**

Read `src/components/SidePanel.tsx` before editing.

**Step 2: Add the import**

Add to imports at the top of the file:
```ts
import { parseFilterCommand } from '../lib/filterParser'
```

**Step 3: Add the handler and pass it to AiBar**

After the existing filter handlers (near `handleFilterDelete`), add:

```ts
const handleAiSubmit = (value: string) => {
  const result = parseFilterCommand(value, filterConditions)
  if (result !== null) {
    setFilterConditions(result)
    setActivePage({ name: 'Filter', parent: 'View settings', aiPrompt: 'How can I filter this view?' })
  }
}
```

**Step 4: Pass the handler to AiBar**

Find:
```tsx
<AiBar placeholder={aiPrompt} />
```

Replace with:
```tsx
<AiBar placeholder={aiPrompt} onSubmit={handleAiSubmit} />
```

**Step 5: Verify TypeScript compiles**

Run: `npm run build`
Expected: no TypeScript errors

**Step 6: Test manually in the browser**

Run: `npm run dev`, open `http://localhost:5173`

Test each prompt:
- Type "Show only In Progress items" → Submit → Filter page opens, Status is In Progress condition appears
- Type "Filter where title contains bug" → Submit → Title contains bug condition appended
- Type "Only show items with no description" → Submit → Description is empty condition appended
- Type "Change the status filter to Done" → Submit → existing Status condition updates to Done
- Type "Remove the status filter" → Submit → Status condition removed, others remain
- Type "Clear all filters" → Submit → all conditions cleared
- Type "Delete all filters" → Submit → same as clear
- Type "Delete the title filter" → Submit → Title condition removed

**Step 7: Commit**

```bash
git add src/components/SidePanel.tsx
git commit -m "feat: wire AI bar to filter parser in SidePanel"
```

---

### Task 6: Update progress.md

**Files:**
- Modify: `progress.md`

**Step 1: Read progress.md**

Read `progress.md` before editing.

**Step 2: Add AI filter commands to Features Implemented**

Under the **AI bar (interactive)** section, add a new paragraph:

```markdown
**AI bar — filter commands**
- Natural language commands parse and mutate filter state directly
- Create: "Show only In Progress items", "Filter where title contains 'bug'", "Only show items with no description"
- Edit: "Change the status filter to Done"
- Delete: "Remove/Delete the {field} filter", "Clear/Remove/Delete all filters"
- Auto-navigates to Filter page on success
- Parser lives in `src/lib/filterParser.ts` — pure function, fully unit-tested
```

**Step 3: Update Next Steps — mark filter command item as done if it was listed, or remove it**

Remove this item from Next Steps if present:
```
- [ ] AI bar filter commands
```

**Step 4: Commit**

```bash
git add progress.md
git commit -m "docs: update progress.md with AI filter commands"
```
