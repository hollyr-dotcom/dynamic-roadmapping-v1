import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { Button, IconPlus, IconSquareArrowIn, IconTable, IconFileSpreadsheet, IconButton, IconCross, IconChevronDown, DropdownMenu } from '@mirohq/design-system'
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
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract, isImporting, onImportComplete, onMoveToRoadmap, showMoveToRoadmap, onImportSource }: DataTableProps) {
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

  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importVariant, setImportVariant] = useState<'dialog' | 'dropdown'>('dialog')

  const importSources: { source: 'jira' | 'miro' | 'csv'; icon: JSX.Element; iconSmall: JSX.Element; label: string; description: string }[] = [
    { source: 'jira', icon: <JiraLogo size={24} />, iconSmall: <JiraLogo size={20} />, label: 'Jira', description: 'Import issues and epics from your Jira projects' },
    { source: 'miro', icon: <IconTable css={{ width: 24, height: 24 }} />, iconSmall: <IconTable css={{ width: 20, height: 20 }} />, label: 'Tables', description: 'Pull in items from your Miro tables' },
    { source: 'csv', icon: <IconFileSpreadsheet css={{ width: 24, height: 24 }} />, iconSmall: <IconFileSpreadsheet css={{ width: 20, height: 20 }} />, label: 'CSV', description: 'Upload a spreadsheet of work items' },
  ]

  if (data.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-32 item-enter" style={{ animationDelay: '80ms' }}>
          <div className="w-12 h-12 rounded-xl bg-[#f1f2f5] flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7D8297" strokeWidth="1.5"/>
              <path d="M3 9h18M9 9v12" stroke="#7D8297" strokeWidth="1.5"/>
            </svg>
          </div>
          <h3 className="text-[16px] font-semibold text-[#1a1b1e] mb-1" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Start building your roadmap</h3>
          <p className="text-[14px] text-[#7D8297] mb-5" style={{ fontFamily: 'Open Sans, sans-serif' }}>Add records manually or import from your tools</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="large">
              <Button.IconSlot><IconPlus /></Button.IconSlot>
              <Button.Label>Add record</Button.Label>
            </Button>

            {importVariant === 'dialog' ? (
              <Button variant="primary" size="large" onPress={() => setImportDialogOpen(true)}>
                <Button.IconSlot><IconSquareArrowIn css={{ transform: 'rotate(180deg)' }} /></Button.IconSlot>
                <Button.Label>Import sources</Button.Label>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button variant="primary" size="large">
                    <Button.IconSlot><IconSquareArrowIn css={{ transform: 'rotate(180deg)' }} /></Button.IconSlot>
                    <Button.Label>Import sources</Button.Label>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="bottom" align="center" css={{ minWidth: 180 }}>
                  {importSources.map(({ source, iconSmall, label }) => (
                    <DropdownMenu.Item key={label} onSelect={() => onImportSource?.(source)}>
                      <DropdownMenu.IconSlot>{iconSmall}</DropdownMenu.IconSlot>
                      {label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Version toggle */}
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-lg bg-[#1a1b1e] p-1" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {(['dialog', 'dropdown'] as const).map(v => (
            <button
              key={v}
              onClick={() => { setImportVariant(v); setImportDialogOpen(false) }}
              className="text-[12px] font-medium rounded-md transition-colors"
              style={{
                padding: '6px 12px',
                border: 'none',
                cursor: 'pointer',
                background: importVariant === v ? '#4262FF' : 'transparent',
                color: importVariant === v ? '#fff' : '#9ca3af',
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              {v === 'dialog' ? 'A: Dialog' : 'B: Dropdown'}
            </button>
          ))}
        </div>

        {/* Dialog version */}
        {importDialogOpen && importVariant === 'dialog' && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(99,107,130,0.55)' }}
            onClick={() => setImportDialogOpen(false)}
          >
            <div
              className="bg-white flex flex-col relative"
              style={{
                borderRadius: 16,
                width: 480,
                padding: 40,
                gap: 24,
                boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10">
                <IconButton variant="ghost" size="large" aria-label="Close" onPress={() => setImportDialogOpen(false)}>
                  <IconCross />
                </IconButton>
              </div>

              <h2 className="text-[22px] text-[#1a1b1e] leading-[40px] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Import from</h2>

              <div className="flex flex-col gap-2">
                {importSources.map(({ source, icon, label, description }) => (
                  <button
                    key={label}
                    className="flex items-center gap-4 w-full text-left rounded-xl transition-colors hover:bg-[#f1f2f5] active:bg-[#e9eaef]"
                    style={{ padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    onClick={() => { setImportDialogOpen(false); onImportSource?.(source) }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#f1f2f5] flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[16px] font-semibold text-[#1a1b1e]" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>{label}</span>
                      <span className="text-[13px] text-[#7D8297]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
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
