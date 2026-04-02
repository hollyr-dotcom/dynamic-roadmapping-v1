import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Tabs,
  IconButton,
  DropdownMenu,
  Popover,
  InputSearch,
  IconMagnifyingGlass,
  IconSparksFilled,
  IconInsights,
  IconSlidersY,
  IconFunnel,
  IconArrowsDownUp,
  IconHorizontalBlocks,
  IconSquareArrowIn,
  IconFileSpreadsheet,
  IconColumnsThree,
  IconPlus,
  IconTable,
  IconKanban,
  IconTimelineFormat,
  IconPen,
  IconSquaresTwoOverlap,
  IconTrash,
  IconChevronDown,
  IconDotsSixVertical,
  IconUsers,
  IconArrowUpRight,
  Tooltip,
} from '@mirohq/design-system'
import { CompanyLogo } from '../CompanyLogo'
import { JiraLogo } from '../JiraLogo'

export const MENU_WIDTH = 220

export type SidebarId = 'space-menu' | 'ai-sidekick' | 'view-settings' | 'row-detail' | 'jira'
export type ViewType = 'table' | 'kanban' | 'timeline'

export interface TabConfig {
  id: string
  label: string
  type: ViewType
}

// Estimate tab width from label text (MDS button tab: ~8px per char + 28px padding)
const estimateTabWidth = (label: string) => Math.ceil(label.length * 8 + 28)

const TAB_GAP = 12
const BUTTON_SIZE = 32   // MDS medium icon button
const BTN_SLOT = BUTTON_SIZE + TAB_GAP // 40px — one button + gap
const ITEM_SLOT = 38     // 36px item height + 2px gap

interface ViewTabsToolbarProps {
  tabs: TabConfig[]
  activeSidebar: SidebarId | null
  onToggleSidebar: (id: SidebarId) => void
  activeTab: string
  onTabChange: (tab: string) => void
  onAddView: (type: ViewType) => void
  onRenameTab: (tabId: string, newLabel: string) => void
  onDuplicateTab: (tabId: string) => void
  onDeleteTab: (tabId: string) => void
  onReorderTabs: (tabs: TabConfig[]) => void
  newColumnMenuOpen: boolean
  onNewColumnMenuOpenChange: (open: boolean) => void
  onDuplicateWidget?: (newTabId: string) => void
  variant?: 'page' | 'widget'
  companyFilter?: string[]
  onClearCompanyFilter?: (name: string) => void
}

