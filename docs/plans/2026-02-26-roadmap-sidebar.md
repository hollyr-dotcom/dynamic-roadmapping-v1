# Roadmap Settings Sidebar — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static React prototype of Miro's roadmap settings right-sidebar, pixel-matched to the Figma design.

**Architecture:** Vite + React + TypeScript project with Tailwind CSS v3 and Lucide React icons. Five components: App (canvas), SidePanel (container), SectionHeader, SettingCell, FieldRow. Static data defined inline in SidePanel.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v3, Lucide React, Google Fonts (Inter + Noto Sans)

**Figma reference:** https://www.figma.com/design/WvjlAkugJjBIvhhExX5ZYA/Roadmap-Space?node-id=11-5091

---

### Task 1: Scaffold the Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`

**Step 1: Scaffold in the project directory**

Run from `/Users/mike/Desktop/First cursor project/`:
```bash
npm create vite@latest . -- --template react-ts
```
When prompted "Current directory is not empty. Remove existing files and continue?" — choose **Yes** (only `docs/` exists, which Vite won't touch).

Expected: creates `package.json`, `vite.config.ts`, `src/`, `index.html`, etc.

**Step 2: Install base dependencies**

```bash
npm install
```
Expected: `node_modules/` created, no errors.

**Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: server starts at `http://localhost:5173`, browser shows Vite + React default page.

Stop server with `Ctrl+C`.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold vite react-ts project"
```

---

### Task 2: Install and configure Tailwind CSS v3

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Install Tailwind v3**

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```
Expected: creates `tailwind.config.js` and `postcss.config.js`.

**Step 2: Replace `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 3: Replace `src/index.css` with Tailwind directives**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
```

**Step 4: Add Google Fonts to `index.html`**

Add inside `<head>` before `</head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans:wght@400;600&display=swap" rel="stylesheet" />
```

**Step 5: Update `src/main.tsx`** to import index.css (replace existing imports):

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Step 6: Replace `src/App.tsx` with a Tailwind smoke test**

```tsx
export function App() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-blue-500">
      <p className="font-heading text-white text-2xl font-semibold">Tailwind works</p>
    </div>
  )
}
```

**Step 7: Run dev server and visually verify**

```bash
npm run dev
```
Expected: blue screen with "Tailwind works" in Inter font.

Stop server.

**Step 8: Commit**

```bash
git add .
git commit -m "feat: configure tailwind v3 with custom fonts"
```

---

### Task 3: Install Lucide React

**Files:**
- No new files

**Step 1: Install**

```bash
npm install lucide-react
```

**Step 2: Smoke test in `src/App.tsx`**

```tsx
import { X } from 'lucide-react'

export function App() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <X size={32} className="text-gray-800" />
    </div>
  )
}
```

**Step 3: Run and verify**

```bash
npm run dev
```
Expected: centered X icon on gray background.

Stop server.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: install lucide-react icons"
```

---

### Task 4: Build the App canvas

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace `src/App.tsx`**

```tsx
export function App() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundColor: '#F2F2F2',
        backgroundImage: 'radial-gradient(circle, #C4C4C4 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* SidePanel will go here in Task 8 */}
      <div className="absolute top-2 right-2 bottom-2 w-[400px] bg-white rounded-xl" />
    </div>
  )
}
```

**Step 2: Run and verify**

```bash
npm run dev
```
Expected: `#F2F2F2` background with dark gray dot grid, white rounded rectangle pinned 8px from top/right/bottom on the right side.

Stop server.

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add canvas with dot grid background"
```

---

### Task 5: Build SectionHeader component

**Files:**
- Create: `src/components/SectionHeader.tsx`

**Step 1: Create `src/components/` directory and the file**

```tsx
import { Plus, MoreVertical } from 'lucide-react'

interface SectionHeaderProps {
  label: string
  showActions?: boolean
}

