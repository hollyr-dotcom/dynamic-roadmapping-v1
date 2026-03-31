import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { Button, IconFileSpreadsheet, IconChevronDown, IconRocket, IconLightbulb, IconInsights, Switch, DropdownMenu } from '@mirohq/design-system'
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
  activePage?: 'backlog' | 'roadmap'
  animateIn?: boolean
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract, isImporting, onImportComplete, onMoveToRoadmap, showMoveToRoadmap, onImportSource, onAddRecord, activePage = 'roadmap', animateIn = true }: DataTableProps) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const hasImportedRef = useRef(false)
  // Freeze animateIn at mount — prevents CSS animation from triggering if prop changes later
  const animateInRef = useRef(animateIn)
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
    const PageIcon = activePage === 'backlog' ? IconLightbulb : IconRocket
    const heading = activePage === 'backlog' ? 'Start adding ideas to your backlog' : 'Start building your roadmap'
    return (
      <div className={`flex flex-col items-center justify-center py-32${animateInRef.current ? ' item-enter' : ''}`} style={animateInRef.current ? { animationDelay: '80ms' } : undefined}>
        <div className="w-16 h-16 rounded-2xl bg-[#e8ecff] flex items-center justify-center mb-5">
          <PageIcon css={{ width: 32, height: 32, color: '#4262FF' }} />
        </div>
        <h3 className="text-[18px] font-semibold text-[#1a1b1e] mb-1" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>{heading}</h3>
        <p className="text-[14px] text-[#7D8297] mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>Add records manually or import from your tools</p>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="primary" size="medium">
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
          <Button variant="ghost" size="medium" onPress={onAddRecord}>
            <Button.Label>Add item</Button.Label>
          </Button>
        </div>

        {/* Insights toggle */}
        <div
          className="flex items-center justify-between mt-12 px-5 py-3 rounded-xl cursor-pointer transition-colors hover:bg-[#f8f9fa]"
          style={{ border: '1px solid #e9eaef' }}
          onClick={() => setEnrichInsights(v => !v)}
        >
          <div className="flex items-center gap-3">
            <IconInsights css={{ width: 20, height: 20, color: '#7D8297', shrink: 0 }} />
            <div className="flex flex-col gap-0">
              <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Enrich with Insights</span>
              <span className="text-[12px] text-[#7D8297]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Auto-enrich records with customer signals</span>
            </div>
          </div>
          <div style={{ marginLeft: 16 }}>
            <Switch checked={enrichInsights} onChange={setEnrichInsights} />
          </div>
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
