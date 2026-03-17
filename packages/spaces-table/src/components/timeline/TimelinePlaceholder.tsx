import { useState, useRef } from 'react'
import { roadmapData } from '@spaces/shared'
import type { SpaceRow } from '@spaces/shared'
const JIRA_LOGO = 'https://www.figma.com/api/mcp/asset/f169e443-27f1-401b-994d-4f720c63f0c7'

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
const TODAY = new Date(2026, 2, 15)
const TOTAL_DAYS = 46

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

const TODAY_OFFSET = Math.floor((TODAY.getTime() - VIEW_START.getTime()) / 86400000)
const timelineItems = roadmapData.filter(r => INITIAL_POSITIONS[r.id])
const GRID_HEIGHT = timelineItems.length * ROW_HEIGHT
const TOTAL_WIDTH = TOTAL_DAYS * DAY_WIDTH

function offsetToDate(offset: number): string {
  const d = new Date(VIEW_START)
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

type DragState = {
  id: string
  type: 'move' | 'resize-right' | 'resize-left'
  startX: number
  startY: number
  origStart: number
  origLen: number
  origRowIndex: number
}

type PanState = { startX: number; startScrollLeft: number }

interface TimelinePlaceholderProps {
  parentScrollRef: React.RefObject<HTMLDivElement | null>
  onRowClick?: (row: SpaceRow, dates: { startDate: string; endDate: string }) => void
  onJiraRowClick?: (row: SpaceRow) => void
}

export function TimelinePlaceholder({ parentScrollRef, onRowClick, onJiraRowClick }: TimelinePlaceholderProps) {
  const [positions, setPositions] = useState<Record<string, [number, number]>>(INITIAL_POSITIONS)
  const [rowOrder, setRowOrder] = useState<string[]>(() => timelineItems.map(r => r.id))
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragTargetRow, setDragTargetRow] = useState<number | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [milestoneOffset, setMilestoneOffset] = useState(MILESTONE_OFFSET)
  const dragRef = useRef<DragState | null>(null)
  const panRef = useRef<PanState | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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

  const onGridMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current || dragRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const day = Math.max(0, Math.min(TOTAL_DAYS - 1, Math.floor(x / DAY_WIDTH)))
    setMilestoneOffset(day)
  }

  const startDrag = (e: React.PointerEvent, id: string, type: DragState['type']) => {
    e.preventDefault()
    e.stopPropagation()
    const [s, l] = positions[id]
    const origRowIndex = rowOrder.indexOf(id)
    dragRef.current = { id, type, startX: e.clientX, startY: e.clientY, origStart: s, origLen: l, origRowIndex }
    setDraggingId(id)
    setDragTargetRow(origRowIndex)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent, id: string) => {
    if (!dragRef.current || dragRef.current.id !== id) return
    const dx = e.clientX - dragRef.current.startX
    const dd = Math.round(dx / DAY_WIDTH)
    const { origStart, origLen, type, startY, origRowIndex } = dragRef.current

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
      const dy = e.clientY - startY
      const dr = Math.round(dy / ROW_HEIGHT)
      const target = Math.max(0, Math.min(rowOrder.length - 1, origRowIndex + dr))
      setDragTargetRow(target)
    }
  }

  const endDrag = (e: React.PointerEvent, row?: SpaceRow) => {
    const state = dragRef.current
    const wasDrag = state && (Math.abs(e.clientX - state.startX) > 4 || Math.abs(e.clientY - state.startY) > 4)

    // Commit row reorder
    if (state?.type === 'move' && dragTargetRow !== null && dragTargetRow !== state.origRowIndex) {
      setRowOrder(prev => {
        const from = prev.indexOf(state.id)
        if (from === dragTargetRow) return prev
        const result = [...prev]
        result.splice(from, 1)
        result.splice(dragTargetRow, 0, state.id)
        return result
      })
    }

    dragRef.current = null
    setDraggingId(null)
    setDragTargetRow(null)
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)

    if (!wasDrag && row) {
      if (JIRA_ITEMS.has(row.id)) {
        onJiraRowClick?.(row)
      } else {
        const [startOff, len] = positions[row.id]
        onRowClick?.(row, { startDate: offsetToDate(startOff), endDate: offsetToDate(startOff + len) })
      }
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
      className="item-enter"
      style={{ animationDelay: '80ms', cursor: isPanning ? 'grabbing' : 'default', position: 'relative', width: TOTAL_WIDTH, display: 'flex', flexDirection: 'column', minHeight: `calc(100vh - ${STICKY_TOP}px)` }}
      onPointerDown={onPanStart}
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
        {days.map(day => {
          const isMilestone = day.offset === milestoneOffset
          return (
            <div key={day.offset} style={{ width: DAY_WIDTH, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isMilestone ? (
                <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1a1b1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#f7f7f7' }}>
                  {day.num}
                </span>
              ) : day.isToday ? (
                <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#333' }}>
                  {day.num}
                </span>
              ) : (
                <span style={{ fontSize: 12, color: '#656b81' }}>{day.num}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Grid area — fills viewport, background columns stretch full height */}
      <div ref={gridRef} onMouseMove={onGridMouseMove} style={{ position: 'relative', flex: 1, width: TOTAL_WIDTH }}>

        {/* Background columns */}
        {days.map(day => (
          <div key={day.offset} style={{ position: 'absolute', left: day.offset * DAY_WIDTH, top: 0, bottom: 0, width: DAY_WIDTH, backgroundColor: day.isWeekend ? '#F7F7F7' : 'white' }} />
        ))}

        {/* Drop indicator — highlights target row while dragging */}
        {draggingId !== null && dragTargetRow !== null && (
          <div style={{
            position: 'absolute',
            left: 0, width: '100%',
            top: dragTargetRow * ROW_HEIGHT,
            height: ROW_HEIGHT,
            backgroundColor: '#F1F2F5',
            borderTop: 'none',
            borderBottom: 'none',
            pointerEvents: 'none',
            zIndex: 1,
          }} />
        )}

        {/* Milestone line — tracks diamond */}
        <div style={{ position: 'absolute', left: (milestoneOffset + 0.5) * DAY_WIDTH, top: 0, bottom: 0, width: 0, borderLeft: '1px dashed #C7CAD5', zIndex: 2, transition: 'left 0.1s ease' }} />

        {/* Timeline bars */}
        {timelineItems.map(row => {
          const rowIndex = displayOrder.indexOf(row.id)
          const [startOff, len] = positions[row.id]
          const person = PEOPLE[row.id] ?? { avatar: 'https://i.pravatar.cc/40?img=1' }
          const isDragging = draggingId === row.id
          const isMove = isDragging && dragRef.current?.type === 'move'

          return (
            <div
              key={row.id}
              style={{
                position: 'absolute',
                left: startOff * DAY_WIDTH,
                top: rowIndex * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2,
                width: len * DAY_WIDTH - 4,
                height: BAR_HEIGHT,
                backgroundColor: 'white',
                border: '1px solid #C7CAD5',
                borderRadius: 4,
                boxShadow: isDragging ? '0px 8px 20px rgba(34,36,40,0.16)' : '0px 2px 4px rgba(34,36,40,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: `0 ${HANDLE_W + 4}px`,
                overflow: 'hidden',
                zIndex: isDragging ? 10 : 3,
                cursor: isMove ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: isDragging ? 'none' : 'top 0.15s ease, box-shadow 0.15s ease',
              }}
              onPointerDown={e => startDrag(e, row.id, 'move')}
              onPointerMove={e => onPointerMove(e, row.id)}
              onPointerUp={e => endDrag(e, row)}
            >
              {/* Left resize handle */}
              <div
                style={{ position: 'absolute', left: 0, top: 0, width: HANDLE_W, height: '100%', cursor: 'ew-resize', zIndex: 1 }}
                onPointerDown={e => startDrag(e, row.id, 'resize-left')}
                onPointerMove={e => onPointerMove(e, row.id)}
                onPointerUp={e => endDrag(e)}
              />

              <img src={person.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
              <img src={JIRA_LOGO} alt="Jira" style={{ width: 16, height: 16, flexShrink: 0, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, color: '#222428', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
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
                style={{ position: 'absolute', right: 0, top: 0, width: HANDLE_W, height: '100%', cursor: 'ew-resize', zIndex: 1 }}
                onPointerDown={e => startDrag(e, row.id, 'resize-right')}
                onPointerMove={e => onPointerMove(e, row.id)}
                onPointerUp={e => endDrag(e)}
              />
            </div>
          )
        })}

        {/* Milestone diamond */}
        <div style={{
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
        </div>

      </div>
    </div>
  )
}
