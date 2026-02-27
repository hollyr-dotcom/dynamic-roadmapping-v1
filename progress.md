# Roadmap Settings Panel — Progress

## What We've Built

A high-fidelity interactive prototype of the Miro roadmap settings sidebar, running locally at `http://localhost:5173`. Built with React 18 + TypeScript + Vite + Tailwind CSS v3, using the Miro Design System (`@mirohq/design-system`) for all components and icons.

---

## Current State

### Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 with MDS design tokens
- **Component library:** `@mirohq/design-system` (ThemeProvider, DropdownMenu, icons)
- **Fonts:** Roobert PRO (self-hosted, SemiBold) for headings · Noto Sans (Google Fonts) for body

### Components

| File | Description |
|------|-------------|
| `src/components/SidePanel.tsx` | Root panel, all state, navigation logic |
| `src/components/AiBar.tsx` | Interactive AI prompt bar — 4-state machine (idle/typing/loading/success) |
| `src/components/FilterPage.tsx` | Filter detail page — condition builder |
| `src/components/SectionHeader.tsx` | Section label rows with optional + / ··· action buttons |
| `src/components/SettingCell.tsx` | 72px setting row with coloured icon, label, subtitle, chevron |
| `src/components/FieldRow.tsx` | 72px field row with icon, label, hover pen/drag icons |

### Features Implemented

**Panel chrome**
- 400px wide white panel, 12px corner radius, layered shadow
- Slide-in entrance animation (`panel-enter`) from right
- Staggered content fade-in (`item-enter`) with per-section delays
- Close button (top-right, 32px, 16px icon)
- Scrollable content area, hidden scrollbar

**List view**
- FlexAI / Backlog header (Roobert PRO, MDS token colours)
- View settings section: Layout, Filter, Sort, Columns, Swimlanes
- Fields section with + and ··· action buttons: Title (primary), Description, Status, Person
- 0px gap between list items; 2px gap between label and subtitle within each cell
- Hover states: tinted background + revealed chevron/icons
- **On/off icon state:** Filter row icon is blue (active) when conditions exist, gray (inactive) when none — matches Swimlanes gray pattern

**Layout dropdown**
- MDS `DropdownMenu` with `RadioGroup` + `RadioItem` (Table / Kanban / Timeline)
- MDS icons: `IconTable`, `IconKanban`, `IconTimelineFormat`
- Floating via `DropdownMenu.Portal` (escapes `overflow-hidden`)
- Click-position-aware: `alignOffset` computed from click X so the menu opens near where you clicked
- Controlled open state + fixed backdrop — first click outside closes the menu only, doesn't trigger other elements
- Subtitle on Layout cell updates to reflect selected option

**In-panel navigation**
- Clicking Filter, Sort, Columns, Swimlanes, or any Field row opens a detail page
- Back button (top-left): `← View settings` or `← Fields` label
- AI bar placeholder copy is context-aware per page (e.g. "How can I filter this view?")

**AI bar (interactive)**
- Floating pill, centered, `bottom-8` from panel base
- Idle: contextual placeholder, AI icon `sparks-pulse` animation
- Typing: real `<input>`, blue circular submit button (up-arrow) crossfades in when content present
- Loading: "Working on it…" text shimmer (`background-clip: text` gradient), AI icon spins (`ai-spin`)
- Success: "Done. I've made those changes." + green checkmark, 1.5s hold, crossfades back to idle
- Keyboard: Enter submits, Escape clears and returns to idle
- Submit button uses `onMouseDown preventDefault` to keep input focus

**Filter page** *(new)*
- Empty state: "No filters applied" + "New filter" button
- Add, edit, duplicate, delete conditions
- Each condition card: field dropdown → operator dropdown → value control (two-line layout)
- Field-aware operators (Status: is/is not; text fields: contains/does not contain/is empty/is not empty)
- Value control hides for "is empty" / "is not empty" operators
- Status value: dropdown (Todo / In Progress / Done); other fields: text input
- ··· menu per card: Duplicate (inserts copy below) + Delete (danger variant)
- Filter state lifted to SidePanel — persists across navigation
- Filter row subtitle: "Add a filter" (off) → "N filter(s) active" (on)
- Filter row icon: gray (off) → blue (on) as conditions are added/removed

---

## Figma Sync

- Prototype was captured and sent to Figma file `WvjlAkugJjBIvhhExX5ZYA` (Roadmap Space)
- Design changes were pulled back via `get_design_context` on node `14:140`
- Applied: spacing/padding updates, Noto Sans Regular (`fontVariationSettings: "'CTGR' 0, 'wdth' 100"`), SectionHeader alignment and padding, close button position

---

## Next Steps

### Interactions still to build
- [ ] **Sort page** — sort rule list, add rule, drag to reorder; on/off icon state when active
- [ ] **Columns page** — column group picker; on/off icon state when grouped
- [ ] **Swimlanes page** — swimlane group picker; on/off icon state when active
- [ ] **Field detail pages** — field type selector, visibility toggle, rename
- [ ] **SectionHeader actions** — + button (add field), ··· button (field menu)
- [ ] **Layout toggle** — animate subtitle update; consider icon change on open state

### Design polish
- [ ] Page transition animations (slide in/out between list and detail)
- [ ] Back-button hover state refinement
- [ ] Keyboard navigation (Esc to go back)

### Figma handoff
- [ ] Re-capture updated prototype to Figma (capture script already in `index.html`)
- [ ] Share updated node with design team for review

---

## Key Files

```
src/
  components/
    SidePanel.tsx       — main panel, all state
    AiBar.tsx           — interactive AI prompt bar (4-state machine)
    FilterPage.tsx      — filter condition builder
    SectionHeader.tsx   — section headers
    SettingCell.tsx     — view setting rows
    FieldRow.tsx        — field rows
  index.css             — animations, scrollbar, @font-face
  main.tsx              — ThemeProvider wrapper
public/
  fonts/
    RoobertPRO-SemiBold.woff2   — self-hosted font
tailwind.config.js      — heading/body font families
docs/plans/
  2026-02-27-filter-page-design.md   — filter page design doc
  2026-02-27-filter-page.md          — filter page implementation plan
```