export function SectionHeader({ label, showActions = false }: SectionHeaderProps) {
  return (
    <div className="flex h-10 items-center justify-between w-full">
      <div className="flex flex-1 items-center h-full rounded-lg">
        <span
          className="font-heading font-semibold text-[#222428] leading-[1.4]"
          style={{ fontSize: '14px' }}
        >
          {label}
        </span>
      </div>
      {showActions && (
        <div className="flex items-center">
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-[#222428]">
            <Plus size={16} />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-[#222428]">
            <MoreVertical size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Smoke test in `src/App.tsx`** — temporarily import and render:

```tsx
import { SectionHeader } from './components/SectionHeader'

export function App() {
  return (
    <div className="p-8 bg-white">
      <SectionHeader label="View settings" />
      <SectionHeader label="Fields" showActions />
    </div>
  )
}
```

**Step 3: Run and verify**

```bash
npm run dev
```
Expected: two rows — first has "View settings" label only, second has "Fields" label plus + and ⋮ buttons on the right.

Stop server. Revert App.tsx to the canvas version from Task 4.

**Step 4: Commit**

```bash
git add src/components/SectionHeader.tsx src/App.tsx
git commit -m "feat: add SectionHeader component"
```

---

### Task 6: Build SettingCell component

**Files:**
- Create: `src/components/SettingCell.tsx`

**Step 1: Create the file**

```tsx
import { type LucideIcon } from 'lucide-react'

interface SettingCellProps {
  icon: LucideIcon
  label: string
  subtitle: string
  iconBg: 'green' | 'blue' | 'gray'
}

const iconBgClass = {
  green: 'bg-[#0FA83C]',
  blue:  'bg-[#3859FF]',
  gray:  'bg-[#F1F2F5]',
} as const

const iconColorClass = {
  green: 'text-white',
  blue:  'text-white',
  gray:  'text-[#222428]',
} as const

export function SettingCell({ icon: Icon, label, subtitle, iconBg }: SettingCellProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl w-full">
      <div className={`flex items-center p-2 rounded-lg shrink-0 ${iconBgClass[iconBg]}`}>
        <Icon size={24} className={iconColorClass[iconBg]} />
      </div>
      <div className="flex flex-col items-start justify-center pb-1">
        <span
          className="font-heading font-semibold text-[#222428] leading-[1.5]"
          style={{ fontSize: '16px' }}
        >
          {label}
        </span>
        <span
          className="font-body text-[#222428] leading-none"
          style={{ fontSize: '12px' }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  )
}
```

**Step 2: Smoke test in `src/App.tsx`**

```tsx
import { Filter, LayoutGrid } from 'lucide-react'
import { SettingCell } from './components/SettingCell'

export function App() {
  return (
    <div className="p-8 bg-white flex flex-col gap-2 w-96">
      <SettingCell icon={LayoutGrid} label="Layout" subtitle="Kanban" iconBg="green" />
      <SettingCell icon={Filter} label="Filter" subtitle="24 of 48 items showing" iconBg="blue" />
    </div>
  )
}
```

**Step 3: Run and verify**

```bash
npm run dev
```
Expected: two rows — green icon square for Layout, blue for Filter. Title + subtitle below each.

Stop server. Revert App.tsx.

**Step 4: Commit**

```bash
git add src/components/SettingCell.tsx src/App.tsx
git commit -m "feat: add SettingCell component"
```

---

### Task 7: Build FieldRow component

**Files:**
- Create: `src/components/FieldRow.tsx`

**Step 1: Create the file**

```tsx
import { type LucideIcon, Pen, GripVertical } from 'lucide-react'

interface FieldRowProps {
  icon: LucideIcon
  label: string
  isPrimary?: boolean
}

export function FieldRow({ icon: Icon, label, isPrimary = false }: FieldRowProps) {
  return (
    <div className="flex items-center justify-between pl-4 pr-2 py-4 bg-white rounded-xl w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F1F2F5] shrink-0">
          <Icon size={24} className="text-[#222428]" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span
            className="font-heading font-semibold text-[#222428] leading-[1.5]"
            style={{ fontSize: '16px' }}
          >
            {label}
          </span>
          {isPrimary && (
            <span
              className="font-body text-[#222428] leading-none"
              style={{ fontSize: '12px' }}
            >
              Primary field
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 opacity-0">
        <Pen size={16} className="text-[#222428]" />
        <GripVertical size={16} className="text-[#222428]" />
      </div>
    </div>
  )
}
```

**Step 2: Smoke test in `src/App.tsx`**

```tsx
import { Type, CheckCircle } from 'lucide-react'
import { FieldRow } from './components/FieldRow'

export function App() {
  return (
    <div className="p-8 bg-white flex flex-col gap-2 w-96">
      <FieldRow icon={Type} label="Title" isPrimary />
      <FieldRow icon={CheckCircle} label="Status" />
    </div>
  )
}
```

**Step 3: Run and verify**

```bash
npm run dev
```
Expected: two rows — "Title" with "Primary field" subtitle, "Status" without. Gray icon squares. Trailing icons invisible.

Stop server. Revert App.tsx.

**Step 4: Commit**

```bash
git add src/components/FieldRow.tsx src/App.tsx
git commit -m "feat: add FieldRow component"
```

---

### Task 8: Build SidePanel component

**Files:**
- Create: `src/components/SidePanel.tsx`

**Note on icons:** Lucide icon names to use — run `node -e "const l = require('lucide-react'); console.log(Object.keys(l).filter(k => /Columns|Rows|Grid/.test(k)))"` after install to confirm exact names. Fallback: `LayoutGrid` for Columns, `AlignJustify` for Swimlanes.

**Step 1: Create the file**

```tsx
import {
  X,
  LayoutGrid,
  Filter,
  ArrowDownUp,
  Columns2,
  AlignJustify,
  Type,
  AlignLeft,
  CheckCircle,
  User,
  Sparkles,
} from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { SettingCell } from './SettingCell'
import { FieldRow } from './FieldRow'

const viewSettings = [
  { label: 'Layout',    subtitle: 'Kanban',                 iconBg: 'green' as const, icon: LayoutGrid   },
  { label: 'Filter',    subtitle: '24 of 48 items showing', iconBg: 'blue'  as const, icon: Filter        },
  { label: 'Sort',      subtitle: 'Sorted by Priority',     iconBg: 'blue'  as const, icon: ArrowDownUp   },
  { label: 'Columns',   subtitle: 'Grouped by Status',      iconBg: 'blue'  as const, icon: Columns2      },
  { label: 'Swimlanes', subtitle: 'Add a group',            iconBg: 'gray'  as const, icon: AlignJustify  },
]

const fields = [
  { label: 'Title',       icon: Type,        isPrimary: true  },
  { label: 'Description', icon: AlignLeft,   isPrimary: false },
  { label: 'Status',      icon: CheckCircle, isPrimary: false },
  { label: 'Person',      icon: User,        isPrimary: false },
]

export function SidePanel() {
  return (
    <div className="relative flex flex-col bg-white rounded-xl h-full w-[400px] overflow-hidden shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]">

      {/* Close button */}
      <button className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 z-10 text-[#222428]">
        <X size={20} />
      </button>

      {/* Scrollable content */}
      <div className="flex flex-col gap-8 overflow-y-auto px-4 pt-16 pb-28">

        {/* Header */}
        <div className="flex flex-col gap-1 px-4">
          <span
            className="font-heading font-semibold text-[#656B81] leading-[1.4]"
            style={{ fontSize: '14px', fontFeatureSettings: "'ss01' 1" }}
          >
            FlexAI
          </span>
          <span
            className="font-heading font-semibold text-[#222428] leading-[1.4]"
            style={{ fontSize: '20px', fontFeatureSettings: "'ss01' 1" }}
          >
            Backlog
          </span>
        </div>

        {/* View settings */}
        <div className="flex flex-col gap-2 w-full">
          <SectionHeader label="View settings" />
          {viewSettings.map((item) => (
            <SettingCell key={item.label} {...item} />
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-2 w-full">
          <SectionHeader label="Fields" showActions />
          {fields.map((item) => (
            <FieldRow key={item.label} {...item} />
          ))}
        </div>

      </div>

      {/* AI bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-between pl-7 pr-6 bg-[#F7F7F7] rounded-full border-4 border-white h-16 w-[352px] shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]">
        <span
          className="font-body text-[#6F7489]"
          style={{ fontSize: '16px' }}
        >
          How can I help set up this view?
        </span>
        <Sparkles size={22} className="text-[#222428] shrink-0" />
      </div>

    </div>
  )
}
```

**Step 2: If `Columns2` is not found**, replace with `PanelLeft` or `LayoutGrid`. Verify by running:

```bash
node -e "const l = require('./node_modules/lucide-react'); console.log(!!l.Columns2)"
```
If `false`, use `LayoutGrid` instead.

**Step 3: Commit**

```bash
git add src/components/SidePanel.tsx
git commit -m "feat: add SidePanel component with static data"
```

---

### Task 9: Wire App.tsx to render SidePanel on canvas

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace `src/App.tsx`**

```tsx
import { SidePanel } from './components/SidePanel'

export function App() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundColor: '#F2F2F2',
        backgroundImage: 'radial-gradient(circle, #C4C4C4 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="absolute top-2 right-2 bottom-2">
        <SidePanel />
      </div>
    </div>
  )
}
```

**Step 2: Run and do full visual QA**

```bash
npm run dev
```

Check against Figma screenshot:
- [ ] Dot grid on `#F2F2F2` background
- [ ] Panel: white, rounded, shadow, 8px from top/right/bottom
- [ ] Close X button top-right
- [ ] "FlexAI" in muted gray (14px), "Backlog" in dark (20px)
- [ ] "View settings" section: Layout (green icon), Filter/Sort/Columns (blue icons), Swimlanes (gray icon)
- [ ] Each setting cell: correct icon, title, subtitle
- [ ] "Fields" section header with + and ⋮ buttons
- [ ] Field rows: Title (Primary field badge), Description, Status, Person
- [ ] AI bar pinned at bottom, pill shape

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire SidePanel into App canvas — static prototype complete"
```
