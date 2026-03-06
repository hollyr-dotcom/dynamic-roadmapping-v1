import { useState, useRef, useEffect } from 'react'
import {
  Tabs,
  IconButton,
  DropdownMenu,
  IconMagnifyingGlass,
  IconSparksFilled,
  IconSlidersY,
  IconPlus,
  IconTable,
  IconKanban,
  IconTimelineFormat,
  IconPen,
  IconSquaresTwoOverlap,
  IconTrash,
  IconChevronDown,
  Tooltip,
} from '@mirohq/design-system'

export const MENU_WIDTH = 220

export type SidebarId = 'space-menu' | 'ai-sidekick' | 'view-settings'
export type ViewType = 'table' | 'kanban' | 'timeline'

export interface TabConfig {
  id: string
  label: string
  type: ViewType
}

const VIEW_TYPE_ICONS: Record<ViewType, React.ReactNode> = {
  table: <IconTable />,
  kanban: <IconKanban />,
  timeline: <IconTimelineFormat />,
}

// Estimate tab width from label text (MDS button tab: ~8px per char + 28px padding)
const estimateTabWidth = (label: string) => Math.ceil(label.length * 8 + 28)

const TAB_GAP = 8
const BUTTON_SIZE = 32   // MDS medium icon button
const BTN_SLOT = BUTTON_SIZE + TAB_GAP // 40px — one button + gap

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
}

export function ViewTabsToolbar({ tabs, activeSidebar, onToggleSidebar, activeTab, onTabChange, onAddView, onRenameTab, onDuplicateTab, onDeleteTab, onReorderTabs }: ViewTabsToolbarProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const [contextTabId, setContextTabId] = useState<string | null>(null)

  // Overflow state
  const [overflowTabIds, setOverflowTabIds] = useState<Set<string>>(new Set())
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false)
  const tabsAreaRef = useRef<HTMLDivElement>(null)
  const tabElMap = useRef<Map<string, HTMLElement>>(new Map())
  const measuredWidths = useRef<Map<string, number>>(new Map())

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
    <div className="group sticky top-0 left-0 z-20 bg-white flex items-center gap-4 pl-14 pr-12 pt-4 pb-6 shrink-0">
      {/* Left: tabs + chevron + plus — tight group */}
      <div ref={tabsAreaRef} className="flex items-center gap-2 flex-1 min-w-0">
        <Tabs value={activeTab} onChange={onTabChange} variant="buttons" size="medium">
          <Tabs.List css={{ gap: '8px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
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
                        css={editingTabId === tab.id ? { visibility: 'hidden' } : undefined}
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
                  <DropdownMenu.Content side="bottom" align="start" css={{ minWidth: MENU_WIDTH }}>
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
              </div>
            ))}
          </Tabs.List>
        </Tabs>

        {/* Overflow chevron — sits right after the last visible tab */}
        {hasOverflow && (
          <div className="shrink-0">
            <Tooltip>
              <DropdownMenu onOpen={() => setIsOverflowMenuOpen(true)} onClose={() => setIsOverflowMenuOpen(false)}>
                <Tooltip.Trigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <IconButton
                      variant="ghost"
                      size="medium"
                      aria-label={`${overflowTabs.length} more views`}
                      css={
                        activeInOverflow
                          ? { background: '#F2F4FC', '& svg': { color: '#2B4DF8' } }
                          : isOverflowMenuOpen
                            ? { background: '#F1F2F5' }
                            : undefined
                      }
                    >
                      <IconChevronDown color="icon-neutrals-subtle" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                </Tooltip.Trigger>
                <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH }}>
                  {overflowTabs.map(tab => (
                    <DropdownMenu.Item
                      key={tab.id}
                      onSelect={() => onTabChange(tab.id)}
                      css={tab.id === activeTab ? { background: '#F2F4FC', color: '#2B4DF8', '& svg': { color: '#2B4DF8' } } : undefined}
                    >
                      <DropdownMenu.IconSlot>{VIEW_TYPE_ICONS[tab.type]}</DropdownMenu.IconSlot>
                      {tab.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu>
              <Tooltip.Content side="top" sideOffset={4}>More views</Tooltip.Content>
            </Tooltip>
          </div>
        )}

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

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        <IconButton aria-label="Search" variant="ghost" size="medium">
          <IconMagnifyingGlass />
        </IconButton>

        <IconButton
          aria-label="AI Sidekick"
          variant="ghost"
          size="medium"
          onPress={() => onToggleSidebar('ai-sidekick')}
          css={activeSidebar === 'ai-sidekick' ? { background: '#F1F2F5' } : undefined}
        >
          <IconSparksFilled />
        </IconButton>

        <IconButton
          aria-label="View settings"
          variant="ghost"
          size="medium"
          onPress={() => onToggleSidebar('view-settings')}
          css={activeSidebar === 'view-settings' ? { background: '#F1F2F5' } : undefined}
        >
          <IconSlidersY />
        </IconButton>

        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="New column" variant="ghost" size="medium">
              <IconPlus />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="bottom" align="end" css={{ minWidth: MENU_WIDTH }}>
            <DropdownMenu.Item>Text</DropdownMenu.Item>
            <DropdownMenu.Item>Number</DropdownMenu.Item>
            <DropdownMenu.Item>Status</DropdownMenu.Item>
            <DropdownMenu.Item>Person</DropdownMenu.Item>
            <DropdownMenu.Item>Date</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>

      </div>
    </div>
  )
}
