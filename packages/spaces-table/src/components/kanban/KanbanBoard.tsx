import { useMemo } from 'react'
import type { Priority, SpaceRow, FieldDefinition } from '@spaces/shared'
import { KanbanColumn } from './KanbanColumn'

const PRIORITY_CONFIG = {
  triage: {
    label: 'Triage',
    columnBg: '#fff0f0',
    cardBorder: '#ffc6c6',
    tagBg: '#ffc6c6',
    tagText: '#600000',
  },
  now: {
    label: 'Now',
    columnBg: '#e4f9ff',
    cardBorder: '#b5ecff',
    tagBg: '#b5ecff',
    tagText: '#003d54',
  },
  next: {
    label: 'Next',
    columnBg: '#ffeede',
    cardBorder: '#ffc795',
    tagBg: '#ffc795',
    tagText: '#5c3200',
  },
  later: {
    label: 'Later',
    columnBg: '#f3eeff',
    cardBorder: '#d4bbff',
    tagBg: '#d4bbff',
    tagText: '#2d0066',
  },
  icebox: {
    label: 'Icebox',
    columnBg: '#f7f7f7',
    cardBorder: '#dad8d8',
    tagBg: '#dad8d8',
    tagText: '#222428',
  },
} as const

const DEFAULT_COLUMNS: Priority[] = ['triage', 'now', 'next', 'later', 'icebox']

interface KanbanBoardProps {
  data: SpaceRow[]
  fields: FieldDefinition[]
  columns?: Priority[]
}

export function KanbanBoard({ data, fields, columns }: KanbanBoardProps) {
  const columnOrder = columns ?? DEFAULT_COLUMNS

  const grouped = useMemo(() => {
    const map: Partial<Record<Priority, SpaceRow[]>> = {}
    columnOrder.forEach(p => (map[p] = []))
    data.forEach(row => {
      if (map[row.priority]) map[row.priority]!.push(row)
    })
    return map
  }, [data, columnOrder])

  const tagFields = fields.filter(f => !f.isPrimary)

  return (
    <div className="flex items-stretch gap-4 pl-14 pt-3 pb-10">
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
          />
        </div>
      ))}
      <div className="shrink-0 w-10 h-1" aria-hidden="true" />
    </div>
  )
}
