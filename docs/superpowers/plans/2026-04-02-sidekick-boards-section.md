# Sidekick Boards Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a collapsible "Created with Sidekick" section inside the SpaceMenu that collects boards created through the add-to-board flow, with click-to-reopen-canvas behavior.

**Architecture:** New `sidekickBoards` state array in App.tsx tracks boards created via `handleAddToBoard`. A `CollapsibleSection` component in SpaceMenu renders these as a Miro-style collapsible group within the existing "Boards and formats" area. Clicking a board re-opens the canvas with its stored feedback card data.

**Tech Stack:** React, Tailwind CSS, Miro Design System icons

---

## File Structure

- **Modify:** `packages/spaces-table/src/App.tsx` — add `sidekickBoards` state, update `handleAddToBoard` to track boards, add click handler, pass props to SpaceMenu
- **Modify:** `packages/spaces-table/src/components/sidebar/SpaceMenu.tsx` — add `CollapsibleSection` component, wire up sidekick boards display and click behavior

---

### Task 1: Add sidekickBoards state and update handleAddToBoard in App.tsx

**Files:**
- Modify: `packages/spaces-table/src/App.tsx`

- [ ] **Step 1: Add the SidekickBoard interface and state**

Near the top of App.tsx (after the existing interfaces around line 30-44), add:

```tsx
interface SidekickBoard {
  id: string
  name: string
  feedbackCard: FeedbackCardData
}
```

Inside the `App` component, after the existing state declarations (around line 127), add:

```tsx
const [sidekickBoards, setSidekickBoards] = useState<SidekickBoard[]>([])
```

- [ ] **Step 2: Update handleAddToBoard to track created boards**

In `handleAddToBoard` (around line 493), add a push to `sidekickBoards` before `setActiveSidebar(null)`. The updated function should end with:

```tsx
    // Track in sidekick boards list
    setSidekickBoards(prev => {
      const name = `Board ${prev.length + 1}`
      return [...prev, { id: cardWidget.id, name, feedbackCard: cardData }]
    })
    setActiveSidebar(null)
  }, [canvasOpen, activeTab])
```

This replaces the existing `setActiveSidebar(null)` line and closing of the useCallback.

- [ ] **Step 3: Add handleSidekickBoardClick handler**

After `handleAddToBoard`, add:

```tsx
const handleSidekickBoardClick = useCallback((board: SidekickBoard) => {
  const cardWidget: CanvasWidget = {
    id: board.id,
    type: 'feedback-card',
    activeTab: '',
    x: window.innerWidth - 380,
    y: 128,
    feedbackCard: board.feedbackCard,
  }
  if (!canvasOpen) {
    setWidgets([{ id: `widget-${Date.now()}`, type: 'table', activeTab, x: 0, y: 128 }, cardWidget])
    setCanvasOpen(true)
    setPanX(0)
    setPanY(0)
    setZoom(1)
    setSelectedWidgetId(null)
  } else {
    setWidgets(prev => [...prev, cardWidget])
  }
  setActiveSidebar(null)
}, [canvasOpen, activeTab])
```

- [ ] **Step 4: Pass new props to SpaceMenu**

Find the `<SpaceMenu` JSX (around line 629). Add the new props:

```tsx
<SpaceMenu
  onClose={closeSidebar}
  activePage={activePage}
  onPageChange={switchPage}
  onGoHome={() => { closeSidebar(); setView('home') }}
  spaceName={spaceName}
  boards={boards}
  activeBoardId={canvasOpen && boardName ? boards.find(b => b.name === boardName)?.id : undefined}
  sidekickBoards={sidekickBoards}
  onSidekickBoardClick={handleSidekickBoardClick}
  activeSidekickBoardId={canvasOpen ? widgets.find(w => w.type === 'feedback-card')?.id : undefined}
/>
```

- [ ] **Step 5: Verify the app compiles without errors**

Run: `cd packages/spaces-table && npx tsc --noEmit 2>&1 | head -20`

There will be type errors for SpaceMenu not accepting the new props yet — that's expected and will be resolved in Task 2.

- [ ] **Step 6: Commit**

```bash
git add packages/spaces-table/src/App.tsx
git commit -m "Add sidekickBoards state and tracking to handleAddToBoard"
```

---

### Task 2: Add CollapsibleSection and sidekick boards to SpaceMenu

**Files:**
- Modify: `packages/spaces-table/src/components/sidebar/SpaceMenu.tsx`

- [ ] **Step 1: Add new imports and update the interface**

Add `IconChevronRight`, `IconDotsThreeVertical`, and `IconSparksFilled` to the existing import from `@mirohq/design-system`. `IconDotsThreeVertical` is already imported, so just add the other two. Also add `useState`:

