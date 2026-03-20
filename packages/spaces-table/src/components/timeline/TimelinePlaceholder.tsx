import { useState, useRef, useEffect, useMemo } from 'react'
import type { SpaceRow, Priority } from '@spaces/shared'
import { KanbanCardToolbar } from '../kanban/KanbanCardToolbar'

const PRIORITY_BAR_COLORS: Record<Priority, { bg: string; border: string; text: string }> = {
  triage: { bg: '#fff0f0', border: '#ffc6c6', text: '#600000' },
  now:    { bg: '#e4f9ff', border: '#b5ecff', text: '#003d54' },
  next:   { bg: '#ffeede', border: '#ffc795', text: '#5c3200' },
  later:  { bg: '#f3eeff', border: '#d4bbff', text: '#2d0066' },
  icebox: { bg: '#f7f7f7', border: '#dad8d8', text: '#222428' },
}
const DEFAULT_BAR_COLOR = PRIORITY_BAR_COLORS.icebox
const JIRA_LOGO = '/images/jira-logo.svg'
const DAY_WIDTH = 48
const BAR_HEIGHT = 40
const ROW_HEIGHT = 56
const MONTH_H = 44
const DAYS_H = 44
const HANDLE_W = 8
const STICKY_TOP = 64
const STICKY_GAP_COVER = '0 -12px 0 0 white'

// View: March 1 – April 15, 2026
const VIEW_START = new Date(2026, 2, 1)
const TODAY = new Date()
const TOTAL_DAYS = 46
const GRID_TOP_OFFSET = (ROW_HEIGHT - BAR_HEIGHT) / 2  // extra top padding = gap between bars

const PEOPLE: Record<string, { avatar: string }> = {
  r1:  { avatar: 'https://i.pravatar.cc/40?img=47' },
  r2:  { avatar: 'https://i.pravatar.cc/40?img=12' },
  r3:  { avatar: 'https://i.pravatar.cc/40?img=56' },
  r4:  { avatar: 'https://i.pravatar.cc/40?img=19' },
  r5:  { avatar: 'https://i.pravatar.cc/40?img=47' },
  r6:  { avatar: 'https://i.pravatar.cc/40?img=15' },
  r7:  { avatar: 'https://i.pravatar.cc/40?img=56' },
  r8:  { avatar: 'https://i.pravatar.cc/40?img=12' },
  r9:  { avatar: 'https://i.pravatar.cc/40?img=19' },
  r10: { avatar: 'https://i.pravatar.cc/40?img=15' },
  r11: { avatar: 'https://i.pravatar.cc/40?img=47' },
  r12: { avatar: 'https://i.pravatar.cc/40?img=33' },
  r13: { avatar: 'https://i.pravatar.cc/40?img=25' },
  r14: { avatar: 'https://i.pravatar.cc/40?img=41' },
}

const INITIAL_POSITIONS: Record<string, [number, number]> = {
  r1:  [0,  10],
  r2:  [2,  13],
  r3:  [5,  15],
  r4:  [8,  14],
  r5:  [12, 15],
  r6:  [16, 14],
  r7:  [19, 17],
  r8:  [23, 16],
  r9:  [27, 14],
  r10: [32, 12],
  r11: [36, 10],
  r12: [1,  8],
  r13: [10, 12],
  r14: [22, 10],
}

// @ts-ignore
const MILESTONE_OFFSET = 19

const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
  const d = new Date(VIEW_START)
  d.setDate(d.getDate() + i)
  const dow = d.getDay()
  return {
    offset: i,
    num: d.getDate(),
    isWeekend: dow === 0 || dow === 6,
    isToday: d.toDateString() === TODAY.toDateString(),
    month: d.getMonth(),
  }
})

