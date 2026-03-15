import type { Status } from '@spaces/shared'

const STATUS_STYLES: Record<Status, { bg: string; text: string; label: string }> = {
  planning:      { bg: '#F0F0F0', text: '#414141', label: 'To do' },
  'in-progress': { bg: '#D5F0FE', text: '#0A5E8A', label: 'In progress' },
  done:          { bg: '#D5F5E3', text: '#1A6B45', label: 'Done' },
}

interface StatusCellProps {
  value: Status | undefined
}

export function StatusCell({ value }: StatusCellProps) {
  if (!value) return <span className="text-sm text-[#656B81]">—</span>

  const style = STATUS_STYLES[value]
  return (
    <span
      className="inline-flex items-center rounded px-2.5 py-1 text-xs font-body font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}
