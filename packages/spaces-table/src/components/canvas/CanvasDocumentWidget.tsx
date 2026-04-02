import { useState, useRef, useCallback, useEffect } from 'react'
import { IconButton, IconTrash } from '@mirohq/design-system'
import type { DocumentContent } from './generatePRD'

const DRAG_THRESHOLD = 3
const SECTION_DELAY = 1200
const INITIAL_DELAY = 1500

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

interface CanvasDocumentWidgetProps {
  widget: {
    id: string
    x: number
    y: number
    documentContent?: DocumentContent
  }
  panX: number
  panY: number
  zoom: number
  isOpen: boolean
  selected: boolean
  onSelect: () => void
  onMove: (x: number, y: number) => void
  smoothPanning: boolean
  onStreamingChange?: (streaming: boolean, progress: number) => void
  onKeep?: () => void
  onScrap?: () => void
  externalAccepted?: boolean
}

const AI_BORDER_COLOR = '#68d3f8'
const AI_BOX_SHADOW = '-4px -4px 24px 2px rgba(156,230,255,0.16), 4px -4px 24px 2px rgba(56,89,255,0.16), -4px 4px 24px 2px rgba(184,172,251,0.16), 4px 4px 24px 2px rgba(253,154,231,0.16)'

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="3" width="10" height="10" rx="1.5" />
    </svg>
  )
}

function DocToolbar({ state, onStop, onKeep, onScrap, zoom = 1, docWidth = 600 }: { state: 'generating' | 'done'; onStop?: () => void; onKeep?: () => void; onScrap?: () => void; zoom?: number; docWidth?: number }) {
  const scale = 1 / zoom
  const toolbarH = state === 'generating' ? 40 : 48
  // Position the toolbar centered above the doc at native (unscaled) size
  // We use a wrapper at the doc's center, then scale from there
  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: -((24 + toolbarH) / zoom), // 24px gap + toolbar height, in world coords
    left: docWidth / 2,
    transform: `translateX(-50%) scale(${scale})`,
    transformOrigin: 'bottom center',
    pointerEvents: 'auto',
    zIndex: 1,
  }

  const stopPropagation = (e: React.PointerEvent | React.MouseEvent) => e.stopPropagation()

  if (state === 'generating') {
    return (
      <div style={wrapperStyle} onPointerDown={stopPropagation} onPointerUp={stopPropagation} onClick={stopPropagation}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 40,
            paddingLeft: 16,
            paddingRight: 8,
            borderRadius: 8,
            background: '#2b2d33',
            boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
            animation: 'item-enter 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: '#c7cad5', whiteSpace: 'nowrap', fontFamily: "var(--font-noto)" }}>
            Generating...
          </span>
          <div style={{ paddingLeft: 16 }}>
            <div
              onClick={onStop}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                cursor: 'pointer',
                color: '#c7cad5',
              }}
            >
              <StopIcon />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapperStyle} onPointerDown={stopPropagation} onPointerUp={stopPropagation} onClick={stopPropagation}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 48,
          padding: 8,
          borderRadius: 8,
          background: '#fff',
          border: '0.5px solid #e9eaef',
          boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
          animation: 'item-enter 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        <div
          onClick={onKeep}
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 8,
            background: '#4262FF',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-noto)",
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Add to board
        </div>
        <IconButton aria-label="Discard" variant="ghost" size="medium" onPress={onScrap}>
          <IconTrash />
        </IconButton>
      </div>
    </div>
  )
}

