# AI Bar — Interactive Design

**Date:** 2026-02-27
**Component:** `src/components/AiBar.tsx` (new)
**Related:** `src/components/SidePanel.tsx` (minor update)

---

## Overview

Upgrade the floating AI bar from a static decorative pill into a functional prompt input. Users can type a natural-language instruction, submit it, and see the bar transition through loading and success states before resetting to idle.

---

## State Machine

```
idle ──(user types)──► typing ──(submit clicked)──► loading ──(2s)──► success ──(1.5s)──► idle
       ◄──(blur, empty)──
```

Four states: `idle | typing | loading | success`

---

## Component

### Props

```ts
interface AiBarProps {
  placeholder: string  // context-aware prompt string from SidePanel
}
```

### Internal state

```ts
type AiBarState = 'idle' | 'typing' | 'loading' | 'success'
const [state, setState] = useState<AiBarState>('idle')
const [value, setValue] = useState('')
```

---

## Visual Design Per State

### Idle
- Bar: `#F7F7F7` background, `cursor-text`; clicking anywhere focuses the `<input>`
- Left: contextual placeholder text in `#6F7489`, body font
- Right: AI icon (`AiIcon` SVG) with `sparks-pulse` animation

### Typing
- Left: `<input>` visible with typed text; placeholder hidden natively
- Right: if `value.length > 0` — AI icon crossfades (200ms opacity) to a 32×32 circular blue (`#4262FF`) button containing a white up-arrow icon
- Right: if `value` is empty — AI icon remains (no content to submit)
- Blur with empty input → transition back to `idle`

### Loading
- Input disabled and cleared
- Bar background: shimmer gradient (`#F7F7F7 → #EBEBEB → #F7F7F7`) sweeps left-to-right, ~1s loop
- Left: empty (shimmer covers the text area)
- Right: AI icon returns (200ms crossfade) and spins continuously (`360deg`, 1s linear infinite)
- `pointer-events-none` on the bar

### Success
- Shimmer stops; background snaps to solid `#F7F7F7`
- AI icon spin stops; crossfades to green checkmark (`#1BA672`)
- Left text: `"Done. I've made those changes."` in `#222428` (full-weight, not muted)
- Holds for 1.5s, then entire bar crossfades back to idle (placeholder + sparks-pulse icon)

---

## Animations (new CSS)

### `ai-spin`
```css
@keyframes ai-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.ai-spin {
  animation: ai-spin 1s linear infinite;
}
```

### `bar-shimmer`
```css
@keyframes bar-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.bar-shimmer {
  background: linear-gradient(90deg, #F7F7F7 25%, #EBEBEB 50%, #F7F7F7 75%);
  background-size: 200% 100%;
  animation: bar-shimmer 1.2s ease-in-out infinite;
}
```

---

## Timings

| Transition | Duration |
|---|---|
| Icon ↔ submit button crossfade | 200ms |
| Submit → loading | immediate |
| Loading hold (simulated agent) | 2000ms |
| Success hold | 1500ms |
| Success → idle crossfade | 300ms |

---

## SidePanel Change

Replace the inline AI bar JSX block with:
```tsx
<AiBar placeholder={aiPrompt} />
```

The `absolute bottom-8 left-1/2 -translate-x-1/2 w-[352px]` wrapper div stays in SidePanel to preserve positioning.
