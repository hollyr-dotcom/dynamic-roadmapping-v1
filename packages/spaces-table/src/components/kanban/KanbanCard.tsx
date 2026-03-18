import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { KanbanCardToolbar } from './KanbanCardToolbar'

interface KanbanCardProps {
  row: SpaceRow
  fields: FieldDefinition[]
  borderColor: string
  isSelected?: boolean
  onSelect?: () => void
  onOpenSidePanel?: () => void
  onMoveToRoadmap?: () => void
}

const JIRA_LOGO = 'https://www.figma.com/api/mcp/asset/f169e443-27f1-401b-994d-4f720c63f0c7'

function FieldTag({ field, row }: { field: FieldDefinition; row: SpaceRow }) {
  const value = row[field.id as keyof SpaceRow]

  if (field.type === 'jiraId') {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-body text-[#222428] rounded whitespace-nowrap min-w-0"
        style={{ fontSize: '12px', height: '26px', padding: '4px 8px', backgroundColor: '#F1F2F5', maxWidth: '100%' }}
      >
        <img src={JIRA_LOGO} alt="Jira" style={{ width: 14, height: 14, flexShrink: 0, objectFit: 'contain' }} />
        <span className="truncate">{String(value)}</span>
      </span>
    )
  }

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

export function KanbanCard({ row, fields, borderColor, isSelected, onSelect, onOpenSidePanel, onMoveToRoadmap }: KanbanCardProps) {
  return (
    <div
      className="relative"
      style={{ zIndex: isSelected ? 50 : undefined, cursor: onSelect ? 'pointer' : undefined }}
      onClick={onSelect}
    >
      {isSelected && onOpenSidePanel && (
        <KanbanCardToolbar
          onOpenSidePanel={onOpenSidePanel}
          onMoveToRoadmap={onMoveToRoadmap}
        />
      )}
      <div
        className="rounded-lg bg-white overflow-hidden"
        style={{
          border: `1.5px solid ${borderColor}`,
          borderBottomWidth: 6,
          boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
          outline: isSelected ? '3px solid #3859FF' : 'none',
          outlineOffset: isSelected ? 4 : 0,
          borderRadius: 8,
          transition: 'outline 150ms ease, outline-offset 150ms ease',
        }}
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
    </div>
  )
}
