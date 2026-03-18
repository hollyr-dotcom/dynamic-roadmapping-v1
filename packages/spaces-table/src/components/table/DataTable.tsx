import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { Button, IconPlus } from '@mirohq/design-system'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'

const IMPORT_INITIAL_DELAY = 400
const IMPORT_ROW_DURATION = 300
const IMPORT_TOAST_PAUSE = 600

// Compute cumulative delay for row index using ease-in curve
// First rows arrive slowly, later rows come in rapid-fire
function getRowDelay(idx: number, total: number): number {
  const t = total <= 1 ? 1 : idx / (total - 1)
  const eased = t * t * t // cubic ease-in — slow start, fast finish
  const totalCascade = 1800 // total ms spread across all rows
  return IMPORT_INITIAL_DELAY + eased * totalCascade
}

interface DataTableProps {
  data: SpaceRow[]
  fields: FieldDefinition[]
  onRowClick?: (row: SpaceRow) => void
  onCompanyClick?: (row: SpaceRow, name: string) => void
  updatedRows?: Set<string>
  insightsAllDots?: boolean
  onTableInteract?: () => void
  isImporting?: boolean
  onImportComplete?: () => void
  onMoveToRoadmap?: (rowId: string) => void
  showMoveToRoadmap?: boolean
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract, isImporting, onImportComplete, onMoveToRoadmap, showMoveToRoadmap }: DataTableProps) {
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

  // Fire completion callback after all rows have animated in
  useEffect(() => {
    if (!isImporting || !onImportComplete || data.length === 0) return
    const lastRowDelay = getRowDelay(data.length - 1, data.length)
    const totalTime = lastRowDelay + IMPORT_ROW_DURATION + IMPORT_TOAST_PAUSE
    const timer = setTimeout(onImportComplete, totalTime)
    return () => clearTimeout(timer)
  }, [isImporting, onImportComplete, data.length])

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
    <div ref={tableRef} className={`w-full shrink-0 ${!isImporting ? 'item-enter' : ''}`} style={!isImporting ? { animationDelay: '80ms' } : undefined} onClick={insightsAllDots ? onTableInteract : undefined}>
      <table className="border-separate" style={{ borderSpacing: 0, minWidth: '100%' }}>
        <TableHeader fields={fields} className={isImporting ? 'import-header-enter' : undefined} />
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
              importDelay={isImporting ? getRowDelay(idx, data.length) : undefined}
              onMoveToRoadmap={onMoveToRoadmap}
              showMoveToRoadmap={showMoveToRoadmap}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
