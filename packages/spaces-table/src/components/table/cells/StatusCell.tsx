import type { Status } from '@spaces/shared'

const STATUS_STYLES: Record<Status, { bg: string; text: string; label: string }> = {
  planning:      { bg: '#FFF3CD', text: '#664D03', label: 'Planning' },
  'in-progress': { bg: '#D1ECF1', text: '#0C5460', label: 'In Progress' },
  done:          { bg: '#D4EDDA', text: '#155724', label: 'Done' },
}

interface StatusCellProps {
  value: Status | undefined
}

export function StatusCell({ value }: StatusCellProps) {
  if (!value) return <span className="text-sm text-[#656B81]">—</span>

  const style = STATUS_STYLES[value]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-body font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}
