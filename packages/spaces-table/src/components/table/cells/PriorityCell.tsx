import type { Priority } from '@spaces/shared'

const PRIORITY_TAG: Record<Priority, { label: string; bg: string; text: string }> = {
  now:    { label: 'New',         bg: '#b5ecff', text: '#003d54' },
  triage: { label: 'Triage',      bg: '#ffc6c6', text: '#600000' },
  next:   { label: 'Prioritized', bg: '#ffc795', text: '#5c3200' },
  later:  { label: 'Up next',     bg: '#d4bbff', text: '#2d0066' },
  icebox: { label: 'Watching',    bg: '#dad8d8', text: '#222428' },
}

interface PriorityCellProps {
  value: Priority | undefined
}

export function PriorityCell({ value }: PriorityCellProps) {
  if (!value) return null
  const tag = PRIORITY_TAG[value]
  if (!tag) return null

  return (
    <span
      className="inline-flex items-center justify-center font-body whitespace-nowrap"
      style={{
        fontSize: 14,
        fontWeight: 600,
        height: 28,
        padding: '4px 8px',
        borderRadius: 6,
        backgroundColor: tag.bg,
        color: tag.text,
      }}
    >
      {tag.label}
    </span>
  )
}
