import type { SpaceRow, FieldDefinition } from '@spaces/shared'

interface KanbanCardProps {
  row: SpaceRow
  fields: FieldDefinition[]
  borderColor: string
  onClick?: (row: SpaceRow) => void
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
      className="inline-flex items-center gap-1.5 font-body text-[#222428] rounded whitespace-nowrap"
      style={{
        fontSize: '12px',
        height: '26px',
        padding: '4px 8px',
        backgroundColor: '#F1F2F5',
        ...(field.id === 'description' ? { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' } : {}),
      }}
    >
      <span className="text-[#656B81]">{field.label}</span>
      <span style={field.id === 'description' ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : undefined}>{displayText}</span>
    </span>
  )
}

export function KanbanCard({ row, fields, borderColor, onClick }: KanbanCardProps) {
  return (
    <div
      className="rounded-lg bg-white"
      style={{
        border: `1.5px solid ${borderColor}`,
        boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={() => onClick?.(row)}
    >
      <div className="px-4 py-3">
        <p className="font-body text-sm text-[#222428] leading-snug m-0 font-bold">
          {row.title}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {fields.filter(f => f.id !== 'title').map(field => (
            <FieldTag key={field.id} field={field} row={row} />
          ))}
        </div>
      </div>
    </div>
  )
}