const monthGroups: { label: string; startOffset: number; count: number }[] = []
for (const day of days) {
  const label = new Date(VIEW_START.getFullYear(), day.month, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const last = monthGroups[monthGroups.length - 1]
  if (!last || last.label !== label) {
    monthGroups.push({ label, startOffset: day.offset, count: 1 })
  } else {
    last.count++
  }
}

// @ts-ignore
const TODAY_OFFSET = Math.floor((TODAY.getTime() - VIEW_START.getTime()) / 86400000)
const TOTAL_WIDTH = TOTAL_DAYS * DAY_WIDTH
const GHOST_LENGTH = 5

function offsetToDate(offset: number): string {
  const d = new Date(VIEW_START)
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const DRAG_THRESHOLD = 3

type DragState = {
  id: string
  type: 'move' | 'resize-right' | 'resize-left'
  startX: number
  startY: number
  origStart: number
  origLen: number
  origRowIndex: number
  captured: boolean
  element: HTMLElement
  pointerId: number
}

type PanState = { startX: number; startScrollLeft: number }

interface TimelinePlaceholderProps {
  data: SpaceRow[]
  parentScrollRef: React.RefObject<HTMLDivElement | null>
  onRowClick?: (row: SpaceRow) => void
  onMoveToRoadmap?: (rowId: string) => void
  showMoveToRoadmap?: boolean
  onBarSelectedChange?: (hasSelection: boolean) => void
  ghostRowId?: string
  onBarPlaced?: (rowId: string, startDate: string, endDate: string) => void
}

export function TimelinePlaceholder({ data, parentScrollRef, onRowClick, onMoveToRoadmap, showMoveToRoadmap, onBarSelectedChange, ghostRowId, onBarPlaced }: TimelinePlaceholderProps) {
  const [positions, setPositions] = useState<Record<string, [number, number]>>(INITIAL_POSITIONS)
  const timelineItems = useMemo(() => data.filter(r => positions[r.id]), [data, positions])
  const ghostRow = ghostRowId ? data.find(r => r.id === ghostRowId && !positions[r.id]) : null
  const [rowOrder, setRowOrder] = useState<string[]>(() => data.filter(r => INITIAL_POSITIONS[r.id]).map(r => r.id))
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragTargetRow, setDragTargetRow] = useState<number | null>(null)
  const [isPanning, setIsPanning] = useState(false)
const [selectedBarId, setSelectedBarId] = useState<string | null>(null)
  const [ghostOffset, setGhostOffset] = useState<number | null>(null)
  const [hoveredBarId, setHoveredBarId] = useState<string | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const panRef = useRef<PanState | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Deselect when clicking outside the timeline
  useEffect(() => {
    if (!selectedBarId) return
    const handleClick = (e: MouseEvent) => {
      if (timelineRef.current && !timelineRef.current.contains(e.target as Node)) {
        setSelectedBarId(null)
        onBarSelectedChange?.(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [selectedBarId, onBarSelectedChange])

  // Compute live display order while dragging (one card per row — swap preview)
  const displayOrder = (() => {
    if (draggingId === null || dragTargetRow === null) return rowOrder
    const from = rowOrder.indexOf(draggingId)
    if (from === dragTargetRow) return rowOrder
    const result = [...rowOrder]
    result.splice(from, 1)
    result.splice(dragTargetRow, 0, draggingId)
    return result
  })()

  const startDrag = (e: React.PointerEvent, id: string, type: DragState['type']) => {
    e.preventDefault()
    e.stopPropagation()
    const [s, l] = positions[id]
    const origRowIndex = rowOrder.indexOf(id)
    dragRef.current = {
      id, type, startX: e.clientX, startY: e.clientY,
      origStart: s, origLen: l, origRowIndex,
      captured: false,
      element: e.currentTarget as HTMLElement,
      pointerId: e.pointerId,
    }
    // Don't capture or set dragging state yet — wait for movement past threshold
  }

  const onPointerMove = (e: React.PointerEvent, id: string) => {
    if (!dragRef.current || dragRef.current.id !== id) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY

    // Wait for movement past threshold before committing to drag
    if (!dragRef.current.captured) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      dragRef.current.captured = true
      dragRef.current.element.setPointerCapture(dragRef.current.pointerId)
      setDraggingId(id)
      setDragTargetRow(dragRef.current.origRowIndex)
    }

    const dd = Math.round(dx / DAY_WIDTH)
    const { origStart, origLen, type, startY: _startY, origRowIndex } = dragRef.current

    // Horizontal position update
    setPositions(prev => {
      if (type === 'move') {
        const s = Math.max(0, Math.min(TOTAL_DAYS - origLen, origStart + dd))
        return { ...prev, [id]: [s, origLen] }
      }
      if (type === 'resize-right') {
        const l = Math.max(1, Math.min(TOTAL_DAYS - origStart, origLen + dd))
        return { ...prev, [id]: [origStart, l] }
      }
      // resize-left: shift start, keep end fixed
      const s = Math.max(0, Math.min(origStart + origLen - 1, origStart + dd))
      const l = origLen - (s - origStart)
      return { ...prev, [id]: [s, l] }
    })

    // Vertical row target (move only)
    if (type === 'move') {
      const dr = Math.round(dy / ROW_HEIGHT)
      const target = Math.max(0, Math.min(rowOrder.length - 1, origRowIndex + dr))
      setDragTargetRow(target)
    }
  }

  const endDrag = (e: React.PointerEvent) => {
    const state = dragRef.current
    if (!state) return

    // Commit row reorder (only if drag actually happened)
    if (state.captured && state.type === 'move' && dragTargetRow !== null && dragTargetRow !== state.origRowIndex) {
      setRowOrder(prev => {
        const from = prev.indexOf(state.id)
        if (from === dragTargetRow) return prev
        const result = [...prev]
        result.splice(from, 1)
        result.splice(dragTargetRow, 0, state.id)
        return result
      })
    }

    // Click (not drag) — toggle selection
    if (!state.captured) {
      const next = selectedBarId === state.id ? null : state.id
      setSelectedBarId(next)
      onBarSelectedChange?.(next !== null)

    }

    dragRef.current = null
    setDraggingId(null)
    setDragTargetRow(null)
    if (state.captured) {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    }
  }

  const onPanStart = (e: React.PointerEvent) => {
    if (dragRef.current || !parentScrollRef.current) return
    panRef.current = { startX: e.clientX, startScrollLeft: parentScrollRef.current.scrollLeft }
    setIsPanning(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPanMove = (e: React.PointerEvent) => {
    if (!panRef.current || !parentScrollRef.current) return
    parentScrollRef.current.scrollLeft = panRef.current.startScrollLeft - (e.clientX - panRef.current.startX)
  }

  const onPanEnd = (e: React.PointerEvent) => {
    if (!panRef.current) return
    panRef.current = null
    setIsPanning(false)
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  return (
    <div
      ref={timelineRef}
      className="item-enter"
      style={{ animationDelay: '80ms', cursor: isPanning ? 'grabbing' : 'default', position: 'relative', width: TOTAL_WIDTH, display: 'flex', flexDirection: 'column', minHeight: `calc(100vh - ${STICKY_TOP}px)` }}
      onPointerDown={(e) => {
        const target = e.target as HTMLElement
        if (target.closest('[data-card-toolbar]')) return
        if (target.closest('[data-ghost-zone]')) return
        onPanStart(e)
        if (!dragRef.current) { setSelectedBarId(null); onBarSelectedChange?.(false) }
      }}
      onPointerMove={onPanMove}
      onPointerUp={onPanEnd}
    >
      {/* Month header — sticky below tabs */}
      <div style={{ position: 'sticky', top: STICKY_TOP, zIndex: 10, background: 'white', display: 'flex', height: MONTH_H, boxShadow: STICKY_GAP_COVER }}>
        {monthGroups.map(mg => (
          <div key={mg.label} style={{ width: mg.count * DAY_WIDTH, padding: '0 16px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#656B81', whiteSpace: 'nowrap' }}>{mg.label}</span>
          </div>
        ))}
      </div>

      {/* Day numbers — sticky below month */}
      <div style={{ position: 'sticky', top: STICKY_TOP + MONTH_H, zIndex: 10, background: 'white', display: 'flex', height: DAYS_H, borderBottom: '1px solid #E9EAEF' }}>
        {days.map(day => (
          <div key={day.offset} style={{ width: DAY_WIDTH, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {day.isToday ? (
              <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1a1b1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'white' }}>
                {day.num}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: '#656b81' }}>{day.num}</span>
            )}
          </div>
        ))}
      </div>

      {/* Grid area — fills viewport, background columns stretch full height */}
      <div ref={gridRef} style={{ position: 'relative', flex: 1, width: TOTAL_WIDTH }}>

        {/* Background columns */}
        {days.map(day => (
          <div key={day.offset} style={{ position: 'absolute', left: day.offset * DAY_WIDTH, top: 0, bottom: 0, width: DAY_WIDTH, backgroundColor: day.isWeekend ? '#F7F7F7' : 'white' }} />
        ))}

        {/* Drop indicator — highlights target row while dragging */}
        {draggingId !== null && dragTargetRow !== null && (
          <div style={{
            position: 'absolute',
            left: 0, width: '100%',
            top: GRID_TOP_OFFSET + (dragTargetRow + (ghostRow ? 1 : 0)) * ROW_HEIGHT,
            height: ROW_HEIGHT,
            backgroundColor: '#F1F2F5',
            borderTop: 'none',
            borderBottom: 'none',
            pointerEvents: 'none',
            zIndex: 1,
          }} />
        )}

        {/* Milestone line — tracks diamond (hidden for now, keeping date highlight) */}
        {/* <div style={{ position: 'absolute', left: (milestoneOffset + 0.5) * DAY_WIDTH, top: 0, bottom: 0, width: 0, borderLeft: '1px dashed #C7CAD5', zIndex: 2, transition: 'left 0.1s ease' }} /> */}

        {/* Ghost bar — unplaced item follows cursor */}
        {ghostRow && (
          <div
            data-ghost-zone
            style={{
              position: 'absolute',
              left: 0,
              top: GRID_TOP_OFFSET,
              width: TOTAL_WIDTH,
              height: ROW_HEIGHT,
              zIndex: 20,
              cursor: 'pointer',
            }}
            onMouseMove={(e) => {
              if (!gridRef.current) return
              const rect = gridRef.current.getBoundingClientRect()
              const x = e.clientX - rect.left
              const barWidthPx = GHOST_LENGTH * DAY_WIDTH
              const centerOffset = Math.floor((x - barWidthPx / 2) / DAY_WIDTH)
              setGhostOffset(Math.max(0, Math.min(TOTAL_DAYS - GHOST_LENGTH, centerOffset)))
            }}
            onClick={() => {
              if (ghostOffset === null) return
              setPositions(prev => ({ ...prev, [ghostRow.id]: [ghostOffset, GHOST_LENGTH] }))
              setRowOrder(prev => [ghostRow.id, ...prev])
              setGhostOffset(null)
              onBarPlaced?.(ghostRow.id, offsetToDate(ghostOffset), offsetToDate(ghostOffset + GHOST_LENGTH))
            }}
          >
            {/* Visual ghost bar */}
            <div style={{
              position: 'absolute',
              left: (ghostOffset ?? Math.floor(TOTAL_DAYS / 2 - GHOST_LENGTH / 2)) * DAY_WIDTH,
              top: (ROW_HEIGHT - BAR_HEIGHT) / 2,
              width: GHOST_LENGTH * DAY_WIDTH - 4,
              height: BAR_HEIGHT,
              backgroundColor: 'white',
              border: '1px dashed #C7CAD5',
              borderRadius: 4,
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              pointerEvents: 'none',
              transition: 'left 0.05s ease',
            }}>
              <span style={{ fontSize: 14, color: '#222428', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ghostRow.title}
              </span>
            </div>
            {/* Date tooltip above ghost */}
            {ghostOffset !== null && (
              <div style={{
                position: 'absolute',
                left: (ghostOffset + GHOST_LENGTH / 2) * DAY_WIDTH,
                top: (ROW_HEIGHT - BAR_HEIGHT) / 2 - 6,
                transform: 'translateX(-50%) translateY(-100%)',
                backgroundColor: '#2B2D33', color: 'white', fontSize: 11, fontWeight: 500,
                padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap', pointerEvents: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}>
                {offsetToDate(ghostOffset)} – {offsetToDate(ghostOffset + GHOST_LENGTH)}
              </div>
            )}
          </div>
        )}

        {/* Timeline bars */}
        {timelineItems.map(row => {
          const rowIndex = displayOrder.indexOf(row.id) + (ghostRow ? 1 : 0)
          const [startOff, len] = positions[row.id]
          const person = PEOPLE[row.id] ?? { avatar: 'https://i.pravatar.cc/40?img=1' }
          const isDragging = draggingId === row.id
          const isMove = isDragging && dragRef.current?.type === 'move'
          const isBarSelected = selectedBarId === row.id && !isDragging

          return (
            <div
              key={row.id}
              style={{
                position: 'absolute',
                left: startOff * DAY_WIDTH,
                top: GRID_TOP_OFFSET + rowIndex * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2,
                width: len * DAY_WIDTH - 4,
                height: BAR_HEIGHT,
                backgroundColor: (PRIORITY_BAR_COLORS[row.priority] ?? DEFAULT_BAR_COLOR).bg,
                border: `1px solid ${(PRIORITY_BAR_COLORS[row.priority] ?? DEFAULT_BAR_COLOR).border}`,
                borderRadius: 8,
                boxShadow: isDragging ? '0px 8px 20px rgba(34,36,40,0.16)' : '0px 2px 4px rgba(34,36,40,0.08)',
                outline: isBarSelected ? '3px solid #3859FF' : 'none',
                outlineOffset: isBarSelected ? 4 : 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: `0 ${HANDLE_W + 4}px`,
                overflow: 'hidden',
                zIndex: isDragging ? 10 : isBarSelected ? 50 : 3,
                cursor: isMove ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: isDragging ? 'none' : 'top 0.15s ease, box-shadow 0.15s ease, outline 150ms ease, outline-offset 150ms ease',
              }}
              onPointerDown={e => startDrag(e, row.id, 'move')}
              onPointerMove={e => onPointerMove(e, row.id)}
              onPointerUp={e => endDrag(e)}
              onMouseEnter={() => setHoveredBarId(row.id)}
              onMouseLeave={() => setHoveredBarId(prev => prev === row.id ? null : prev)}
            >
              {/* Left resize handle */}
              <div
                style={{ position: 'absolute', left: 0, top: 0, width: HANDLE_W + 4, height: '100%', cursor: 'ew-resize', zIndex: 1 }}
                onPointerDown={e => startDrag(e, row.id, 'resize-left')}
                onPointerMove={e => onPointerMove(e, row.id)}
                onPointerUp={e => endDrag(e)}
              >
                <div style={{
                  position: 'absolute', left: 4, top: 8, bottom: 8, width: 4, borderRadius: 9999,
                  backgroundColor: (PRIORITY_BAR_COLORS[row.priority] ?? DEFAULT_BAR_COLOR).border,
                  opacity: (hoveredBarId === row.id || isBarSelected) ? 1 : 0,
                  transform: (hoveredBarId === row.id || isBarSelected) ? 'scaleY(1)' : 'scaleY(0.3)',
                  transition: (hoveredBarId === row.id || isBarSelected)
                    ? 'opacity 120ms ease-out, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'opacity 200ms ease-in, transform 200ms ease-in',
                }} />
              </div>

              <img src={person.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
              <img src={JIRA_LOGO} alt="Jira" style={{ width: 16, height: 16, flexShrink: 0, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, color: (PRIORITY_BAR_COLORS[row.priority] ?? DEFAULT_BAR_COLOR).text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {row.title}
              </span>

              {/* Date tooltip while dragging */}
              {isDragging && (
                <div style={{
                  position: 'absolute', bottom: BAR_HEIGHT + 6, left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: '#2B2D33', color: 'white', fontSize: 11, fontWeight: 500,
                  padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap', pointerEvents: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}>
                  {offsetToDate(startOff)} – {offsetToDate(startOff + len)}
                </div>
              )}

              {/* Right resize handle */}
              <div
                style={{ position: 'absolute', right: 0, top: 0, width: HANDLE_W + 4, height: '100%', cursor: 'ew-resize', zIndex: 1 }}
                onPointerDown={e => startDrag(e, row.id, 'resize-right')}
                onPointerMove={e => onPointerMove(e, row.id)}
                onPointerUp={e => endDrag(e)}
              >
                <div style={{
                  position: 'absolute', right: 4, top: 8, bottom: 8, width: 4, borderRadius: 9999,
                  backgroundColor: (PRIORITY_BAR_COLORS[row.priority] ?? DEFAULT_BAR_COLOR).border,
                  opacity: (hoveredBarId === row.id || isBarSelected) ? 1 : 0,
                  transform: (hoveredBarId === row.id || isBarSelected) ? 'scaleY(1)' : 'scaleY(0.3)',
                  transition: (hoveredBarId === row.id || isBarSelected)
                    ? 'opacity 120ms ease-out, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'opacity 200ms ease-in, transform 200ms ease-in',
                }} />
              </div>
            </div>
          )
        })}

        {/* Contextual toolbar — rendered outside bar DOM to avoid pointer event conflicts */}
        {selectedBarId && !draggingId && (() => {
          const selectedRow = timelineItems.find(r => r.id === selectedBarId)
          if (!selectedRow) return null
          const [sOff, sLen] = positions[selectedBarId]
          const sRowIndex = displayOrder.indexOf(selectedBarId) + (ghostRow ? 1 : 0)
          const barTop = GRID_TOP_OFFSET + sRowIndex * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2
          const barLeft = sOff * DAY_WIDTH
          const barWidth = sLen * DAY_WIDTH - 4
          return (
            <div
              data-card-toolbar
              style={{
                position: 'absolute',
                left: barLeft,
                top: barTop,
                width: barWidth,
                height: BAR_HEIGHT,
                zIndex: 100,
                pointerEvents: 'none',
              }}
            >
              <KanbanCardToolbar
                onOpenSidePanel={() => onRowClick?.(selectedRow)}
                onMoveToRoadmap={showMoveToRoadmap && onMoveToRoadmap ? () => { onMoveToRoadmap(selectedRow.id); setSelectedBarId(null); onBarSelectedChange?.(false) } : undefined}
                cardColor={(PRIORITY_BAR_COLORS[selectedRow.priority] ?? DEFAULT_BAR_COLOR).bg}
              />
            </div>
          )
        })()}

        {/* Milestone diamond (hidden for now, keeping date highlight) */}
        {/* <div style={{
          position: 'absolute',
          left: milestoneOffset * DAY_WIDTH + DAY_WIDTH / 2 - 16,
          top: 3 * ROW_HEIGHT + ROW_HEIGHT / 2 - 16,
          width: 32, height: 32, transform: 'rotate(45deg)',
          backgroundColor: 'white', border: '1px solid #C7CAD5', borderRadius: 5,
          boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
          pointerEvents: 'none',
          transition: 'left 0.1s ease',
        }}>
          <div style={{ width: 16, height: 16, borderRadius: 2, backgroundColor: '#4262FF' }} />
        </div> */}

      </div>
    </div>
  )
}
