# Filter Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a functional mid-fidelity filter condition builder in the Filter detail page of the roadmap settings panel.

**Architecture:** `FilterPage.tsx` is a new component that receives filter conditions and callbacks as props. Filter state lives in `SidePanel` so it persists across navigation. Each condition is a card with a field dropdown, operator dropdown, value control, and a `···` actions menu.

**Tech Stack:** React 18 + TypeScript, `@mirohq/design-system` (DropdownMenu, IconDotsThreeVertical, IconPlus), Tailwind CSS v3 with MDS token colours.

---

## Reference

- Design doc: `docs/plans/2026-02-27-filter-page-design.md`
- MDS DropdownMenu API lives at: `node_modules/@mirohq/design-system-dropdown-menu/dist/types.d.ts`
  - `DropdownMenu.Item` uses `onSelect?: (event: Event) => void` (NOT onClick) and `variant?: 'subtle' | 'danger'`
  - `DropdownMenu.RadioGroup` uses `onChange: (value: string) => void`
  - `DropdownMenu.RadioItem` takes `value` and `closeOnSelect`
  - All content must be wrapped in `DropdownMenu.Portal` to escape overflow clipping
- Token colours used throughout:
  - Text primary: `#222428`
  - Text muted: `#656B81`
  - Surface muted: `#F7F8FA`
  - Border: `#E8EAEE`
  - Hover neutral: `#F1F2F5`
  - Accent blue: `#3859FF`
- Font classes: `font-heading font-semibold` for labels, `font-body` for body text
- Body font variation: `style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}`

---

### Task 1: Create `FilterPage.tsx` — types, constants, and empty state

**Files:**
- Create: `src/components/FilterPage.tsx`

**Step 1: Create the file with types, constants, and the empty state**

```tsx
import { DropdownMenu, IconDotsThreeVertical, IconPlus } from '@mirohq/design-system'

export type FilterField = 'Status' | 'Person' | 'Title' | 'Description'

export type FilterCondition = {
  id: string
  field: FilterField
  operator: string
  value: string
}

const FIELDS: FilterField[] = ['Status', 'Person', 'Title', 'Description']

const OPERATORS: Record<FilterField, string[]> = {
  Status:      ['is', 'is not'],
  Person:      ['is', 'is not', 'is empty', 'is not empty'],
  Title:       ['contains', 'does not contain', 'is empty', 'is not empty'],
  Description: ['contains', 'does not contain', 'is empty', 'is not empty'],
}

const STATUS_VALUES = ['Todo', 'In Progress', 'Done']
const NO_VALUE_OPS = new Set(['is empty', 'is not empty'])

export function defaultCondition(): FilterCondition {
  return { id: crypto.randomUUID(), field: 'Status', operator: 'is', value: '' }
}

interface FilterPageProps {
  conditions: FilterCondition[]
  onAdd: () => void
  onChange: (id: string, patch: Partial<FilterCondition>) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function FilterPage({ conditions, onAdd, onChange, onDuplicate, onDelete }: FilterPageProps) {
  if (conditions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 pt-8">
        <span
          className="font-body text-[#656B81]"
          style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          No filters applied
        </span>
        <AddFilterButton onClick={onAdd} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {conditions.map((c) => (
        <ConditionCard
          key={c.id}
          condition={c}
          onChange={(patch) => onChange(c.id, patch)}
          onDuplicate={() => onDuplicate(c.id)}
          onDelete={() => onDelete(c.id)}
        />
      ))}
      <div className="pt-1">
        <AddFilterButton onClick={onAdd} />
      </div>
    </div>
  )
}

function AddFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#222428] text-white hover:bg-[#3F4454] transition-colors duration-150"
    >
      <IconPlus size="small" />
      <span className="font-heading font-semibold" style={{ fontSize: '14px' }}>
        Add filter
      </span>
    </button>
  )
}
```

**Step 2: Verify the file has no TypeScript errors**

Run: `cd "/Users/mike/Desktop/First cursor project" && npx tsc --noEmit`
Expected: No errors (DropdownMenu not yet used, so no API issues)

**Step 3: Commit**

```bash
git add src/components/FilterPage.tsx
git commit -m "feat: add FilterPage shell with types, constants, empty state"
```

