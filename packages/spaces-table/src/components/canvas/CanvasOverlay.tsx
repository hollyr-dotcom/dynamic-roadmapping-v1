import { useRef, useEffect } from 'react'

interface CanvasOverlayProps {
  isOpen: boolean
  interactive?: boolean
  panX: number
  panY: number
  zoom: number
  smoothPanning: boolean
  onPan: (dx: number, dy: number) => void
  onZoom: (newZoom: number, focalX: number, focalY: number) => void
  onDeselect: () => void
}

// Base grid spacing. At each threshold the grid "resets" to keep
// the visual gap comfortable — dots never get too dense or too sparse.
const BASE_GRID = 24

function getGridSpacing(zoom: number) {
  // Find a power-of-2 multiplier so the visible spacing stays in a
  // comfortable 16–48px range on screen.
  let spacing = BASE_GRID
  while (spacing * zoom < 16) spacing *= 2
  while (spacing * zoom > 48) spacing /= 2
  return spacing
}

export function CanvasOverlay({ isOpen, interactive, panX, panY, zoom, smoothPanning, onPan, onZoom, onDeselect }: CanvasOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInteractive = interactive ?? isOpen
  const gridSpacing = getGridSpacing(zoom)
  const screenSpacing = gridSpacing * zoom

  // Wheel handler with { passive: false } so we can preventDefault
  useEffect(() => {
    const el = ref.current
    if (!el || !isInteractive) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom (trackpad reports ctrlKey + deltaY)
        const sensitivity = 0.01
        const newZoom = zoom + -e.deltaY * sensitivity
        onZoom(newZoom, e.clientX, e.clientY)
      } else {
        // Pan
        onPan(-e.deltaX, -e.deltaY)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [isInteractive, zoom, onPan, onZoom])

  return (
    <div
      ref={ref}
      className="fixed inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        zIndex: 60,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isInteractive ? 'auto' : 'none',
        backgroundColor: '#F2F2F2',
        backgroundImage: 'radial-gradient(circle, #D5D8DE 1px, transparent 1px)',
        backgroundSize: `${screenSpacing}px ${screenSpacing}px`,
        backgroundPosition: `${panX % screenSpacing}px ${panY % screenSpacing}px`,
        transition: smoothPanning
          ? 'opacity 500ms cubic-bezier(0.16,1,0.3,1), background-position 600ms cubic-bezier(0.16,1,0.3,1)'
          : undefined,
      }}
      onClick={onDeselect}
    />
  )
}
