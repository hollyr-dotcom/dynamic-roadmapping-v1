import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { Button, IconPlus, IconSquareArrowIn, IconFileSpreadsheet, IconChevronDown, IconRocket, IconInsights, Switch, DropdownMenu } from '@mirohq/design-system'
import { JiraLogo } from '../JiraLogo'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'

const IMPORT_INITIAL_DELAY = 100
const IMPORT_ROW_DURATION = 200
const IMPORT_TOAST_PAUSE = 150

// Compute cumulative delay for row index using ease-in curve
// First rows arrive slowly, later rows come in rapid-fire
function getRowDelay(idx: number, total: number): number {
  const t = total <= 1 ? 1 : idx / (total - 1)
  const eased = t * t * t // cubic ease-in — slow start, fast finish
  const totalCascade = 700 // total ms spread across all rows
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
  onImportSource?: (source: 'jira' | 'miro' | 'csv') => void
  onAddRecord?: () => void
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract, isImporting, onImportComplete, onMoveToRoadmap, showMoveToRoadmap, onImportSource, onAddRecord }: DataTableProps) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const hasImportedRef = useRef(false)
  if (isImporting) hasImportedRef.current = true

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

  const [enrichInsights, setEnrichInsights] = useState(true)

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 item-enter" style={{ animationDelay: '80ms' }}>
        <div className="w-16 h-16 rounded-2xl bg-[#e8ecff] flex items-center justify-center mb-5">
          <IconRocket css={{ width: 32, height: 32, color: '#4262FF' }} />
        </div>
        <h3 className="text-[16px] font-semibold text-[#1a1b1e] mb-1" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Start building your roadmap</h3>
        <p className="text-[14px] text-[#7D8297] mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>Add records manually or import from your tools</p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="large" onPress={onAddRecord}>
            <Button.IconSlot><IconPlus /></Button.IconSlot>
            <Button.Label>Add record</Button.Label>
          </Button>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="primary" size="large">
                <Button.IconSlot><IconSquareArrowIn css={{ transform: 'rotate(180deg)' }} /></Button.IconSlot>
                <Button.Label>Import</Button.Label>
                <Button.IconSlot placement="end"><IconChevronDown css={{ width: 16, height: 16 }} /></Button.IconSlot>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="bottom" align="center" css={{ minWidth: 180 }}>
              <DropdownMenu.Item onSelect={() => onImportSource?.('jira')}>
                <DropdownMenu.IconSlot><JiraLogo size={20} /></DropdownMenu.IconSlot>
                Jira
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => onImportSource?.('csv')}>
                <DropdownMenu.IconSlot><IconFileSpreadsheet /></DropdownMenu.IconSlot>
                CSV
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Insights toggle */}
        <div
          className="flex items-center gap-3 mt-8 px-5 py-3 rounded-xl cursor-pointer transition-colors hover:bg-[#f8f9fa]"
          style={{ border: '1px solid #e9eaef' }}
          onClick={() => setEnrichInsights(v => !v)}
        >
          <IconInsights css={{ width: 20, height: 20, color: '#7D8297', shrink: 0 }} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Enrich with Insights</span>
            <span className="text-[12px] text-[#7D8297]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Auto-enrich records with customer signals</span>
          </div>
          <Switch checked={enrichInsights} onChange={setEnrichInsights} />
        </div>
      </div>
    )
  }

  return (
    <div ref={tableRef} className={`w-full shrink-0 ${!isImporting && !hasImportedRef.current ? 'item-enter' : ''}`} style={!isImporting && !hasImportedRef.current ? { animationDelay: '80ms' } : undefined} onClick={insightsAllDots ? onTableInteract : undefined}>
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