---

### Task 2: Add `ConditionCard` component to `FilterPage.tsx`

**Files:**
- Modify: `src/components/FilterPage.tsx`

The card has two lines:
- Line 1: field pill + operator pill + `···` menu (right-aligned)
- Line 2 (conditional): value control (hidden when operator is "is empty" / "is not empty")

Each pill is a `DropdownMenu.Trigger` button styled as a compact rounded pill.

**Step 1: Add `ConditionCard` to `FilterPage.tsx` — insert before `FilterPage` function**

```tsx
interface ConditionCardProps {
  condition: FilterCondition
  onChange: (patch: Partial<FilterCondition>) => void
  onDuplicate: () => void
  onDelete: () => void
}

function ConditionCard({ condition, onChange, onDuplicate, onDelete }: ConditionCardProps) {
  const needsValue = !NO_VALUE_OPS.has(condition.operator)

  const handleFieldChange = (field: string) => {
    const newField = field as FilterField
    onChange({ field: newField, operator: OPERATORS[newField][0], value: '' })
  }

  const handleOperatorChange = (operator: string) => {
    onChange({ operator, value: '' })
  }

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F8FA] border border-[#E8EAEE]">

      {/* Line 1: Field + Operator + ··· */}
      <div className="flex items-center gap-2">

        {/* Field dropdown */}
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 px-3 rounded-lg bg-white border border-[#E8EAEE] text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150 shrink-0">
              <span className="font-body" style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {condition.field}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content css={{ zIndex: 200 }}>
              <DropdownMenu.RadioGroup value={condition.field} onChange={handleFieldChange}>
                {FIELDS.map((f) => (
                  <DropdownMenu.RadioItem key={f} value={f} closeOnSelect>
                    {f}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>

        {/* Operator dropdown */}
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 px-3 rounded-lg bg-white border border-[#E8EAEE] text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150 shrink-0">
              <span className="font-body" style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {condition.operator}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content css={{ zIndex: 200 }}>
              <DropdownMenu.RadioGroup value={condition.operator} onChange={handleOperatorChange}>
                {OPERATORS[condition.field].map((op) => (
                  <DropdownMenu.RadioItem key={op} value={op} closeOnSelect>
                    {op}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>

        {/* ··· actions menu — right-aligned */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[#656B81] hover:bg-[#F1F2F5] hover:text-[#222428] transition-colors duration-150">
                <IconDotsThreeVertical size="small" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content css={{ zIndex: 200 }}>
                <DropdownMenu.Item onSelect={() => onDuplicate()}>
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item variant="danger" onSelect={() => onDelete()}>
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </div>
      </div>

      {/* Line 2: Value control */}
      {needsValue && (
        condition.field === 'Status' ? (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center h-8 px-3 w-full rounded-lg bg-white border border-[#E8EAEE] text-left hover:bg-[#F1F2F5] transition-colors duration-150">
                <span
                  className={`font-body ${condition.value ? 'text-[#222428]' : 'text-[#9EA3B5]'}`}
                  style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
                >
                  {condition.value || 'Select value…'}
                </span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content css={{ zIndex: 200 }}>
                <DropdownMenu.RadioGroup
                  value={condition.value}
                  onChange={(val) => onChange({ value: val })}
                >
                  {STATUS_VALUES.map((v) => (
                    <DropdownMenu.RadioItem key={v} value={v} closeOnSelect>
                      {v}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        ) : (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="Enter value…"
            className="h-8 px-3 w-full rounded-lg bg-white border border-[#E8EAEE] font-body text-[#222428] placeholder:text-[#9EA3B5] focus:outline-none focus:ring-1 focus:ring-[#3859FF] transition-shadow duration-150"
            style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
        )
      )}
    </div>
  )
}
```

**Step 2: Verify TypeScript**

Run: `cd "/Users/mike/Desktop/First cursor project" && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/FilterPage.tsx
git commit -m "feat: add ConditionCard with field/operator/value dropdowns and actions menu"
```

---

### Task 3: Wire `FilterPage` into `SidePanel.tsx`

**Files:**
- Modify: `src/components/SidePanel.tsx`

**Step 1: Add imports at the top of `SidePanel.tsx`**

