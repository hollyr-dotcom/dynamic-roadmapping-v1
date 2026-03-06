# Tab Drag-to-Reorder — Design

**Date:** 2026-03-06

## Problem

Tab drag-to-reorder doesn't work. The `useEffect` that attaches document-level `mousemove`/`mouseup` listeners checks `dragRef.current`, but refs don't trigger re-renders — so the effect never runs after `handleTabMouseDown` sets the ref. The listeners never attach and the drag never activates.

## Approach

Replace the broken `useEffect` with inline listener management: attach `mousemove` and `mouseup` to `document` directly inside `handleTabMouseDown`, and remove them in the `mouseup` handler.

## Changes

1. **Remove** the `useEffect` (lines 196–220) that depends on `dragRef.current`
2. **Add a `dropIndexRef`** — a ref that mirrors the `dropIndex` state so the `mouseup` handler always reads the latest value (avoids stale closure)
3. **Rewrite `handleTabMouseDown`** — on mouse down, attach document-level `mousemove` and `mouseup` listeners inline; `mousemove` checks the 5px threshold then activates drag; `mouseup` calls `finishDrag` and removes both listeners
4. **Keep** `computeDropIndex`, `finishDrag`, `showIndicatorAt`, drop indicator JSX, dragged tab styling — all unchanged

## Interaction Flow

- Mouse down on visible tab → store start position, attach listeners
- Move ≥5px → tab ghosts (opacity-30), cursor changes, blue drop indicator appears
- Move across tabs → indicator follows cursor
- Mouse up → tab reorders, listeners removed, state resets
- Click without 5px movement → normal tab switch

## Scope

- Visible tabs only — overflow tabs not draggable
- No changes to context menu, inline rename, or overflow behaviour
