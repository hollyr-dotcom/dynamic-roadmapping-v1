# Sidekick Boards Section in SpaceMenu

## Summary

Add a collapsible "Created with Sidekick" section inside the SpaceMenu's "Boards and formats" area. When a board is created via the add-to-board flow, it appears here. Clicking a board re-opens the canvas with that board's content.

## Data Model

New type in App.tsx:

```ts
interface SidekickBoard {
  id: string
  name: string
  feedbackCard: FeedbackCardData
}
```

State: `sidekickBoards: SidekickBoard[]` in App.tsx, initially empty.

## Behavior

### Board creation
- When `handleAddToBoard` fires, a new `SidekickBoard` is pushed to `sidekickBoards` with an auto-generated name ("Board 1", "Board 2", etc.).
- The `feedbackCard` data is stored so the canvas can be re-opened with it.

### Board click
- Clicking a board in the section calls `onSidekickBoardClick(board)` in App.tsx.
- This opens the canvas with the stored feedback card widget (same as the original add-to-board behavior).

### Visibility
- The "Created with Sidekick" section only renders when `sidekickBoards.length > 0`.
- It appears after the first board is created through the add-to-board flow.

## SpaceMenu Layout

The section lives inside the existing "Boards and formats" area, below any existing board entries. No separate divider.

```
Boards and formats                    [+]
  (existing board entries, if any)
  > Created with Sidekick          [+] [...]   <- hover-only actions
      Board 1
      Board 2
```

### CollapsibleSection component
- **Header row**: collapse chevron (rotates when open), bold section title, `+` and `...` icon buttons visible on hover only.
- **Board items**: indented list with board icon and name. Hover highlight. Active state when that board's canvas is open.
- Collapsed by default until the user expands it.
- Matches Miro's space section visual style (from the reference screenshot).

## App.tsx Wiring

- `sidekickBoards` state array, managed alongside existing state.
- `handleAddToBoard` pushes a new board entry in addition to creating the canvas widget.
- New `handleSidekickBoardClick(board)` opens canvas with the board's stored feedback card data.
- Pass to SpaceMenu: `sidekickBoards`, `onSidekickBoardClick`, `activeSidekickBoardId`.

## Props Changes

### SpaceMenu
New props:
- `sidekickBoards: SidekickBoard[]`
- `onSidekickBoardClick: (board: SidekickBoard) => void`
- `activeSidekickBoardId?: string`

## Approach

State lives in App.tsx (approach A) — consistent with the existing pattern where App owns all canvas/sidebar state.
