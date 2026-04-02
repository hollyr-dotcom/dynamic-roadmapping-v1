import { useState, useRef, useCallback } from 'react'
import {
  IconHeart,
  IconFlag,
  IconStarFilled,
  IconHeadphones,
  IconCalendarBlank,
  Chip,
} from '@mirohq/design-system'

function IconUserTickDown({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 19c0-3.314 3.134-6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 15l4 4M19 15l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export interface FeedbackCardData {
  title: string
  text: string
  author: string
  date: string
  companies: string[]
  borderColor: string
  stars?: number
  cardStyle?: 'figma'
  cardType?: 'praise' | 'request' | 'problem'
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
  if (borderColor === '#ffd4b2') return <IconUserTickDown size={29} />
  return <IconHeart css={{ width: 25, height: 25 }} />
}

function ThumbsIcons({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        display: 'flex',
        gap: 4,
        opacity: visible ? 1 : 0,
        transition: 'opacity 150ms ease',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 2,
      }}
    >
      <button
        onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e2e8', borderRadius: 4, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 14H3a1 1 0 01-1-1V8a1 1 0 011-1h2m5-3V3a2 2 0 00-2-2L7 7l-2 1v6h7.5a1 1 0 001-.76l.75-4A1 1 0 0013.25 8H10V4a1 1 0 00-1-1z" stroke="#656B81" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e2e8', borderRadius: 4, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2h2a1 1 0 011 1v5a1 1 0 01-1 1h-2M6 11v2a2 2 0 002 2l3-6 2-1V2H6.5a1 1 0 00-1 .76l-.75 4A1 1 0 005.75 8H9v3a1 1 0 01-1 1z" stroke="#656B81" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
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
  const [isHovered, setIsHovered] = useState(false)
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {selected && <SelectionBorder />}

        {data.cardStyle === 'figma' ? (
          /* Figma sticky-note style */
          <div
            className="flex flex-col rounded-[16px] overflow-clip"
            style={{ backgroundColor: '#ffdc4a', paddingBottom: 6, paddingTop: 2, paddingLeft: 2, paddingRight: 2, fontFamily: 'Open Sans, sans-serif' }}
          >
            <div className="bg-white rounded-[16px] flex flex-col" style={{ gap: 0, position: 'relative' }}>
              <div className="flex flex-col gap-2" style={{ paddingLeft: 16, paddingRight: 20, paddingTop: 16, paddingBottom: 8 }}>
                <span style={{ color: data.cardType === 'request' ? '#5E4DB2' : data.cardType === 'problem' ? '#FF8F00' : '#de350b', display: 'flex' }}>
                  {data.cardType === 'request' ? <IconFlag css={{ width: 20, height: 20 }} />
                    : data.cardType === 'problem' ? <IconUserTickDown size={24} />
                    : <IconHeart css={{ width: 20, height: 20 }} />}
                </span>
                <p
                  className="text-[14px] text-[#222428] leading-[1.4]"
                  style={{
                    fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  "{data.text}"
                </p>
                <p className="text-[12px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                  {data.author}
                </p>
              </div>
              <div style={{ height: 1, backgroundColor: '#E9EAEF', margin: '0 12px' }} />
              <div className="flex items-center gap-2 flex-wrap" style={{ paddingLeft: 16, paddingRight: 12, paddingTop: 8, paddingBottom: 12 }}>
                <div className="flex items-center justify-center rounded" style={{ backgroundColor: '#F1F2F5', width: 28, height: 28 }}>
                  <IconHeadphones css={{ width: 16, height: 16, color: '#656B81' }} />
                </div>
                <div className="flex items-center gap-1 rounded" style={{ backgroundColor: '#F1F2F5', height: 28, paddingLeft: 6, paddingRight: 8 }}>
                  <IconCalendarBlank css={{ width: 14, height: 14, color: '#656B81' }} />
                  <span className="text-[13px] text-[#333]">{data.date}</span>
                </div>
                {data.companies.slice(0, 2).map(name => (
                  <div key={name} className="flex items-center rounded" style={{ backgroundColor: '#F1F2F5', height: 28, paddingLeft: 8, paddingRight: 8 }}>
                    <span className="text-[13px] text-[#333]">{name}</span>
                  </div>
                ))}
              </div>
              <ThumbsIcons visible={isHovered} />
            </div>
          </div>
        ) : (
          /* Classic feedback card style */
          <div
            className="bg-white rounded-xl flex flex-col gap-2 p-5"
            style={{ border: `2px solid ${data.borderColor}`, fontFamily: 'Open Sans, sans-serif', position: 'relative' }}
          >
            <div className="flex items-start gap-2">
              {data.borderColor === '#d4bbff' && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4262FF', flexShrink: 0, marginTop: 4 }} />
              )}
              <CardIcon borderColor={data.borderColor} />
              <span className="text-[12px] text-[#959AAC] leading-[1.5]">{data.date}</span>
            </div>
            {data.stars && (
              <div className="flex gap-0.5">
                {Array.from({ length: data.stars }).map((_, i) => (
                  <IconStarFilled key={i} css={{ width: 12, height: 12 }} />
                ))}
              </div>
            )}
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
            <p className="text-[12px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
              {data.author}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.companies.map(name => (
                <Chip key={name} removable={false} css={{ fontSize: 14 }}>{name}</Chip>
              ))}
            </div>
            <ThumbsIcons visible={isHovered} />
          </div>
        )}
      </div>
    </div>
  )
}
