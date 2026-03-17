import type { SpaceRow, FieldDefinition } from '@spaces/shared'

interface KanbanCardProps {
  row: SpaceRow
  fields: FieldDefinition[]
  borderColor: string
  onRowClick?: (row: SpaceRow) => void
}

function FieldTag({ field, row }: { field: FieldDefinition; row: SpaceRow }) {
  const value = row[field.id as keyof SpaceRow]

  let displayText: string
  switch (field.type) {
    case 'currency':
      displayText = (value as number) === 0 ? '—' : `$${value}K`
      break
    case 'number':
      displayText = (value as number).toLocaleString()
      break
    case 'avatars':
      displayText = `${(value as string[]).length}`
      break
    default:
      displayText = String(value)
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 font-body text-[#222428] rounded whitespace-nowrap min-w-0"
      style={{
        fontSize: '12px',
        height: '26px',
        padding: '4px 8px',
        backgroundColor: '#F1F2F5',
        maxWidth: '100%',
      }}
    >
      <span className="text-[#656B81] shrink-0">{field.label}</span>
      <span className="truncate">{displayText}</span>
    </span>
  )
}

export function KanbanCard({ row, fields, borderColor, onRowClick }: KanbanCardProps) {
  return (
    <div
      className="rounded-lg bg-white overflow-hidden"
      style={{
        border: `1.5px solid ${borderColor}`,
        borderBottomWidth: 6,
        boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
        cursor: onRowClick ? 'pointer' : undefined,
      }}
      onClick={() => onRowClick?.(row)}
    >
      <div className="px-4 py-3">
        <p
          className="font-body text-sm font-normal text-[#222428] leading-snug m-0 overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
        >
          {row.title}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {fields.filter(field => field.id !== 'description').map(field => (
            <FieldTag key={field.id} field={field} row={row} />
          ))}
        </div>
      </div>
    </div>
  )
}
