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

  const path = `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`

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
          d={path}
          fill="none"
          stroke="#7B61FF"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Small dot at the start point */}
        <circle cx={x1} cy={y1} r={4} fill="#7B61FF" />
        {/* Small dot at the end point */}
        <circle cx={x2} cy={y2} r={4} fill="#7B61FF" />
      </g>
    </svg>
  )
}
