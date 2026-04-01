import { useState, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition, Priority } from '@spaces/shared'
import { KanbanCard } from '../kanban/KanbanCard'

const PRIORITY_BORDER: Record<Priority, string> = {
  now: '#b5ecff',
  triage: '#ffc6c6',
  next: '#ffc795',
  later: '#d4bbff',
  icebox: '#dad8d8',
}

const DRAG_THRESHOLD = 3

function SelectionBorder() {
  const blue = '#3859FF'
  const offset = 6
  const cornerSize = 12
  const corners = [
    { top: -cornerSize / 2, left: -cornerSize / 2 },
    { top: -cornerSize / 2, right: -cornerSize / 2 },
    { bottom: -cornerSize / 2, left: -cornerSize / 2 },
    { bottom: -cornerSize / 2, right: -cornerSize / 2 },
  ] as const
  return (
    <div className="absolute pointer-events-none" style={{ inset: -offset, border: `1.5px solid ${blue}`, zIndex: 1 }}>
      {corners.map((pos, i) => (
        <div key={i} className="absolute rounded-full" style={{ ...pos, width: cornerSize, height: cornerSize, background: 'white', border: `1.5px solid ${blue}` }} />
      ))}
    </div>
  )
}

interface CanvasRecordCardProps {
  widget: {
    id: string
    x: number
    y: number
    recordRow?: SpaceRow
    recordFields?: FieldDefinition[]
    recordPrompt?: string
  }
  panX: number
  panY: number
  zoom: number
  isOpen: boolean
  selected: boolean
  onSelect: () => void
  onMove: (x: number, y: number) => void
  smoothPanning: boolean
}

export function CanvasRecordCard({
  widget,
  panX,
  panY,
  zoom,
  isOpen,
  selected,
  onSelect,
  onMove,
  smoothPanning,
}: CanvasRecordCardProps) {
  const row = widget.recordRow!
  const fields = widget.recordFields ?? []
  const borderColor = PRIORITY_BORDER[row.priority] ?? '#dad8d8'

  const [widgetX, setWidgetX] = useState(widget.x)
  const [widgetY, setWidgetY] = useState(widget.y)
  const dragging = useRef(false)
  const dragStarted = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    dragging.current = true
    dragStarted.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { x: widgetX, y: widgetY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [widgetX, widgetY])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (!dragStarted.current) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      dragStarted.current = true
    }
    setWidgetX(posStart.current.x + dx / zoom)
    setWidgetY(posStart.current.y + dy / zoom)
  }, [zoom])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const wasDrag = dragStarted.current
    dragging.current = false
    dragStarted.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    if (wasDrag) {
      onMove(widgetX, widgetY)
    } else {
      onSelect()
    }
  }, [onSelect, onMove, widgetX, widgetY])

  // Filter to non-primary fields for the card tags
  const cardFields = fields.filter(f => f.id !== 'title' && f.id !== 'description')

  return (
    <div
      className="fixed top-0 left-0"
      style={{
        zIndex: selected ? 80 : 70,
        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        transformOrigin: '0 0',
        opacity: isOpen ? 1 : 0,
        pointerEvents: 'none',
        transition: smoothPanning
          ? 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)'
          : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: widgetY,
          left: widgetX,
          width: 340,
          pointerEvents: 'auto',
          cursor: selected ? 'grab' : 'default',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {selected && <SelectionBorder />}
        <KanbanCard
          row={row}
          fields={cardFields}
          borderColor={borderColor}
        />
      </div>
    </div>
  )
}
