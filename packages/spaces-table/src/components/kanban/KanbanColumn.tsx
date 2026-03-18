import { IconPlus, IconDotsThreeVertical } from '@mirohq/design-system'
import type { Priority, SpaceRow, FieldDefinition } from '@spaces/shared'
import { KanbanCard } from './KanbanCard'

interface KanbanColumnProps {
  priority: Priority
  config: {
    label: string
    columnBg: string
    cardBorder: string
    tagBg: string
    tagText: string
  }
  rows: SpaceRow[]
  fields: FieldDefinition[]
  selectedCardId?: string | null
  onSelectCard?: (rowId: string) => void
  onOpenSidePanel?: (row: SpaceRow) => void
  onMoveToRoadmap?: (rowId: string) => void
}

function ColumnIconButton({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="kanban-icon-btn flex items-center justify-center w-8 h-8 rounded-md bg-transparent transition-colors cursor-pointer border-0"
      style={{ color, '--btn-color': color } as React.CSSProperties}
    >
      {children}
    </button>
  )
}

export function KanbanColumn({ config, rows, fields, selectedCardId, onSelectCard, onOpenSidePanel, onMoveToRoadmap }: KanbanColumnProps) {
  return (
    <div
      className="group flex flex-col h-full"
      style={{ width: 340 }}
    >
      {/* Column header — sticky below tabs toolbar.
           Outer wrapper is sticky with white bg to mask the cards area
           behind the inner div's rounded corners when scrolled. */}
      <div className="sticky z-10 bg-white" style={{ top: 64, paddingTop: 12 }}>
        <div
          className="flex items-center justify-between p-4 rounded-t-lg"
          style={{ backgroundColor: config.columnBg }}
        >
          <div className="flex items-center gap-1">
            <span
              className="inline-flex items-center justify-center font-body text-[14px] whitespace-nowrap"
              style={{
                height: 28,
                padding: '4px 8px',
                borderRadius: 6,
                backgroundColor: config.tagBg,
                color: config.tagText,
              }}
            >
              {config.label}
            </span>
            <span
              className="flex items-center justify-center font-body text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: 32, height: 32, color: config.tagText }}
            >
              {rows.length}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ColumnIconButton label="Add card" color={config.tagText}>
              <IconPlus size="small" />
            </ColumnIconButton>
            <ColumnIconButton label="Column options" color={config.tagText}>
              <IconDotsThreeVertical size="small" />
            </ColumnIconButton>
          </div>
        </div>
      </div>

      {/* Cards area */}
      <div
        className="flex flex-col gap-4 px-4 pb-6 rounded-b-lg flex-1"
        style={{ backgroundColor: config.columnBg }}
      >
        {rows.map(row => (
          <KanbanCard
            key={row.id}
            row={row}
            fields={fields}
            borderColor={config.cardBorder}
            isSelected={row.id === selectedCardId}
            onSelect={onSelectCard ? () => onSelectCard(row.id) : undefined}
            onOpenSidePanel={onOpenSidePanel ? () => onOpenSidePanel(row) : undefined}
            onMoveToRoadmap={onMoveToRoadmap ? () => onMoveToRoadmap(row.id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
