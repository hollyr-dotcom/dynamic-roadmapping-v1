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
  onRowClick?: (row: SpaceRow) => void
  onCompanyClick?: (row: SpaceRow, name: string) => void
  isUpdated?: boolean
  importDelay?: number
}

function RowContextMenu({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger asChild>
        <div onClick={(e) => e.stopPropagation()} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH }}>
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

export function TableRow({ row, idx, fields, isSelected, onToggleSelect, onDeselect, onRowClick, onCompanyClick, isUpdated, importDelay }: TableRowProps) {
  const importStyle = importDelay !== undefined ? {
    opacity: 0,
    animation: `row-import-enter 300ms cubic-bezier(0.16, 1, 0.3, 1) ${importDelay}ms forwards, row-arrival-wash 600ms ease ${importDelay + 300}ms forwards`,
  } : {}

  return (
    <tr
      className={isSelected ? 'row-selected' : ''}
      style={{ height: '56px', cursor: onRowClick ? 'pointer' : undefined, ...importStyle }}
      onClick={() => onRowClick?.(row)}
    >
      <td className="pl-14 divider-first" style={{ fontSize: '12px', position: 'relative' }}>
        {isUpdated && (
          <span style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4262FF', zIndex: 1 }} />
        )}
        <div className="flex items-center w-full gap-0.5">
          {/* Row number / dots — swap in the same slot */}
          <div className="relative w-8 h-8 shrink-0">
            <div className="row-number w-8 h-8 flex items-center justify-center">
              {idx + 1}
            </div>
            <button
              className="row-dots absolute inset-0 flex items-center justify-center rounded-lg cursor-grab"
              onClick={(e) => onToggleSelect(row.id, e)}
            >
              <IconDotsSixVertical
                size="small"
                color={isSelected ? 'icon-primary' : 'icon-neutrals-subtle'}
              />
            </button>
          </div>

          {/* Comment button — hover only */}
          <button
            className="row-comment flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#E9EAEF] transition-colors"
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
        <td
          key={field.id}
          className="px-3 border-b border-[#F1F2F5]"
          style={field.id === 'description' ? { maxWidth: '320px' } : undefined}
        >
          <CellRenderer field={field} row={row} onAvatarChipClick={onCompanyClick ? (name) => onCompanyClick(row, name) : undefined} />
        </td>
      ))}

      <td className="table-fill" aria-hidden="true" />
    </tr>
  )
}