export function CanvasDocumentWidget({
  widget,
  panX,
  panY,
  zoom,
  isOpen,
  selected,
  onSelect,
  onMove,
  smoothPanning,
  onStreamingChange,
  onKeep,
  onScrap,
  externalAccepted,
}: CanvasDocumentWidgetProps) {
  const content = widget.documentContent
  if (!content) return null

  const [widgetX, setWidgetX] = useState(widget.x)
  const [widgetY, setWidgetY] = useState(widget.y)
  const dragging = useRef(false)
  const dragStarted = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  const [visibleSections, setVisibleSections] = useState(0)
  const [showLinks, setShowLinks] = useState(false)
  const [isStreaming, setIsStreaming] = useState(true)
  const [accepted, setAccepted] = useState(false)
  const isAccepted = accepted || !!externalAccepted
  const showAiBorder = !isAccepted

  useEffect(() => {
    if (!content) return
    const totalSections = content.sections.length
    const totalSteps = totalSections + 1 // +1 for links
    let count = 0

    onStreamingChange?.(true, 0)

    const initialTimer = setTimeout(() => {
      count = 1
      setVisibleSections(1)
      onStreamingChange?.(true, count / totalSteps)

      const interval = setInterval(() => {
        count++
        if (count <= totalSections) {
          setVisibleSections(count)
          onStreamingChange?.(true, count / totalSteps)
        } else {
          setShowLinks(true)
          setIsStreaming(false)
          onStreamingChange?.(false, 1)
          clearInterval(interval)
        }
      }, SECTION_DELAY)
      return () => clearInterval(interval)
    }, INITIAL_DELAY)
    return () => clearTimeout(initialTimer)
  }, [content])

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
          width: 600,
          pointerEvents: 'auto',
          cursor: selected ? 'grab' : 'default',
          animation: isOpen ? 'card-enter 450ms cubic-bezier(0.16,1,0.3,1) 100ms both' : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {selected && <SelectionBorder />}
        {/* AI toolbar above document */}
        {showAiBorder && (
          <DocToolbar
            state={isStreaming ? 'generating' : 'done'}
            zoom={zoom}
            onStop={() => { setIsStreaming(false); onStreamingChange?.(false, 1) }}
            onKeep={() => { setAccepted(true); onKeep?.() }}
            onScrap={onScrap}
          />
        )}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: showAiBorder ? AI_BOX_SHADOW : '0px 2px 8px rgba(34,36,40,0.12), 0px 0px 12px rgba(34,36,40,0.04)',
            border: showAiBorder ? `1px solid ${AI_BORDER_COLOR}` : '1px solid transparent',
            overflow: 'hidden',
            minHeight: 848, // A4 proportions at 600px wide (600 * 1.414)
            transition: 'box-shadow 500ms cubic-bezier(0.16,1,0.3,1), border-color 500ms cubic-bezier(0.16,1,0.3,1), min-height 600ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Header */}
          <div style={{ padding: '44px 48px 0' }}>
            <h2 style={{
              margin: 0,
              fontSize: 24,
              fontFamily: "'Roobert PRO', sans-serif",
              fontWeight: 600,
              color: '#222428',
              lineHeight: 1.3,
            }}>
              {content.title}
            </h2>
          </div>

          {/* Sections */}
          <div style={{ padding: '24px 48px 48px' }}>
            {content.sections.slice(0, visibleSections).map((section, i) => (
              <div
                key={i}
                style={{
                  marginTop: i === 0 ? 0 : 28,
                  animation: 'doc-section-in 400ms ease-out',
                }}
              >
                <h3 style={{
                  margin: '0 0 8px',
                  fontSize: 18,
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: 600,
                  color: '#222428',
                  lineHeight: 1.4,
                }}>
                  {section.heading}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: 16,
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: 400,
                  color: '#444',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {section.body}
                </p>
              </div>
            ))}

            {/* Links */}
            {showLinks && content.links.length > 0 && (
              <div style={{
                marginTop: 32,
                paddingTop: 20,
                borderTop: '1px solid #E9EAEF',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                animation: 'doc-section-in 400ms ease-out',
              }}>
                <h3 style={{
                  margin: '0 0 4px',
                  fontSize: 18,
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: 600,
                  color: '#222428',
                  lineHeight: 1.4,
                }}>
                  Resources
                </h3>
                {content.links.map((link, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 16,
                      fontFamily: "'Noto Sans', sans-serif",
                      color: '#4262FF',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
