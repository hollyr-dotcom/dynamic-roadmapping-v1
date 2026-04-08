import { useMemo, useState, useRef, useEffect } from 'react'
import type { Priority, SpaceRow, FieldDefinition } from '@spaces/shared'
import { KanbanColumn } from './KanbanColumn'

const PRIORITY_CONFIG = {
  now: {
    label: 'New',
    columnBg: '#e4f9ff',
    cardBorder: '#b5ecff',
    tagBg: '#b5ecff',
    tagText: '#003d54',
  },
  triage: {
    label: 'Triage',
    columnBg: '#fff0f0',
    cardBorder: '#ffc6c6',
    tagBg: '#ffc6c6',
    tagText: '#600000',
  },
  next: {
    label: 'Prioritized',
    columnBg: '#ffeede',
    cardBorder: '#ffc795',
    tagBg: '#ffc795',
    tagText: '#5c3200',
  },
  later: {
    label: 'Up next',
    columnBg: '#f3eeff',
    cardBorder: '#d4bbff',
    tagBg: '#d4bbff',
    tagText: '#2d0066',
  },
  icebox: {
    label: 'Watching',
    columnBg: '#f7f7f7',
    cardBorder: '#dad8d8',
    tagBg: '#dad8d8',
    tagText: '#222428',
  },
} as const

const DEFAULT_COLUMNS: Priority[] = ['now', 'triage', 'next', 'later', 'icebox']

interface KanbanBoardProps {
  data: SpaceRow[]
  fields: FieldDefinition[]
  columns?: Priority[]
  onRowClick?: (row: SpaceRow) => void
  onAddToBoard?: (rowId: string) => void
  onMoveToRoadmap?: (rowId: string) => void
  showMoveToRoadmap?: boolean
  onCardSelectedChange?: (hasSelection: boolean) => void
}

export function KanbanBoard({ data, fields, columns, onRowClick, onAddToBoard, onMoveToRoadmap, showMoveToRoadmap, onCardSelectedChange }: KanbanBoardProps) {
  const columnOrder = columns ?? DEFAULT_COLUMNS
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  // Deselect when clicking outside the board
  useEffect(() => {
    if (!selectedCardId) return
    const handleClick = (e: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(e.target as Node)) {
        setSelectedCardId(null)
        onCardSelectedChange?.(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [selectedCardId])

  const grouped = useMemo(() => {
    const map: Partial<Record<Priority, SpaceRow[]>> = {}
    columnOrder.forEach(p => (map[p] = []))
    data.forEach(row => {
      if (map[row.priority]) map[row.priority]!.push(row)
    })
    return map
  }, [data, columnOrder])

  const tagFields = fields.filter(f => !f.isPrimary)

  const handleSelectCard = (rowId: string) => {
    setSelectedCardId(prev => {
      const next = prev === rowId ? null : rowId
      onCardSelectedChange?.(next !== null)
      return next
    })
  }

  const handleMoveToRoadmap = showMoveToRoadmap && onMoveToRoadmap
    ? (rowId: string) => { onMoveToRoadmap(rowId); setSelectedCardId(null); onCardSelectedChange?.(false) }
    : undefined

  return (
    <div ref={boardRef} className="flex items-stretch gap-4 pl-14 pt-3 pb-10">
      {columnOrder.map((priority, i) => (
        <div
          key={priority}
          className="shrink-0 item-enter flex"
          style={{ animationDelay: `${80 + i * 60}ms` }}
        >
          <KanbanColumn
            priority={priority}
            config={PRIORITY_CONFIG[priority]}
            rows={grouped[priority] ?? []}
            fields={tagFields}
            selectedCardId={selectedCardId}
            onSelectCard={handleSelectCard}
            onOpenSidePanel={onRowClick}
            onAddToBoard={onAddToBoard}
            onMoveToRoadmap={handleMoveToRoadmap}
          />
        </div>
      ))}
      <div className="shrink-0 w-10 h-1" aria-hidden="true" />
    </div>
  )
}
