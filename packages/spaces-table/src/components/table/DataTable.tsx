import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpaceRow, FieldDefinition } from '@spaces/shared'
import { IconFileSpreadsheet, IconInsights, IconPlus, IconSquareArrowIn, DropdownMenu } from '@mirohq/design-system'
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
  onAddRecord?: (title?: string) => void
  activePage?: 'backlog' | 'roadmap'
  animateIn?: boolean
  onAgentAdded?: (agentName: string) => void
  spaceName?: string
  onEmptyInteract?: () => void
}

export function DataTable({ data, fields, onRowClick, onCompanyClick, updatedRows, insightsAllDots, onTableInteract, isImporting, onImportComplete, onMoveToRoadmap, showMoveToRoadmap, onImportSource, onAddRecord, activePage = 'roadmap', animateIn = true, onAgentAdded, spaceName, onEmptyInteract }: DataTableProps) {
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
  const newItemInputRef = useRef<HTMLInputElement>(null)
  const [addedAgents, setAddedAgents] = useState<Set<string>>(new Set())
  const [exitingAgents, setExitingAgents] = useState<Set<string>>(new Set())
  const agentsContainerRef = useRef<HTMLDivElement>(null)
  const agentsMinHeight = useRef<number | undefined>(undefined)

  const AGENTS = [
    { id: 'insights', label: 'Insights', description: 'Auto-enrich records with customer signals' },
    { id: 'jira',     label: 'Jira',     description: 'Sync issues from your Jira projects' },
    { id: 'csv',      label: 'CSV',      description: 'Auto-import new records from a spreadsheet' },
  ]

  const handleAddAgent = (id: string, label: string) => {
    // Lock the container height on first removal so scroll area doesn't shrink
    if (agentsMinHeight.current === undefined && agentsContainerRef.current) {
      agentsMinHeight.current = agentsContainerRef.current.offsetHeight
    }
    setExitingAgents(prev => new Set(prev).add(id))
    setTimeout(() => {
      setAddedAgents(prev => new Set(prev).add(id))
      setExitingAgents(prev => { const s = new Set(prev); s.delete(id); return s })
      onAgentAdded?.(label)
    }, 320)
  }

  if (data.length === 0) {
    const visibleAgents = AGENTS.filter(a => !addedAgents.has(a.id))
    return (
      <div
        className={`flex-1 flex flex-col min-h-full${animateInRef.current ? ' item-enter' : ''}`}
        style={animateInRef.current ? { animationDelay: '80ms' } : undefined}
      >
        {/* Centered content — two sections */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-[400px] flex flex-col items-center" style={{ paddingBottom: 160 }}>
            {/* Section 1: Add an idea */}
            <h3 className="text-[18px] font-semibold text-[#1a1b1e] mb-3 text-center" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>
              {activePage === 'backlog' ? 'Add your first idea' : 'Add your first roadmap item'}
            </h3>
            <div
              className="group/idea w-full flex items-center gap-2 px-4 py-3 rounded-xl mb-10 cursor-text"
              style={{ border: '1px solid #e9eaef' }}
              onClick={() => newItemInputRef.current?.focus()}
            >
              <input
                ref={newItemInputRef}
                type="text"
                value={newItemTitle}
                onChange={e => setNewItemTitle(e.target.value)}
                onFocus={() => onEmptyInteract?.()}
                onKeyDown={e => { if (e.key === 'Enter' && newItemTitle.trim()) onAddRecord?.(newItemTitle.trim()) }}
                placeholder={activePage === 'backlog' ? 'What are you thinking about?' : 'Add a title...'}
                className="flex-1 text-[14px] text-[#1a1b1e] placeholder:text-[#AEB2C0] bg-transparent outline-none"
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
              />
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[#7D8297] opacity-0 group-hover/idea:opacity-100 transition-opacity duration-150 hover:bg-[#f1f2f5] hover:text-[#1a1b1e] active:bg-[#e6e7ea]"
                    onClick={e => e.stopPropagation()}
                  >
                    <IconSquareArrowIn css={{ width: 16, height: 16, transform: 'rotate(180deg)' }} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="bottom" align="end" css={{ minWidth: 180 }}>
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
              <button
                className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${newItemTitle.trim() ? 'bg-[#4262FF] text-white hover:bg-[#3350e0] active:bg-[#2b44c7]' : 'bg-[#e9eaef] text-[#AEB2C0]'}`}
                onClick={e => { e.stopPropagation(); if (newItemTitle.trim()) onAddRecord?.(newItemTitle.trim()) }}
              >
                <IconPlus css={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Section 2: Add import agents */}
            {visibleAgents.length > 0 && (<>
            <h3 className="text-[18px] font-semibold text-[#1a1b1e] mb-3 text-center" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>
              Add import agents
            </h3>
              <div ref={agentsContainerRef} className="w-full flex flex-col gap-3" style={{ minHeight: agentsMinHeight.current }}>
                {AGENTS.map(agent => {
                  if (addedAgents.has(agent.id)) return null
                  const isExiting = exitingAgents.has(agent.id)
                  return (
                    <div
                      key={agent.id}
                      className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer${isExiting ? ' agent-exit' : ''}`}
                      style={{ border: '1px solid #e9eaef' }}
                      onClick={() => handleAddAgent(agent.id, agent.label)}
                    >
                      {/* Icon + text */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                          {agent.id === 'insights' && <IconInsights css={{ width: 20, height: 20, color: '#222428' }} />}
                          {agent.id === 'jira' && <JiraLogo size={20} />}
                          {agent.id === 'csv' && <IconFileSpreadsheet css={{ width: 20, height: 20, color: '#222428' }} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>
                            {agent.label}
                          </span>
                          <span className="text-[12px] text-[#7D8297]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                            {agent.description}
                          </span>
                        </div>
                      </div>

                      {/* Plus button — no border, shows hover bg whenever the card is hovered */}
                      <button
                        className="opacity-0 group-hover:opacity-100 group-hover:bg-[#f1f2f5] group-hover:text-[#1a1b1e] transition-opacity duration-150 shrink-0 ml-3 w-8 h-8 flex items-center justify-center rounded-full text-[#7D8297] hover:bg-[#e6e7ea] active:bg-[#dcdde0]"
                        onClick={() => handleAddAgent(agent.id, agent.label)}
                      >
                        <IconPlus css={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </>)}
          </div>
        </div>

        {/* Fixed bottom fade — 0% at top, 100% white at viewport bottom; cards scroll under it */}
        {visibleAgents.length > 0 && (
          <div
            className="fixed bottom-0 left-0 right-0 pointer-events-none z-30"
            style={{ height: 120, background: 'linear-gradient(to bottom, transparent, white)' }}
          />
        )}
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
