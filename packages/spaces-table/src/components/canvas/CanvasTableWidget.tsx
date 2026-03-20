import { useState, useEffect, useRef, useCallback } from 'react'
import type { Priority } from '@spaces/shared'
import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { DatabaseTitle } from '../page/DatabaseTitle'
import { ViewTabsToolbar, type SidebarId, type TabConfig, type ViewType } from '../page/ViewTabsToolbar'
import { DataTable } from '../table'
import { KanbanBoard } from '../kanban'
import { TimelinePlaceholder } from '../timeline'

interface CanvasTableWidgetProps {
  widgetId: string
  isOpen: boolean
  panX: number
  panY: number
  zoom: number
  initialX: number
  initialY: number
  selected: boolean
  onSelect: () => void
  onMove: (x: number, y: number) => void
  onExitCanvas: () => void
  onPan: (dx: number, dy: number) => void
  onZoom: (newZoom: number, focalX: number, focalY: number) => void
  databaseTitle: string
  onTitleChange: (title: string) => void
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tab: string) => void
  activeSidebar: SidebarId | null
  onToggleSidebar: (id: SidebarId) => void
  onAddView: (type: ViewType) => void
  onRenameTab: (tabId: string, newLabel: string) => void
  onDuplicateTab: (tabId: string) => void
  onDeleteTab: (tabId: string) => void
  onReorderTabs: (tabs: TabConfig[]) => void
  newColumnMenuOpen: boolean
  onNewColumnMenuOpenChange: (open: boolean) => void
  onDuplicateWidget: (newTabId: string) => void
  syncCount: number
  syncing: boolean
  smoothPanning: boolean
  activeViewType: ViewType | undefined
  viewData: SpaceRow[]
  fields: FieldDefinition[]
  kanbanColumns?: Priority[]
}

/* ── Selection border ── */

function CanvasSelectionBorder() {
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
    <div
      className="absolute pointer-events-none"
      style={{
        inset: -offset,
        border: `1.5px solid ${blue}`,
        borderRadius: 0,
        zIndex: 1,
      }}
    >
      {corners.map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            ...pos,
            width: cornerSize,
            height: cornerSize,
            background: 'white',
            border: `1.5px solid ${blue}`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Widget ── */

const DRAG_THRESHOLD = 3

export function CanvasTableWidget({
  widgetId,
  isOpen,
  panX,
  panY,
  zoom,
  initialX,
  initialY,
  selected,
  onSelect,
  onMove,
  onExitCanvas,
  onPan,
  onZoom,
  databaseTitle,
  onTitleChange,
  tabs,
  activeTab,
  onTabChange,
  activeSidebar,
  onToggleSidebar,
  onAddView,
  onRenameTab,
  onDuplicateTab,
  onDeleteTab,
  onReorderTabs,
  newColumnMenuOpen,
  onNewColumnMenuOpenChange,
  onDuplicateWidget,
  syncCount,
  syncing,
  smoothPanning,
  activeViewType,
  viewData,
  fields,
  kanbanColumns,
}: CanvasTableWidgetProps) {
  // Widget position in world-space (top-left anchor)
  const [widgetX, setWidgetX] = useState(initialX)
  const [widgetY, setWidgetY] = useState(initialY)
  const widgetRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Center in viewport on canvas open (only for the initial widget — initialX=0 signals centering needed)
  useEffect(() => {
    if (isOpen && initialX === 0 && initialY === 128) {
      requestAnimationFrame(() => {
        const w = cardRef.current?.offsetWidth ?? 800
        const x = (window.innerWidth / 2) - (w / 2)
        const y = 128
        setWidgetX(x)
        setWidgetY(y)
        onMove(x, y)
      })
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Forward wheel events to canvas pan/zoom so scrolling works over the widget
  useEffect(() => {
    const el = widgetRef.current
    if (!el || !isOpen) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const sensitivity = 0.01
        const newZoom = zoom + -e.deltaY * sensitivity
        onZoom(newZoom, e.clientX, e.clientY)
      } else {
        onPan(-e.deltaX, -e.deltaY)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [isOpen, zoom, onPan, onZoom])

  // Drag to reposition
  const dragging = useRef(false)
  const dragStarted = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Don't initiate drag from interactive elements
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'TEXTAREA') return
    if ((e.target as HTMLElement).closest('button, [role="menu"], [role="menuitem"], [data-radix-collection-item]')) return

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

    // Only start drag after passing threshold
    if (!dragStarted.current) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      dragStarted.current = true
    }

    // Convert screen-space delta to world-space (divide by zoom)
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
      // Sync final position to parent
      onMove(widgetX, widgetY)
    } else {
      // Click to select
      onSelect()
    }
  }, [onSelect, onMove, widgetX, widgetY])

  // Subtle entrance scale on the inner card
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setEntered(true))
    } else {
      setEntered(false)
    }
  }, [isOpen])

  return (
    // Outer: canvas transform container — pans & scales with the world
    <div
      className="fixed top-0 left-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
      {/* Inner: widget positioned in world-space, top-left anchored */}
      <div
        ref={widgetRef}
        data-widget-id={widgetId}
        style={{
          position: 'absolute',
          top: widgetY,
          left: widgetX,
          pointerEvents: isOpen ? 'auto' : 'none',
          cursor: selected ? 'grab' : 'default',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Selection border (outside overflow:hidden card) */}
        {selected && <CanvasSelectionBorder />}

        {/* Card */}
        <div
          ref={cardRef}
          data-widget-card
          className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: entered ? 'scale(1)' : 'scale(0.96)',
            background: '#FFFFFF',
            borderRadius: 12,
            padding: '32px 40px 40px',
            boxShadow: '0 2px 4px 0 rgba(34, 36, 40, 0.08)',
            overflow: 'visible',
          }}
        >
          <DatabaseTitle
            variant="widget"
            opacity={1}
            title={databaseTitle}
            onTitleChange={onTitleChange}
            onExitCanvas={onExitCanvas}
            syncCount={syncCount}
            syncing={syncing}
          />

          <ViewTabsToolbar
            variant="widget"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            activeSidebar={activeSidebar}
            onToggleSidebar={onToggleSidebar}
            onAddView={onAddView}
            onRenameTab={onRenameTab}
            onDuplicateTab={onDuplicateTab}
            onDeleteTab={onDeleteTab}
            onReorderTabs={onReorderTabs}
            newColumnMenuOpen={newColumnMenuOpen}
            onNewColumnMenuOpenChange={onNewColumnMenuOpenChange}
            onDuplicateWidget={onDuplicateWidget}
          />

          {/* View content — canvas-widget-view zeroes out the built-in pl-14 gutters */}
          <div className="canvas-widget-view">
            {activeViewType === 'table' && (
              <DataTable key={activeTab} data={viewData} fields={fields} />
            )}
            {activeViewType === 'kanban' && (
              <KanbanBoard key={activeTab} data={viewData} fields={fields} columns={kanbanColumns} />
            )}
            {activeViewType === 'timeline' && (
              <TimelinePlaceholder key={activeTab} data={[]} parentScrollRef={{ current: null }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
