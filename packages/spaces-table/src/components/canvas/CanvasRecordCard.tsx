import { useState, useRef, useCallback, useEffect } from 'react'
import type { SpaceRow, FieldDefinition, Priority } from '@spaces/shared'
import { Tooltip } from '@mirohq/design-system'
import { JiraLogo } from '../JiraLogo'
import { CompanyLogo } from '../CompanyLogo'

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
  const [animatePosition, setAnimatePosition] = useState(false)

  // Sync position when widget props change (e.g. repositioning on PRD flow)
  useEffect(() => {
    if (widget.y !== widgetY || widget.x !== widgetX) {
      setAnimatePosition(true)
      setWidgetX(widget.x)
      setWidgetY(widget.y)
      const timer = setTimeout(() => setAnimatePosition(false), 600)
      return () => clearTimeout(timer)
    }
  }, [widget.x, widget.y])

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
          animation: isOpen ? 'card-enter 450ms cubic-bezier(0.16,1,0.3,1) 200ms both' : undefined,
          transition: animatePosition ? 'top 600ms cubic-bezier(0.16,1,0.3,1), left 600ms cubic-bezier(0.16,1,0.3,1)' : undefined,
          pointerEvents: 'auto',
          cursor: selected ? 'grab' : 'default',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {selected && <SelectionBorder />}
        <div
          data-record-card-id={widget.id}
          className="rounded-lg bg-white overflow-hidden"
          style={{
            border: `1.5px solid ${borderColor}`,
            borderBottomWidth: 6,
            boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
            borderRadius: 8,
          }}
        >
          {/* Card content */}
          <div className="px-4 py-3">
            <p
              className="font-body text-sm font-normal text-[#222428] leading-snug m-0 overflow-hidden"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
            >
              {row.title}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {cardFields.filter(field => field.id !== 'description').map(field => {
                const value = row[field.id as keyof SpaceRow]
                if (field.type === 'jiraId') {
                  if (!value) return null
                  return (
                    <span key={field.id} className="inline-flex items-center gap-1.5 font-body text-[#222428] rounded whitespace-nowrap min-w-0" style={{ fontSize: 12, height: 26, padding: '4px 8px', backgroundColor: '#F1F2F5', maxWidth: '100%' }}>
                      <JiraLogo size={14} />
                      <span className="truncate">{String(value)}</span>
                    </span>
                  )
                }
                if (field.type === 'avatars') return null
                let displayText: string
                switch (field.type) {
                  case 'currency': displayText = (value as number) === 0 ? '—' : `$${value}K`; break
                  case 'number': displayText = (value as number).toLocaleString(); break
                  default: displayText = String(value)
                }
                return (
                  <span key={field.id} className="inline-flex items-center gap-1.5 font-body text-[#222428] rounded whitespace-nowrap min-w-0" style={{ fontSize: 12, height: 26, padding: '4px 8px', backgroundColor: '#F1F2F5', maxWidth: '100%' }}>
                    <span className="text-[#656B81] shrink-0">{field.label}</span>
                    <span className="truncate">{displayText}</span>
                  </span>
                )
              })}
              {row.companies.length > 0 && (
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    <span className="inline-flex items-center rounded whitespace-nowrap" style={{ height: 26, padding: '0 8px', backgroundColor: '#F1F2F5', gap: 6 }}>
                      {row.companies.slice(0, 3).map(name => (
                        <CompanyLogo key={name} name={name} size={12} inline />
                      ))}
                      {row.companies.length > 3 && (
                        <span className="font-body text-[#656B81]" style={{ fontSize: 12, marginLeft: 2 }}>+{row.companies.length - 3}</span>
                      )}
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top" sideOffset={4}>
                    {row.companies.length} {row.companies.length === 1 ? 'company' : 'companies'}
                  </Tooltip.Content>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Source bar */}
          {row.jiraKey && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px 10px',
            }}>
              <JiraLogo size={20} />
              <span style={{
                fontSize: 12,
                fontFamily: "'Noto Sans', sans-serif",
                color: '#656B81',
                lineHeight: 1.4,
              }}>
                FlexFund
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
