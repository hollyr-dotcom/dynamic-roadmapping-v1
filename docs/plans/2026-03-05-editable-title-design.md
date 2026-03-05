# Editable Database Title — Design Doc

**Date:** 2026-03-05
**Reference:** [Figma EditableTitle](https://www.figma.com/design/lmWpZFQnnzdbo6WlJeChsB/%F0%9F%8E%8A-Intelligent-Canvas---Widget-SDK?node-id=12522-62874&m=dev)

## What We're Changing

Replace the current h1 ↔ input swap pattern in `DatabaseTitle.tsx` with a single always-rendered `<input>`, styled to match the Figma EditableTitle component's three states (Idle, Hovered, Focused) at 32px.

## Why

The current implementation swaps between an `<h1>` and an `<input>` element, which causes:
- Layout jump on state change
- Loss of cursor position context
- Requires React state to track `editing` boolean

The always-input pattern uses CSS pseudo-classes for state changes, giving seamless transitions and a more polished feel.

## Design

### Element

A single `<input>` rendered at all times. No element swapping, no `editing` boolean.

### Visual States

| State | Background | Border | Cursor | Transition |
|-------|-----------|--------|--------|------------|
| Idle | transparent | none | default | — |
| Hovered | #F1F2F5 | 4px radius | pointer | 150ms |
| Focused | white | 4px radius, double-ring `0 0 0 2px white, 0 0 0 4px #2B4DF8` | text | — |

### Typography

- 32px Roobert PRO SemiBold (`font-heading font-semibold`)
- Color: #222428
- Line-height: 1.4
- 4px horizontal padding

### Behaviour

- **Click** → focuses input, selects all text
- **Enter** → saves value, blurs
- **Escape** → reverts to original value, blurs
- **Blur** → saves
- **Empty** → placeholder "Enter a title ..." in #7D8297

### Width

Input stretches to fit content (no fixed width). Uses a hidden measuring span or `ch` units.

## Implementation

### Changes

1. **`DatabaseTitle.tsx`** — Rewrite: remove `editing` state and h1/input conditional. Render a single `<input>` with Tailwind classes for idle state, hover pseudo-class for hovered, focus pseudo-class for focused. Use `onFocus` to select all text, `onBlur` to save.

2. **`index.css`** — Keep existing `.title-input::placeholder` rule. No other CSS changes needed.

### Approach

- Idle/hover styling via Tailwind: `bg-transparent hover:bg-[#F1F2F5] hover:cursor-pointer`
- Focus styling via Tailwind: `focus:bg-white focus:cursor-text` + focus ring via `focus:shadow-[...]` or inline style
- `cursor-default` by default, overridden by hover/focus
- `onFocus` handler calls `inputRef.current?.select()`
- Auto-sizing: render a hidden `<span>` with the same font/size, measure its width, apply to input

## Out of Scope

- Size prop (H3/H4/Mini) — hardcoded to 32px for this use case
- Selected state (blue highlight behind text)
- Filled/unfilled as separate prop — handled implicitly by whether `value` is empty
