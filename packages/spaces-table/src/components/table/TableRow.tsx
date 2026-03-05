import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { IconDotsSixVertical, IconChatPlus } from '@mirohq/design-system'
import { CellRenderer } from './CellRenderer'

interface TableRowProps {
  row: SpaceRow
  idx: number
  fields: FieldDefinition[]
  isSelected: boolean
  onToggleSelect: (id: string, e: React.MouseEvent) => void
  onDeselect: () => void
}

function RowContextMenu({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <div className="row-context-menu" onClick={(e) => e.stopPropagation()}>
      <button onClick={onDuplicate}>Duplicate</button>
      <button className="danger" onClick={onDelete}>Delete</button>
    </div>
  )
}

export function TableRow({ row, idx, fields, isSelected, onToggleSelect, onDeselect }: TableRowProps) {
  return (
    <tr
      className={isSelected ? 'row-selected' : ''}
      style={{ height: '56px' }}
    >
      <td className="pl-14 divider-first" style={{ fontSize: '12px' }}>
        <div className="flex items-center">
          {/* Row number + spacer — idle */}
          <div className="row-number w-8 h-8 items-center justify-center text-[#AEB2C0]">
            {idx + 1}
          </div>
          <div className="row-number w-8 h-8" aria-hidden="true" />

          {/* Drag handle — hover & selected */}
          <button
            className="row-dots w-8 h-8 items-center justify-center rounded-lg cursor-grab"
            onClick={(e) => onToggleSelect(row.id, e)}
          >
            <IconDotsSixVertical
              size="small"
              color={isSelected ? 'icon-primary' : 'icon-neutrals-subtle'}
            />
          </button>

          {/* Comment button — hover only */}
          <button
            className="row-comment w-8 h-8 items-center justify-center rounded-lg hover:bg-[#E9EAEF] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <IconChatPlus size="small" color="icon-neutrals-subtle" />
          </button>
        </div>

        {/* Context menu */}
        {isSelected && (
          <RowContextMenu
            onDuplicate={onDeselect}
            onDelete={onDeselect}
          />
        )}
      </td>

      {fields.map((field) => (
        <td key={field.id} className="px-3 border-b border-[#F1F2F5]">
          <CellRenderer field={field} row={row} />
        </td>
      ))}

      <td className="table-fill" aria-hidden="true" />
    </tr>
  )
}
