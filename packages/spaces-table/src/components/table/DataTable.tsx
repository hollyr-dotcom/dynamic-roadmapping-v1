import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { IconPlus, IconFileSpreadsheet, IconLightbulb } from '@mirohq/design-system'
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
  onImportSource?: (source: 'jira' | 'csv' | 'backlog') => void
  onAddRecord?: (title?: string) => void
  activePage?: 'backlog' | 'roadmap' | 'overview'
  animateIn?: boolean
  onEmptyInteract?: () => void
  onAddToBoard?: (rowId: string) => void
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract, isImporting, onImportComplete, onMoveToRoadmap, showMoveToRoadmap, onImportSource, onAddRecord, activePage = 'roadmap', animateIn = true, onEmptyInteract, onAddToBoard }: DataTableProps) {
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

  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemFocused, setNewItemFocused] = useState(false)
  const newItemInputRef = useRef<HTMLInputElement>(null)

  if (data.length === 0) {
    return (
      <div
        className={`flex-1 flex flex-col min-h-full${animateInRef.current ? ' item-enter' : ''}`}
        style={animateInRef.current ? { animationDelay: '80ms' } : undefined}
      >
        {/* Centered content — two sections */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-[400px] flex flex-col items-center" style={{ paddingBottom: 160 }}>

            {/* Section 1: Start with a new idea */}
            <h3 className="text-[18px] font-semibold text-[#1a1b1e] mb-4 text-center" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>
              {activePage === 'roadmap' ? 'Add a new roadmap item' : 'Start with a new idea'}
            </h3>
            <div
              className="group/idea w-full flex items-center gap-2 px-4 py-3 rounded-xl mb-14 cursor-text bg-[#f1f2f5]"
              onClick={() => newItemInputRef.current?.focus()}
            >
              <input
                ref={newItemInputRef}
                type="text"
                value={newItemTitle}
                onChange={e => setNewItemTitle(e.target.value)}
                onFocus={() => { setNewItemFocused(true); onEmptyInteract?.() }}
                onBlur={() => setNewItemFocused(false)}
                onKeyDown={e => { if (e.key === 'Enter' && newItemTitle.trim()) onAddRecord?.(newItemTitle.trim()) }}
                placeholder={activePage === 'roadmap' ? 'Write a title' : 'Write a roadmap idea'}
                className="flex-1 text-[14px] text-[#1a1b1e] placeholder:text-[#AEB2C0] bg-transparent outline-none"
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
              />
              <button
                className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 ${newItemTitle.trim() ? 'opacity-100 bg-[#4262FF] text-white hover:bg-[#3350e0] active:bg-[#2b44c7]' : 'opacity-0 pointer-events-none'}`}
                onClick={e => { e.stopPropagation(); if (newItemTitle.trim()) onAddRecord?.(newItemTitle.trim()) }}
              >
                <IconPlus css={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Section 2: Add existing ideas */}
            <h3 className="text-[18px] font-semibold text-[#1a1b1e] mb-4 text-center" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>
              {activePage === 'roadmap' ? 'Add existing roadmap items' : 'Add existing ideas'}
            </h3>
            <div className="w-full flex flex-col gap-0">
              {([
                ...(activePage === 'roadmap' ? [{ id: 'backlog', label: 'Move idea from backlog' }] : []),
                { id: 'jira', label: 'Import Jira issues' },
                { id: 'csv',  label: 'Upload CSV' },
              ] as const).map(source => (
                <div
                  key={source.id}
                  className="group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-[#f1f2f5] transition-colors"
                  onClick={() => onImportSource?.(source.id as 'jira' | 'csv' | 'backlog')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                      {source.id === 'backlog' && <IconLightbulb css={{ width: 20, height: 20, color: '#222428' }} />}
                      {source.id === 'jira' && <JiraLogo size={20} />}
                      {source.id === 'csv' && <IconFileSpreadsheet css={{ width: 20, height: 20, color: '#222428' }} />}
                    </div>
                    <span className="text-[14px] text-[#1a1b1e]" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
                      {source.label}
                    </span>
                  </div>
                  <button
                    className="shrink-0 ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#e9eaef] text-[#1a1b1e] group-hover:bg-[#4262FF] group-hover:border-transparent group-hover:text-white transition-colors"
                    onClick={e => { e.stopPropagation(); onImportSource?.(source.id as 'jira' | 'csv' | 'backlog') }}
                  >
                    <IconPlus css={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ))}
            </div>

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
              onAddToBoard={onAddToBoard ? (rowId: string) => onAddToBoard(rowId) : undefined}
            />
          ))}
        </tbody>
      </table>

    </div>
  )
}
