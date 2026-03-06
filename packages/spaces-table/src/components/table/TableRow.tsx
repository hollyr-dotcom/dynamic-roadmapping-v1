import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { IconDotsSixVertical, IconChatPlus, DropdownMenu, IconSquaresTwoOverlap, IconTrash } from '@mirohq/design-system'
import { CellRenderer } from './CellRenderer'
import { MENU_WIDTH } from '../page/ViewTabsToolbar'

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
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger asChild>
        <div onClick={(e) => e.stopPropagation()} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="start" css={{ minWidth: MENU_WIDTH }}>
        <DropdownMenu.Item onSelect={onDuplicate}>
          <DropdownMenu.IconSlot><IconSquaresTwoOverlap /></DropdownMenu.IconSlot>
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onDelete}>
          <DropdownMenu.IconSlot><IconTrash /></DropdownMenu.IconSlot>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
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
