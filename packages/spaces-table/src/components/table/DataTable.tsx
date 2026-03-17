import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { Button, IconPlus } from '@mirohq/design-system'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'

interface DataTableProps {
  data: SpaceRow[]
  fields: FieldDefinition[]
  onRowClick?: (row: SpaceRow) => void
  onCompanyClick?: (row: SpaceRow, name: string) => void
  updatedRows?: Set<string>
  insightsAllDots?: boolean
  onTableInteract?: () => void
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract }: DataTableProps) {
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

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 item-enter" style={{ animationDelay: '80ms' }}>
        <div className="w-12 h-12 rounded-xl bg-[#f1f2f5] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7D8297" strokeWidth="1.5"/>
            <path d="M3 9h18M9 9v12" stroke="#7D8297" strokeWidth="1.5"/>
          </svg>
        </div>
        <h3 className="text-[16px] font-semibold text-[#1a1b1e] mb-1" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>No records yet</h3>
        <p className="text-[14px] text-[#7D8297] mb-5" style={{ fontFamily: 'Open Sans, sans-serif' }}>Add your first record to get started</p>
        <Button variant="secondary" size="medium">
          <Button.IconSlot><IconPlus /></Button.IconSlot>
          <Button.Label>Add record</Button.Label>
        </Button>
      </div>
    )
  }

  return (
    <div ref={tableRef} className="w-full shrink-0 item-enter" style={{ animationDelay: '80ms' }} onClick={insightsAllDots ? onTableInteract : undefined}>
      <table className="border-separate" style={{ borderSpacing: 0, minWidth: '100%' }}>
        <TableHeader fields={fields} />
        <tbody>
          {data.map((row, idx) => (
            <TableRow
              key={row.id}
              row={row}
              idx={idx}
              fields={fields}
              isUpdated={insightsAllDots || (updatedRows?.has(row.id) ?? false)}
              isSelected={selectedRowId === row.id}
              onToggleSelect={handleDotsClick}
              onDeselect={() => setSelectedRowId(null)}
              onRowClick={onRowClick}
              onCompanyClick={onCompanyClick}
              isUpdated={updatedRows?.has(row.id) ?? false}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