```tsx
import { useState } from 'react'
import {
  IconButton,
  IconHouse,
  IconMagnifyingGlass,
  IconCross,
  IconChevronUpDown,
  IconChevronRight,
  IconDotsThreeVertical,
  IconLightbulb,
  IconRocket,
  IconPlus,
  IconSparksFilled,
} from '@mirohq/design-system'
import { BoardIcon } from '../BoardIcons'
```

Add the `SidekickBoard` type and update `SpaceMenuProps`:

```tsx
interface SidekickBoard {
  id: string
  name: string
  feedbackCard: unknown
}

interface SpaceMenuProps {
  onClose: () => void
  activePage: string
  onPageChange: (id: string) => void
  onGoHome?: () => void
  spaceName?: string
  boards?: { id: string; name: string; iconIndex: number }[]
  activeBoardId?: string
  sidekickBoards?: SidekickBoard[]
  onSidekickBoardClick?: (board: SidekickBoard) => void
  activeSidekickBoardId?: string
}
```

- [ ] **Step 2: Add the CollapsibleSection component**

Above the `SpaceMenu` export, add:

```tsx
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="mt-1">
      <div
        className="flex items-center h-8 rounded-lg px-2 cursor-pointer hover:bg-[#F1F2F5] transition-colors duration-150 group"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className="text-[#656B81] transition-transform duration-200 mr-1"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-flex' }}
        >
          <IconChevronRight size="small" />
        </span>
        <span
          className="font-body font-semibold text-[#1A1B1E] leading-none flex-1 select-none"
          style={{ fontSize: '14px' }}
        >
          {title}
        </span>
        <div
          className="flex items-center gap-0.5 transition-opacity duration-150"
          style={{ opacity: isHovered ? 1 : 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton aria-label="Add" variant="ghost" size="small">
            <IconPlus />
          </IconButton>
          <IconButton aria-label="Options" variant="ghost" size="small">
            <IconDotsThreeVertical />
          </IconButton>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-0.5 mt-0.5">
          {children}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Update SpaceMenu to destructure new props and render the section**

Update the function signature:

```tsx
export function SpaceMenu({ onClose, activePage, onPageChange, onGoHome, spaceName, boards, activeBoardId, sidekickBoards, onSidekickBoardClick, activeSidekickBoardId }: SpaceMenuProps) {
```

After the existing board entries block (`</div>` closing the `boards.map` around line 144) and before the empty state block, add the sidekick boards section:

```tsx
        {/* Sidekick-created boards */}
        {sidekickBoards && sidekickBoards.length > 0 && (
          <CollapsibleSection title="Created with Sidekick" defaultOpen>
            {sidekickBoards.map(board => {
              const isActive = board.id === activeSidekickBoardId
              return (
                <button
                  key={board.id}
                  onClick={() => onSidekickBoardClick?.(board)}
                  className={`flex items-center gap-3 w-full rounded-lg px-2 h-10 text-left transition-colors duration-150 ${
                    isActive ? 'bg-[#F3F4F6]' : 'hover:bg-[#F1F2F5]'
                  }`}
                  style={{ paddingLeft: '28px' }}
                >
                  <span className="text-[#656B81]">
                    <IconSparksFilled size="small" />
                  </span>
                  <span
                    className="font-body text-[#222428] leading-[1.3] select-none truncate"
                    style={{ fontSize: '14px', minWidth: 0 }}
                  >
                    {board.name}
                  </span>
                </button>
              )
            })}
          </CollapsibleSection>
        )}
```

- [ ] **Step 4: Verify the app compiles**

Run: `cd packages/spaces-table && npx tsc --noEmit 2>&1 | head -20`

Expected: No errors (or only pre-existing ones unrelated to this change).

- [ ] **Step 5: Commit**

```bash
git add packages/spaces-table/src/components/sidebar/SpaceMenu.tsx
git commit -m "Add collapsible 'Created with Sidekick' section to SpaceMenu"
```

---

### Task 3: Manual test and polish

- [ ] **Step 1: Test the flow end-to-end**

1. Open the app, navigate to a table view
2. Click a row to open the detail panel
3. Use "Add to board" to create a canvas with a feedback card
4. Open the space menu (hamburger / left sidebar)
5. Verify "Created with Sidekick" section appears inside "Boards and formats"
6. Verify the section is collapsible (click chevron to collapse/expand)
7. Verify hover shows `+` and `...` buttons on the section header
8. Click the board entry — verify the canvas re-opens with that feedback card
9. Create a second board and verify it appears as "Board 2"

- [ ] **Step 2: Take screenshots and review visual alignment**

Check that:
- The section header aligns with Miro's space section style from the reference screenshot
- Board items have correct indentation, hover states, and active highlight
- The sparks icon renders correctly next to board names

- [ ] **Step 3: Fix any visual issues found**

Address spacing, alignment, or colour issues as needed.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "Polish Sidekick boards section styling"
```