Add after the existing imports (around line 20):

```tsx
import { FilterPage, FilterCondition, defaultCondition } from './FilterPage'
```

**Step 2: Add filter state and handlers inside `SidePanel` (after existing useState calls, around line 57)**

```tsx
const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([])

const handleFilterAdd = () =>
  setFilterConditions((prev) => [...prev, defaultCondition()])

const handleFilterChange = (id: string, patch: Partial<FilterCondition>) =>
  setFilterConditions((prev) =>
    prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
  )

const handleFilterDuplicate = (id: string) =>
  setFilterConditions((prev) => {
    const idx = prev.findIndex((c) => c.id === id)
    if (idx === -1) return prev
    const copy = { ...prev[idx], id: crypto.randomUUID() }
    return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]
  })

const handleFilterDelete = (id: string) =>
  setFilterConditions((prev) => prev.filter((c) => c.id !== id))
```

**Step 3: Render `FilterPage` in the scrollable content area**

Inside the scrollable `<div>`, after the `{!activePage && ( ... )}` block (around line 181), add:

```tsx
{activePage?.name === 'Filter' && (
  <div className="item-enter" style={{ animationDelay: '240ms' }}>
    <FilterPage
      conditions={filterConditions}
      onAdd={handleFilterAdd}
      onChange={handleFilterChange}
      onDuplicate={handleFilterDuplicate}
      onDelete={handleFilterDelete}
    />
  </div>
)}
```

**Step 4: Update the Filter subtitle to reflect active filter count**

In the `viewSettings` array (around line 32), the Filter entry has a static subtitle. Change it to derive the subtitle dynamically inside the component.

Replace the static subtitle on the Filter `SettingCell` render. In the JSX where `item.label === 'Filter'` renders a `SettingCell` (around line 155–163), pass a dynamic subtitle:

```tsx
subtitle={
  item.label === 'Filter' && filterConditions.length > 0
    ? `${filterConditions.length} filter${filterConditions.length > 1 ? 's' : ''} active`
    : item.subtitle
}
```

So the full `SettingCell` for non-Layout items becomes:

```tsx
<SettingCell
  key={item.label}
  icon={item.icon}
  label={item.label}
  subtitle={
    item.label === 'Filter' && filterConditions.length > 0
      ? `${filterConditions.length} filter${filterConditions.length > 1 ? 's' : ''} active`
      : item.subtitle
  }
  iconBg={item.iconBg}
  onClick={() => setActivePage({ name: item.label, parent: 'View settings', aiPrompt: item.aiPrompt })}
/>
```

**Step 5: Verify TypeScript**

Run: `cd "/Users/mike/Desktop/First cursor project" && npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add src/components/SidePanel.tsx
git commit -m "feat: wire FilterPage into SidePanel with lifted state and dynamic subtitle"
```

---

### Task 4: Smoke-test in the browser

**Step 1: Start the dev server**

Run: `cd "/Users/mike/Desktop/First cursor project" && npm run dev`
Open: `http://localhost:5173`

**Step 2: Verify the following manually**

- [ ] Click **Filter** row → navigates to Filter detail page
- [ ] Empty state shows "No filters applied" + "Add filter" button
- [ ] Click "Add filter" → a condition card appears (Status / is / Select value…)
- [ ] **Field dropdown**: opens, selecting a different field updates field pill and resets operator to first valid
- [ ] **Operator dropdown**: opens, shows operators for the selected field; selecting "is empty" hides value line
- [ ] **Value line (Status)**: dropdown opens with Todo / In Progress / Done; selection shows in button
- [ ] **Value line (text fields)**: text input accepts typing
- [ ] **··· menu**: opens; "Duplicate" inserts a copy below; "Delete" removes the card
- [ ] Click "Add filter" again → second card appended
- [ ] Back button → returns to list view; filter count subtitle on Filter row updates (e.g. "2 filters active")
- [ ] Navigate back to Filter → conditions still present

**Step 3: Commit if any minor tweaks were needed**

```bash
git add -p
git commit -m "fix: filter page smoke-test adjustments"
```

---

## Done

All four tasks complete. The Filter page is fully functional as a mid-fidelity prototype with add, edit, duplicate, and delete interactions.
