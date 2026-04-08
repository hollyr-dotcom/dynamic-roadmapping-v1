import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { Tooltip } from '@mirohq/design-system'
import { KanbanCardToolbar } from './KanbanCardToolbar'
import { CompanyLogo } from '../CompanyLogo'
import { JiraLogo } from '../JiraLogo'

interface KanbanCardProps {
  row: SpaceRow
  fields: FieldDefinition[]
  borderColor: string
  isSelected?: boolean
  onSelect?: () => void
  onOpenSidePanel?: () => void
  onAddToBoard?: () => void
  onMoveToRoadmap?: () => void
}


function FieldTag({ field, row }: { field: FieldDefinition; row: SpaceRow }) {
  const value = row[field.id as keyof SpaceRow]

  if (field.type === 'jiraId') {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-body text-[#222428] rounded whitespace-nowrap min-w-0"
        style={{ fontSize: '12px', height: '26px', padding: '4px 8px', backgroundColor: '#F1F2F5', maxWidth: '100%' }}
      >
        <JiraLogo size={14} />
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
      return null

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

export function KanbanCard({ row, fields, borderColor, isSelected, onSelect, onOpenSidePanel, onAddToBoard, onMoveToRoadmap }: KanbanCardProps) {
  return (
    <div
      className="relative"
      style={{ zIndex: isSelected ? 50 : undefined, cursor: onSelect ? 'pointer' : undefined }}
      onClick={onSelect}
    >
      {isSelected && onOpenSidePanel && (
        <KanbanCardToolbar
          onOpenSidePanel={onOpenSidePanel}
          onAddToBoard={onAddToBoard}
          onMoveToRoadmap={onMoveToRoadmap}
          cardColor={borderColor}
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
            {row.companies.length > 0 && (
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <span
                    className="inline-flex items-center rounded whitespace-nowrap"
                    style={{ height: 26, padding: '0 8px', backgroundColor: '#F1F2F5', gap: 6 }}
                  >
                    {row.companies.slice(0, 3).map(name => (
                      <CompanyLogo key={name} name={name} size={12} inline />
                    ))}
                    {row.companies.length > 3 && (
                      <span className="font-body text-[#656B81]" style={{ fontSize: 12, marginLeft: 2 }}>
                        +{row.companies.length - 3}
                      </span>
                    )}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content side="top" sideOffset={4}>
                  {row.companies.length} {row.companies.length === 1 ? 'company' : 'companies'}
                </Tooltip.Content>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
