import { useState, useRef, useCallback } from 'react'
import {
  IconHeart,
  IconFlag,
  IconExclamationPointCircle,
  IconStarFilled,
  Chip,
} from '@mirohq/design-system'

export interface FeedbackCardData {
  title: string
  text: string
  author: string
  date: string
  companies: string[]
  borderColor: string
  stars?: number
}

interface CanvasFeedbackCardProps {
  data: FeedbackCardData
  panX: number
  panY: number
  zoom: number
  x: number
  y: number
  isOpen: boolean
  selected: boolean
  onSelect: () => void
  onMove: (x: number, y: number) => void
  smoothPanning: boolean
}

const DRAG_THRESHOLD = 3

function CardIcon({ borderColor }: { borderColor: string }) {
  if (borderColor === '#d4bbff') return <IconFlag css={{ width: 25, height: 25 }} />
  if (borderColor === '#ffd4b2') return <IconExclamationPointCircle css={{ width: 25, height: 25 }} />
  return <IconHeart css={{ width: 25, height: 25 }} />
}

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

export function CanvasFeedbackCard({
  data,
  panX,
  panY,
  zoom,
  x,
  y,
  isOpen,
  selected,
  onSelect,
  onMove,
  smoothPanning,
}: CanvasFeedbackCardProps) {
  const [widgetX, setWidgetX] = useState(x)
  const [widgetY, setWidgetY] = useState(y)
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
          width: 320,
          pointerEvents: isOpen ? 'auto' : 'none',
          cursor: selected ? 'grab' : 'default',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={e => e.stopPropagation()}
      >
        {selected && <SelectionBorder />}

        <div
          className="bg-white rounded-xl flex flex-col gap-2 p-5"
          style={{ border: `2px solid ${data.borderColor}`, borderBottomWidth: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <CardIcon borderColor={data.borderColor} />
            <span className="text-[12px] text-[#959AAC] leading-[1.5]">{data.date}</span>
          </div>

          {/* Stars */}
          {data.stars && (
            <div className="flex gap-0.5">
              {Array.from({ length: data.stars }).map((_, i) => (
                <IconStarFilled key={i} css={{ width: 12, height: 12 }} />
              ))}
            </div>
          )}

          {/* Text */}
          <p
            className="text-[12px] text-[#222428] leading-[1.5]"
            style={{
              fontVariationSettings: "'CTGR' 0, 'wdth' 100",
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {data.text}
          </p>

          {/* Author */}
          <p className="text-[12px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            {data.author}
          </p>

          {/* Companies */}
          <div className="flex flex-wrap gap-2 pt-1">
            {data.companies.map(name => (
              <Chip key={name} removable={false} css={{ fontSize: 14 }}>{name}</Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
