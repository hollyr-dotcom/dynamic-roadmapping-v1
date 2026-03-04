import { useState, useEffect, useRef, useCallback } from 'react'
import { fields, sampleData } from '@spaces/shared'
import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { IconDotsSixVertical, IconChatPlus, IconBookmark } from '@mirohq/design-system'
import { TextCell } from './cells/TextCell'
import { NumberCell } from './cells/NumberCell'
import { CurrencyCell } from './cells/CurrencyCell'
import { AvatarStackCell } from './cells/AvatarStackCell'

function CellRenderer({ field, row }: { field: FieldDefinition; row: SpaceRow }) {
  const value = row[field.id as keyof SpaceRow]

  switch (field.type) {
    case 'text':
      return <TextCell value={value as string} isPrimary={field.isPrimary} />
    case 'number':
      return <NumberCell value={value as number} />
    case 'currency':
      return <CurrencyCell value={value as number} />
    case 'avatars':
      return <AvatarStackCell values={value as string[]} />
    default:
      return <span className="text-sm text-[#656B81]">{String(value)}</span>
  }
}

function RowContextMenu({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <div className="row-context-menu" onClick={(e) => e.stopPropagation()}>
      <button onClick={onDuplicate}>Duplicate</button>
      <button className="danger" onClick={onDelete}>Delete</button>
    </div>
  )
}

export function DataTable() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Deselect when clicking outside the table
  useEffect(() => {
    if (!selectedRowId) return
    const handleClick = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setSelectedRowId(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [selectedRowId])

  const handleDotsClick = useCallback((rowId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedRowId((prev) => (prev === rowId ? null : rowId))
  }, [])

  return (
    <div ref={tableRef} className="flex-1 overflow-auto table-scroll">
      <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            <th
              className="pl-14"
              aria-hidden="true"
            />
            {fields.map((field) => (
              <th
                key={field.id}
                className="text-left font-body font-semibold text-[#656B81] h-12"
                style={{
                  fontSize: '14px',
                  minWidth: field.isPrimary ? '320px' : '128px',
                  paddingLeft: '12px',
                  paddingRight: '20px',
                }}
              >
                <div className="flex items-center gap-2">
                  {field.isPrimary && (
                    <IconBookmark size="small" color="icon-neutrals-subtle" />
                  )}
                  <span className="truncate">{field.label}</span>
                </div>
              </th>
            ))}
            <th className="w-8 min-w-[32px]" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, idx) => {
            const isSelected = selectedRowId === row.id
            return (
              <tr
                key={row.id}
                className={isSelected ? 'row-selected' : ''}
                style={{ height: '56px' }}
              >
                <td className="pl-14 divider-first" style={{ fontSize: '12px' }}>
                  <div className="flex items-center">
                    {/* Row number + spacer — idle */}
                    <div className="row-number w-8 h-8 items-center justify-center text-[#AEB2C0]">
                      {idx + 1}
                    </div>
                    <div className="row-number w-8 h-8 -mr-3" aria-hidden="true" />

                    {/* Drag handle — hover & selected */}
                    <button
                      className="row-dots w-8 h-8 items-center justify-center rounded-lg cursor-grab"
                      onClick={(e) => handleDotsClick(row.id, e)}
                    >
                      <IconDotsSixVertical
                        size="small"
                        color={isSelected ? 'icon-primary' : 'icon-neutrals-subtle'}
                      />
                    </button>

                    {/* Comment button — hover only */}
                    <button
                      className="row-comment w-8 h-8 -mr-3 items-center justify-center rounded-lg hover:bg-[#E9EAEF] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconChatPlus size="small" color="icon-neutrals-subtle" />
                    </button>
                  </div>

                  {/* Context menu */}
                  {isSelected && (
                    <RowContextMenu
                      onDuplicate={() => setSelectedRowId(null)}
                      onDelete={() => setSelectedRowId(null)}
                    />
                  )}
                </td>

                {fields.map((field) => (
                  <td key={field.id} className="px-3 border-b border-[#F1F2F5]">
                    <CellRenderer field={field} row={row} />
                  </td>
                ))}

                <td className="w-8 min-w-[32px] divider-last" aria-hidden="true" />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
