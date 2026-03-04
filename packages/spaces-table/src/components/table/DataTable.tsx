import { useState, useEffect, useRef, useCallback } from 'react'
import { fields, sampleData } from '@spaces/shared'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'

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
    <div ref={tableRef} className="w-full shrink-0">
      <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
        <TableHeader fields={fields} />
        <tbody>
          {sampleData.map((row, idx) => (
            <TableRow
              key={row.id}
              row={row}
              idx={idx}
              fields={fields}
              isSelected={selectedRowId === row.id}
              onToggleSelect={handleDotsClick}
              onDeselect={() => setSelectedRowId(null)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