export function ViewTabsToolbar({ tabs, activeSidebar, onToggleSidebar, activeTab, onTabChange, onAddView, onRenameTab, onDuplicateTab, onDeleteTab, onReorderTabs, newColumnMenuOpen, onNewColumnMenuOpenChange, onDuplicateWidget, variant = 'page', companyFilter, onClearCompanyFilter }: ViewTabsToolbarProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false)
  const [pendingTabId, setPendingTabId] = useState<string | null>(null)
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const [contextTabId, setContextTabId] = useState<string | null>(null)

  // Overflow state
  const [overflowTabIds, setOverflowTabIds] = useState<Set<string>>(new Set())
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false)
  const [overflowSearch, setOverflowSearch] = useState('')
  const tabsAreaRef = useRef<HTMLDivElement>(null)
  const tabElMap = useRef<Map<string, HTMLElement>>(new Map())
  const measuredWidths = useRef<Map<string, number>>(new Map())

  // Drag-to-reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [dragY, setDragY] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const dragIndexRef = useRef<number | null>(null)
  const dropIndexRef = useRef<number | null>(null)
  const tabsRef = useRef(tabs)
  const didDragRef = useRef(false)
  const dragOffsetY = useRef(0)
  const dragLeftRef = useRef(0)
  const dragWidthRef = useRef(0)

  useEffect(() => { dragIndexRef.current = dragIndex }, [dragIndex])
  useEffect(() => { dropIndexRef.current = dropIndex }, [dropIndex])
  useEffect(() => { tabsRef.current = tabs }, [tabs])

  const handleDragMove = useCallback((e: MouseEvent) => {
    const idx = dragIndexRef.current
    const list = listRef.current
    if (idx === null || !list) return

    setDragY(e.clientY)

    // Find item elements (skip drop indicator divs by filtering to data-tab-item)
    const items = Array.from(list.querySelectorAll('[data-tab-item]')) as HTMLElement[]
    let target = items.length // default: after all items

    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect()
      const midY = rect.top + rect.height / 2
      if (e.clientY < midY) { target = i; break }
    }

    // Hide indicator if drop would be a no-op (same position or adjacent)
    if (target === idx || target === idx + 1) {
      setDropIndex(null)
    } else {
      setDropIndex(target)
    }
  }, [])

  const handleDragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    didDragRef.current = true
    setTimeout(() => { didDragRef.current = false }, 0)
    const from = dragIndexRef.current
    const to = dropIndexRef.current
    setDragIndex(null)
    setDropIndex(null)
    if (from !== null && to !== null) {
      const newOrder = [...tabsRef.current]
      const [moved] = newOrder.splice(from, 1)
      const adjustedTo = to > from ? to - 1 : to
      newOrder.splice(adjustedTo, 0, moved)
      onReorderTabs(newOrder)
    }
  }, [handleDragMove, onReorderTabs])

  const handleDragStart = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    dragOffsetY.current = e.clientY - rect.top
    dragLeftRef.current = rect.left
    dragWidthRef.current = rect.width
    setDragY(e.clientY)
    setDragIndex(index)
    setDropIndex(null)
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  }, [handleDragMove, handleDragEnd])

  // Clean up document listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [handleDragMove, handleDragEnd])

  // Auto-focus and select all when entering edit mode
  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingTabId])

  // Calculate which tabs overflow the container
  useEffect(() => {
    const container = tabsAreaRef.current
    if (!container) return

    const calculate = () => {
      // Measure any visible tabs and store their widths
      for (const tab of tabs) {
        const el = tabElMap.current.get(tab.id)
        if (el && el.offsetWidth > 0) {
          measuredWidths.current.set(tab.id, el.offsetWidth)
        }
      }

      // Get width for each tab: measured if available, estimated otherwise
      const widths = tabs.map(tab => measuredWidths.current.get(tab.id) || estimateTabWidth(tab.label))

      // Total width if all tabs were shown
      const totalTabWidth = widths.reduce((sum, w, i) => sum + w + (i > 0 ? TAB_GAP : 0), 0)
      const containerWidth = container.clientWidth

      // Check: do all tabs fit with just the + button?
      if (totalTabWidth + BTN_SLOT <= containerWidth) {
        setOverflowTabIds(new Set())
        return
      }

      // Need overflow — reserve space for chevron + plus buttons
      const available = containerWidth - BTN_SLOT - BTN_SLOT
      const overflow = new Set<string>()
      let used = 0

      for (let i = 0; i < tabs.length; i++) {
        if (i > 0) used += TAB_GAP
        used += widths[i]
        if (used > available) overflow.add(tabs[i].id)
      }

      // Always keep at least one tab visible
      if (overflow.size === tabs.length) overflow.delete(tabs[0].id)

      setOverflowTabIds(overflow)
    }

    requestAnimationFrame(calculate)
    const observer = new ResizeObserver(calculate)
    observer.observe(container)
    return () => observer.disconnect()
  }, [tabs])

  const startEditing = (tab: TabConfig) => {
    setEditingTabId(tab.id)
    setEditDraft(tab.label)
  }

  const saveEdit = () => {
    if (editingTabId) {
      const trimmed = editDraft.trim()
      if (trimmed) onRenameTab(editingTabId, trimmed)
      setEditingTabId(null)
    }
  }

  const visibleTabs = tabs.filter(t => !overflowTabIds.has(t.id))
  const overflowTabs = tabs.filter(t => overflowTabIds.has(t.id))
  const hasOverflow = overflowTabs.length > 0
  const activeInOverflow = overflowTabIds.has(activeTab)

  return (
    <div
      className={`group sticky top-0 left-0 z-30 bg-white flex items-center gap-4 shrink-0 ${variant === 'widget' ? 'pl-0 pr-0 pt-2 pb-4' : 'pl-14 pt-4 pb-6'}`}
      style={variant === 'page' ? {
        paddingRight: activeSidebar === 'row-detail' ? 376 + 24 + 12 : (activeSidebar && activeSidebar !== 'space-menu' && activeSidebar !== 'ai-sidekick') ? 320 + 12 : 48,
        transition: 'padding-right 300ms cubic-bezier(0.16,1,0.3,1)',
      } : undefined}
    >
      {/* Left: tabs + chevron + plus — tight group */}
      <div ref={tabsAreaRef} className="flex items-center gap-2 flex-1 min-w-0 self-center">
        <Tabs value={activeTab} onChange={(tabId: string) => {
          if (variant === 'widget' && tabId !== activeTab) {
            setPendingTabId(tabId)
          } else {
            onTabChange(tabId)
          }
        }} variant="buttons" size="medium">
          <Tabs.List css={{ gap: '12px', flexWrap: 'nowrap', whiteSpace: 'nowrap', '& button': { borderRadius: 8 } }}>
            {visibleTabs.map((tab) => (
              <div key={tab.id} className="relative shrink-0">
                <DropdownMenu
                  open={contextTabId === tab.id}
                  onClose={() => setContextTabId(null)}
                >
                  <DropdownMenu.Trigger asChild>
                    <div
                      ref={el => { if (el) tabElMap.current.set(tab.id, el); else tabElMap.current.delete(tab.id) }}
                      className="relative"
                      onContextMenu={e => {
                        e.preventDefault()
                        setContextTabId(tab.id)
                      }}
                    >
                      <Tabs.Trigger
                        value={tab.id}
                        onDoubleClick={() => { if (tab.id === activeTab) startEditing(tab) }}
                        css={
                          editingTabId === tab.id
                            ? { visibility: 'hidden' }
                            : pendingTabId === tab.id
                              ? { background: '#F1F2F5', borderRadius: 8 }
                              : undefined
                        }
                      >
                        {editingTabId === tab.id ? editDraft || '\u00A0' : tab.label}
                      </Tabs.Trigger>
                      {editingTabId === tab.id && (
                        <input
                          ref={editInputRef}
                          value={editDraft}
                          onChange={e => setEditDraft(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={e => {
                            if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() }
                            if (e.key === 'Escape') { setEditingTabId(null) }
                          }}
                          className="absolute inset-0 z-10 bg-white rounded-md font-body text-sm font-semibold text-[#222428] text-left outline-none border-none px-3 focus:shadow-[0_0_0_2px_white,0_0_0_4px_#2B4DF8]"
                        />
                      )}
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content side="bottom" align="start" alignOffset={-8} css={{ minWidth: MENU_WIDTH }}>
                    {variant === 'widget' && tab.id !== activeTab && (
                      <>
                        <DropdownMenu.Item onSelect={() => {
                          onTabChange(tab.id)
                        }}>
                          <DropdownMenu.IconSlot><IconUsers /></DropdownMenu.IconSlot>
                          Change view for everyone
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={() => {
                          onDuplicateWidget?.(tab.id)
                        }}>
                          <DropdownMenu.IconSlot><IconArrowUpRight /></DropdownMenu.IconSlot>
                          Copy and sync
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                      </>
                    )}
                    <DropdownMenu.Item onSelect={() => {
                      if (tab.id !== activeTab) onTabChange(tab.id)
                      startEditing(tab)
                    }}>
                      <DropdownMenu.IconSlot><IconPen /></DropdownMenu.IconSlot>
                      Rename
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => onDuplicateTab(tab.id)}>
                      <DropdownMenu.IconSlot><IconSquaresTwoOverlap /></DropdownMenu.IconSlot>
                      Duplicate
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      aria-disabled={tabs.length <= 1}
                      onSelect={() => { if (tabs.length > 1) onDeleteTab(tab.id) }}
                    >
                      <DropdownMenu.IconSlot><IconTrash /></DropdownMenu.IconSlot>
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>

                {/* Tab-switch confirmation dropdown (widget variant only) */}
                {variant === 'widget' && (
                  <DropdownMenu
                    open={pendingTabId === tab.id}
                    onClose={() => setPendingTabId(null)}
                  >
                    <DropdownMenu.Trigger asChild>
                      <div className="absolute inset-0 pointer-events-none" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content side="bottom" align="start" alignOffset={-8} css={{ minWidth: MENU_WIDTH }}>
                      <DropdownMenu.Item onSelect={() => {
                        onTabChange(tab.id)
                        setPendingTabId(null)
                      }}>
                        <DropdownMenu.IconSlot><IconUsers /></DropdownMenu.IconSlot>
                        Change view for everyone
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onSelect={() => {
                        onDuplicateWidget?.(tab.id)
                        setPendingTabId(null)
                      }}>
                        <DropdownMenu.IconSlot><IconArrowUpRight /></DropdownMenu.IconSlot>
                        Copy and sync
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </Tabs.List>
        </Tabs>

        {/* Overflow chevron — shows all tabs for reordering */}
        {hasOverflow && (() => {
          const filteredTabs = overflowSearch
            ? tabs.filter(t => t.label.toLowerCase().includes(overflowSearch.toLowerCase()))
            : tabs
          return (
            <div className="shrink-0">
              <Tooltip>
                <Popover
                  variant="light"
                  open={isOverflowMenuOpen}
                  onOpen={() => setIsOverflowMenuOpen(true)}
                  onClose={() => {
                    if (dragIndexRef.current !== null) return
                    setIsOverflowMenuOpen(false)
                    setOverflowSearch('')
                  }}
                >
                  <Tooltip.Trigger asChild>
                    <Popover.Trigger asChild>
                      <IconButton
                        variant="ghost"
                        size="medium"
                        aria-label="All views"
                        css={
                          activeInOverflow
                            ? { borderRadius: 8, background: '#F2F4FC', '& svg': { color: '#2B4DF8' } }
                            : isOverflowMenuOpen
                              ? { borderRadius: 8, background: '#F1F2F5' }
                              : { borderRadius: 8 }
                        }
                      >
                        <IconChevronDown color="icon-neutrals-subtle" />
                      </IconButton>
                    </Popover.Trigger>
                  </Tooltip.Trigger>
                  <Popover.Content
                    side="bottom"
                    align="start"
                    alignOffset={-12}
                    anchor="none"
                    sideOffset={4}
                    css={{ width: MENU_WIDTH, padding: 0, overflow: 'hidden', borderRadius: 12 }}
                    onOpenAutoFocus={e => {
                      e.preventDefault()
                      setTimeout(() => {
                        const input = (e.target as HTMLElement)?.querySelector('input[type="search"], input')
                        if (input) (input as HTMLElement).focus()
                      }, 0)
                    }}
                  >
                    <Popover.Close aria-label="Close" css={{ display: 'none' }} />
                    <div style={{ padding: '12px 12px 0' }}>
                      <InputSearch
                        size="medium"
                        placeholder="Find a view"
                        clearable
                        clearLabel="Clear search"
                        value={overflowSearch}
                        onChange={e => setOverflowSearch(e.target.value)}
                        css={{ '&:focus-within': { boxShadow: 'none' } }}
                      />
                    </div>
                    <div ref={listRef} className="overflow-y-auto panel-scroll flex flex-col" style={{ maxHeight: 320, padding: '8px 12px 12px' }}>
                      {filteredTabs.length > 0 ? (
                        filteredTabs.map((tab: TabConfig, index: number) => {
                          const isActive = tab.id === activeTab
                          const isDragging = dragIndex === index
                          const IconComponent = { table: IconTable, kanban: IconKanban, timeline: IconTimelineFormat }[tab.type]

                          // Compute vertical shift for live-reorder preview
                          let shift = 0
                          if (dragIndex !== null && dropIndex !== null && !isDragging) {
                            if (dropIndex < dragIndex && index >= dropIndex && index < dragIndex) {
                              shift = ITEM_SLOT // shift down
                            } else if (dropIndex > dragIndex && index > dragIndex && index < dropIndex) {
                              shift = -ITEM_SLOT // shift up
                            }
                          }

                          return (
                            <div
                              key={tab.id}
                              data-tab-item
                              className="relative"
                              style={{
                                ...(isDragging ? { height: ITEM_SLOT } : {}),
                                transform: shift !== 0 ? `translateY(${shift}px)` : undefined,
                                transition: dragIndex !== null ? 'transform 150ms ease' : undefined,
                              }}
                            >
                              <div
                                className={`group/item flex items-center gap-2 rounded-md font-body text-sm text-left select-none ${
                                  isDragging
                                    ? 'opacity-0'
                                    : isActive
                                      ? 'bg-[#F2F4FC] text-[#2B4DF8]'
                                      : 'text-[#222428] hover:bg-[#F1F2F5]'
                                }`}
                                style={{
                                  height: 36,
                                  padding: '0 8px',
                                  cursor: dragIndex !== null ? 'grabbing' : 'pointer',
                                  marginTop: index === 0 ? 0 : 2,
                                }}
                                onMouseDown={(e) => { if (!overflowSearch) handleDragStart(index, e) }}
                                onClick={() => {
                                  if (dragIndex !== null || didDragRef.current) return
                                  onTabChange(tab.id)
                                  setIsOverflowMenuOpen(false)
                                  setOverflowSearch('')
                                }}
                              >
                                <span className={`shrink-0 flex items-center justify-center ${isActive && dragIndex === null ? 'text-[#2B4DF8]' : 'text-[#222428]'}`}>
                                  <span className={`flex items-center justify-center ${isDragging ? 'hidden' : 'group-hover/item:hidden'}`}>
                                    <IconComponent size="small" />
                                  </span>
                                  <span className={`flex items-center justify-center ${isDragging ? '' : 'hidden group-hover/item:flex'} text-[#AEB2C0]`} style={{ cursor: 'grab' }}>
                                    <IconDotsSixVertical size="small" />
                                  </span>
                                </span>
                                <span className="truncate">{tab.label}</span>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center font-body text-sm text-[#7D8297]" style={{ padding: '32px 8px' }}>
                          No views found
                        </div>
                      )}
                    </div>
                  </Popover.Content>
                </Popover>
                <Tooltip.Content side="top" sideOffset={4}>All views</Tooltip.Content>
              </Tooltip>
            </div>
          )
        })()}

        {/* New View + button — hover-reveal, stays visible while menu is open */}
        <div className={`shrink-0 transition-all duration-200 ease-out ${
          isAddMenuOpen
            ? 'opacity-100 scale-100 translate-x-0'
            : 'opacity-0 scale-[0.85] -translate-x-1.5 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:pointer-events-auto'
        }`}>
          <Tooltip>
            <DropdownMenu onOpen={() => setIsAddMenuOpen(true)} onClose={() => setIsAddMenuOpen(false)}>
              <Tooltip.Trigger asChild>
                <DropdownMenu.Trigger asChild>
                  <IconButton
                    aria-label="Add a view"
                    variant="ghost"
                    size="medium"
                    css={{ borderRadius: 8 }}
                  >
                    <IconPlus color="icon-neutrals-subtle" />
                  </IconButton>
                </DropdownMenu.Trigger>
              </Tooltip.Trigger>
              <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH }}>
                <DropdownMenu.Item onSelect={() => onAddView('table')}>
                  <DropdownMenu.IconSlot><IconTable /></DropdownMenu.IconSlot>
                  Table
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onAddView('kanban')}>
                  <DropdownMenu.IconSlot><IconKanban /></DropdownMenu.IconSlot>
                  Kanban
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onAddView('timeline')}>
                  <DropdownMenu.IconSlot><IconTimelineFormat /></DropdownMenu.IconSlot>
                  Timeline
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
            <Tooltip.Content side="top" sideOffset={4}>Add a view</Tooltip.Content>
          </Tooltip>
        </div>
      </div>

      {/* Company filter chips */}
      {companyFilter && companyFilter.length > 0 && (
        <div className="flex items-center gap-1.5 shrink-0 self-center">
          {companyFilter.map(name => (
            <Tooltip key={name}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => onClearCompanyFilter?.(name)}
                  className="flex items-center gap-1.5"
                  style={{
                    height: 32,
                    padding: '0 8px 0 6px',
                    borderRadius: 8,
                    background: '#F1F2F5',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#E0E1E6')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F1F2F5')}
                  aria-label={`Remove ${name} filter`}
                >
                  <CompanyLogo name={name} size={28} noTooltip />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 2, flexShrink: 0 }}>
                    <path d="M9 3L3 9M3 3l6 6" stroke="#3C3F4A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" sideOffset={4}>Remove filter</Tooltip.Content>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Right: actions — disabled (no handlers) on canvas widget */}
      <div className="flex items-center gap-1 shrink-0 self-center">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Search" variant="ghost" size="medium" css={{ borderRadius: 8 }}>
              <IconMagnifyingGlass />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>
            Search
            <Tooltip.Hotkey>⌘ + F</Tooltip.Hotkey>
          </Tooltip.Content>
        </Tooltip>

        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton
              aria-label="Sidekick"
              variant="ghost"
              size="medium"
              onPress={variant !== 'widget' ? () => onToggleSidebar('ai-sidekick') : undefined}
              css={activeSidebar === 'ai-sidekick' && variant !== 'widget' ? { borderRadius: 8, background: '#F1F2F5' } : { borderRadius: 8 }}
            >
              <IconSparksFilled />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>
            Sidekick
            <Tooltip.Hotkey>⌘ + K</Tooltip.Hotkey>
          </Tooltip.Content>
        </Tooltip>

        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Group" variant="ghost" size="medium" css={{ borderRadius: 8, cursor: 'default' }}>
              <IconHorizontalBlocks />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>Group</Tooltip.Content>
        </Tooltip>

        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Filter" variant="ghost" size="medium" css={{ borderRadius: 8 }}>
              <IconFunnel />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>Filter</Tooltip.Content>
        </Tooltip>

        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Sort" variant="ghost" size="medium" css={{ borderRadius: 8 }}>
              <IconArrowsDownUp />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>Sort</Tooltip.Content>
        </Tooltip>

        <DropdownMenu onOpen={() => setIsImportMenuOpen(true)} onClose={() => setIsImportMenuOpen(false)}>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <DropdownMenu.Trigger asChild>
                <IconButton aria-label="Import" variant="ghost" size="medium" css={isImportMenuOpen ? { borderRadius: 8, background: '#F1F2F5' } : { borderRadius: 8 }}>
                  <IconSquareArrowIn css={{ transform: 'rotate(180deg)' }} />
                </IconButton>
              </DropdownMenu.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content side="top" sideOffset={4}>
              Import
              <Tooltip.Hotkey>⌘ + I</Tooltip.Hotkey>
            </Tooltip.Content>
          </Tooltip>
          <DropdownMenu.Content side="bottom" align="center" css={{ minWidth: 180 }}>
            <DropdownMenu.Item css={{ cursor: 'default' }}>
              <DropdownMenu.IconSlot><JiraLogo size={20} /></DropdownMenu.IconSlot>
              Jira
            </DropdownMenu.Item>
            <DropdownMenu.Item css={{ cursor: 'default' }}>
              <DropdownMenu.IconSlot><IconFileSpreadsheet /></DropdownMenu.IconSlot>
              CSV
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>

        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton
              aria-label="View settings"
              variant="ghost"
              size="medium"
              onPress={variant !== 'widget' ? () => onToggleSidebar('view-settings') : undefined}
              css={activeSidebar === 'view-settings' && variant !== 'widget' ? { borderRadius: 8, background: '#F1F2F5' } : { borderRadius: 8 }}
            >
              <IconSlidersY />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>
            View settings
            <Tooltip.Hotkey>⌘ + ,</Tooltip.Hotkey>
          </Tooltip.Content>
        </Tooltip>

        {variant !== 'widget' ? (
          <Tooltip>
            <DropdownMenu open={newColumnMenuOpen} onOpen={() => onNewColumnMenuOpenChange(true)} onClose={() => onNewColumnMenuOpenChange(false)}>
              <Tooltip.Trigger asChild>
                <DropdownMenu.Trigger asChild>
                  <IconButton aria-label="New column" variant="ghost" size="medium" css={{ borderRadius: 8 }}>
                    <IconPlus />
                  </IconButton>
                </DropdownMenu.Trigger>
              </Tooltip.Trigger>
              <DropdownMenu.Content side="bottom" align="end" css={{ minWidth: MENU_WIDTH }}>
                <DropdownMenu.Item>Text</DropdownMenu.Item>
                <DropdownMenu.Item>Number</DropdownMenu.Item>
                <DropdownMenu.Item>Status</DropdownMenu.Item>
                <DropdownMenu.Item>Person</DropdownMenu.Item>
                <DropdownMenu.Item>Date</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
            <Tooltip.Content side="top" sideOffset={4}>
              New column
              <Tooltip.Hotkey>+</Tooltip.Hotkey>
            </Tooltip.Content>
          </Tooltip>
        ) : (
          <Tooltip>
            <Tooltip.Trigger asChild>
              <IconButton aria-label="New column" variant="ghost" size="medium" css={{ borderRadius: 8 }}>
                <IconPlus />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content side="top" sideOffset={4}>
              New column
              <Tooltip.Hotkey>+</Tooltip.Hotkey>
            </Tooltip.Content>
          </Tooltip>
        )}

      </div>

      {/* Floating ghost row — rendered outside popover to escape overflow/transform clipping */}
      {dragIndex !== null && tabs[dragIndex] && (() => {
        const ghostTab = tabs[dragIndex]
        return (
          <div
            className="flex items-center gap-2 rounded-md font-body text-sm text-left select-none bg-white text-[#222428]"
            style={{
              position: 'fixed',
              top: dragY - dragOffsetY.current,
              left: dragLeftRef.current,
              width: dragWidthRef.current,
              height: 36,
              padding: '0 8px',
              zIndex: 9999,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
              pointerEvents: 'none',
              cursor: 'grabbing',
              opacity: 0.75,
            }}
          >
            <span className="shrink-0 flex items-center justify-center text-[#AEB2C0]">
              <IconDotsSixVertical size="small" />
            </span>
            <span className="truncate">{ghostTab.label}</span>
          </div>
        )
      })()}
    </div>
  )
}
