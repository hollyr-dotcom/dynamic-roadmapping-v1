import { useRef, useEffect, useState } from 'react'

interface CanvasConnectionLineProps {
  fromX: number
  fromY: number
  fromWidth: number
  fromHeight: number
  toX: number
  toY: number
  toHeight: number
  panX: number
  panY: number
  zoom: number
  isOpen: boolean
  smoothPanning: boolean
}

export function CanvasConnectionLine({
  fromX,
  fromY,
  fromWidth,
  fromHeight,
  toX,
  toY,
  toHeight,
  panX,
  panY,
  zoom,
  isOpen,
  smoothPanning,
}: CanvasConnectionLineProps) {
  // Start: right-centre of source widget
  const x1 = fromX + fromWidth
  const y1 = fromY + fromHeight / 2

  // End: left-centre of target widget
  const x2 = toX
  const y2 = toY + toHeight / 2

  // Control points for a smooth horizontal S-curve
  const gap = x2 - x1
  const cpOffset = Math.max(gap * 0.5, 40)

  const pathD = `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`
  const pathRef = useRef<SVGPathElement>(null)
  const [lineLength, setLineLength] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      setLineLength(pathRef.current.getTotalLength())
    }
  }, [pathD])

  return (
    <svg
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 65,
        opacity: isOpen ? 1 : 0,
        transition: smoothPanning
          ? 'opacity 500ms cubic-bezier(0.16,1,0.3,1)'
          : undefined,
        overflow: 'visible',
      }}
    >
      <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#7B61FF"
          strokeWidth={2}
          strokeLinecap="round"
          style={lineLength ? {
            strokeDasharray: lineLength,
            strokeDashoffset: lineLength,
            animation: `line-draw 800ms cubic-bezier(0.16,1,0.3,1) 200ms forwards`,
            ['--line-length' as string]: lineLength,
          } : undefined}
        />
        {/* Small dot at the start point */}
        <circle cx={x1} cy={y1} r={4} fill="#7B61FF"
          style={{ opacity: 0, transformOrigin: `${x1}px ${y1}px`, animation: 'dot-fade 300ms cubic-bezier(0.16,1,0.3,1) 100ms forwards' }}
        />
        {/* Small dot at the end point */}
        <circle cx={x2} cy={y2} r={4} fill="#7B61FF"
          style={{ opacity: 0, transformOrigin: `${x2}px ${y2}px`, animation: 'dot-fade 300ms cubic-bezier(0.16,1,0.3,1) 900ms forwards' }}
        />
      </g>
    </svg>
  )
}
