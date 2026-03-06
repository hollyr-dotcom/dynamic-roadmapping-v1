import { useState, useRef, useCallback } from 'react'
import { sampleData, fields, roadmapData, roadmapFields } from '@spaces/shared'
import type { Priority } from '@spaces/shared'
import { TopNavBar } from './components/page/TopNavBar'
import { DatabaseTitle } from './components/page/DatabaseTitle'
import { ViewTabsToolbar, type SidebarId, type TabConfig, type ViewType } from './components/page/ViewTabsToolbar'
import { DataTable } from './components/table'
import { KanbanBoard } from './components/kanban'
import { TimelinePlaceholder } from './components/timeline'
import { SidebarShell } from './components/sidebar/SidebarShell'
import { SpaceMenu } from './components/sidebar/SpaceMenu'
import { AiSidekickPanel } from './components/sidebar/AiSidekickPanel'
import { SidePanel } from './components/sidebar/SidePanel'

type PageId = 'backlog' | 'roadmap'

interface PageConfig {
  title: string
  tabs: TabConfig[]
  defaultTab: string
}

const PAGE_CONFIGS: Record<PageId, PageConfig> = {
  backlog: {
    title: 'Backlog',
    tabs: [
      { id: 'all-items', label: 'All items', type: 'table' },
      { id: 'prioritization', label: 'Kanban', type: 'kanban' },
      { id: 'by-status', label: 'By status', type: 'kanban' },
      { id: 'timeline-view', label: 'Timeline', type: 'timeline' },
      { id: 'revenue', label: 'Revenue breakdown', type: 'table' },
      { id: 'customer-impact', label: 'Customer impact', type: 'table' },
      { id: 'team-capacity', label: 'Team capacity', type: 'kanban' },
      { id: 'sprint-planning', label: 'Sprint planning', type: 'table' },
      { id: 'quarterly-goals', label: 'Quarterly goals', type: 'timeline' },
      { id: 'archive', label: 'Archive', type: 'table' },
    ],
    defaultTab: 'all-items',
  },
  roadmap: {
    title: 'Roadmap',
    tabs: [
      { id: 'roadmap', label: 'Roadmap', type: 'timeline' },
      { id: 'kanban', label: 'Kanban', type: 'kanban' },
      { id: 'done', label: 'Done', type: 'table' },
    ],
    defaultTab: 'roadmap',
  },
}

const ROADMAP_KANBAN_COLUMNS: Priority[] = ['now', 'next', 'later']

export function App() {
  const [scrollFade, setScrollFade] = useState(0)
  const [activePage, setActivePage] = useState<PageId>('backlog')
  const [databaseTitle, setDatabaseTitle] = useState('Backlog')
  const [activeSidebar, setActiveSidebar] = useState<SidebarId | null>(null)
  const [activeTab, setActiveTab] = useState('all-items')
  const [pageTabs, setPageTabs] = useState<Record<PageId, TabConfig[]>>({
    backlog: PAGE_CONFIGS.backlog.tabs,
    roadmap: PAGE_CONFIGS.roadmap.tabs,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = (id: SidebarId) =>
    setActiveSidebar((prev) => (prev === id ? null : id))

  const closeSidebar = () => setActiveSidebar(null)

  const switchPage = useCallback((pageId: string) => {
    const id = pageId as PageId
    if (id === activePage) return
    const config = PAGE_CONFIGS[id]
    setActivePage(id)
    setActiveTab(config.defaultTab)
    setDatabaseTitle(config.title)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
      setScrollFade(0)
    }
  }, [activePage])

  const handleAddView = useCallback((type: ViewType) => {
    const currentTabs = pageTabs[activePage]
    const typeLabels: Record<ViewType, string> = { table: 'Table', kanban: 'Kanban', timeline: 'Timeline' }
    const baseLabel = typeLabels[type]
    const existingLabels = new Set(currentTabs.map(t => t.label))
    let label = baseLabel
    let n = 2
    while (existingLabels.has(label)) { label = `${baseLabel} ${n}`; n++ }
    const id = `${type}-${Date.now()}`
    const newTab: TabConfig = { id, label, type }
    setPageTabs(prev => ({ ...prev, [activePage]: [...prev[activePage], newTab] }))
    setActiveTab(id)
  }, [activePage, pageTabs])

  const handleRenameTab = useCallback((tabId: string, newLabel: string) => {
    setPageTabs(prev => ({
      ...prev,
      [activePage]: prev[activePage].map(t => t.id === tabId ? { ...t, label: newLabel } : t),
    }))
  }, [activePage])

  const handleDuplicateTab = useCallback((tabId: string) => {
    const currentTabs = pageTabs[activePage]
    const sourceIndex = currentTabs.findIndex(t => t.id === tabId)
    if (sourceIndex === -1) return
    const source = currentTabs[sourceIndex]
    // Generate a unique label: "Kanban" → "Kanban 2", "Kanban 2" → "Kanban 3"
    const existingLabels = new Set(currentTabs.map(t => t.label))
    const baseMatch = source.label.match(/^(.+?)\s+(\d+)$/)
    const base = baseMatch ? baseMatch[1] : source.label
    let n = baseMatch ? parseInt(baseMatch[2]) + 1 : 2
    let label = `${base} ${n}`
    while (existingLabels.has(label)) { n++; label = `${base} ${n}` }
    const newTab: TabConfig = { id: `${source.type}-${Date.now()}`, label, type: source.type }
    const updated = [...currentTabs]
    updated.splice(sourceIndex + 1, 0, newTab)
    setPageTabs(prev => ({ ...prev, [activePage]: updated }))
    setActiveTab(newTab.id)
  }, [activePage, pageTabs])

  const handleDeleteTab = useCallback((tabId: string) => {
    const currentTabs = pageTabs[activePage]
    if (currentTabs.length <= 1) return
    const index = currentTabs.findIndex(t => t.id === tabId)
    if (index === -1) return
    const updated = currentTabs.filter(t => t.id !== tabId)
    setPageTabs(prev => ({ ...prev, [activePage]: updated }))
    if (activeTab === tabId) {
      // Switch to right neighbour, or left if deleted tab was last
      const nextIndex = index < updated.length ? index : updated.length - 1
      setActiveTab(updated[nextIndex].id)
    }
  }, [activePage, pageTabs, activeTab])

  const handleReorderTabs = useCallback((reorderedTabs: TabConfig[]) => {
    setPageTabs(prev => ({ ...prev, [activePage]: reorderedTabs }))
  }, [activePage])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const fadeStart = 10
    const fadeZone = 25
    const scrollTop = e.currentTarget.scrollTop
    setScrollFade(Math.max(0, Math.min(1, (scrollTop - fadeStart) / fadeZone)))
  }

  const isLeftOpen = activeSidebar === 'space-menu'
  const isRightOpen = activeSidebar === 'ai-sidekick' || activeSidebar === 'view-settings'
  // Dynamic view rendering
  const currentTabs = pageTabs[activePage]
  const activeTabConfig = currentTabs.find(t => t.id === activeTab)
  const pageData = activePage === 'backlog' ? sampleData : roadmapData
  const pageFields = activePage === 'backlog' ? fields : roadmapFields
  const viewData = activeTab === 'done' ? pageData.filter(r => r.status === 'done') : pageData

  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden">
      {/* Left sidebar slot */}
      <div
        className="shrink-0 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: isLeftOpen ? 280 : 0 }}
      >
        <SidebarShell side="left" onClose={closeSidebar} showClose={false} width={280}>
          <SpaceMenu onClose={closeSidebar} activePage={activePage} onPageChange={switchPage} />
        </SidebarShell>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNavBar
          borderOpacity={scrollFade}
          scrollFade={scrollFade}
          databaseTitle={databaseTitle}
          isMenuOpen={isLeftOpen}
          onToggleMenu={() => toggleSidebar('space-menu')}
        />
        {/* Scroll area — vertical + horizontal, table header sticks below toolbar */}
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-auto page-scroll flex flex-col">
          <DatabaseTitle opacity={1 - scrollFade} title={databaseTitle} onTitleChange={setDatabaseTitle} />
          <ViewTabsToolbar tabs={currentTabs} activeSidebar={activeSidebar} onToggleSidebar={toggleSidebar} activeTab={activeTab} onTabChange={setActiveTab} onAddView={handleAddView} onRenameTab={handleRenameTab} onDuplicateTab={handleDuplicateTab} onDeleteTab={handleDeleteTab} onReorderTabs={handleReorderTabs} />

          {/* Type-based view renderer */}
          {activeTabConfig?.type === 'table' && (
            <DataTable key={activeTab} data={viewData} fields={pageFields} />
          )}
          {activeTabConfig?.type === 'kanban' && (
            <KanbanBoard key={activeTab} data={viewData} fields={pageFields} columns={activePage === 'roadmap' ? ROADMAP_KANBAN_COLUMNS : undefined} />
          )}
          {activeTabConfig?.type === 'timeline' && (
            <TimelinePlaceholder key={activeTab} />
          )}
        </div>
      </div>

      {/* Right sidebar slot */}
      <div
        className="shrink-0 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: isRightOpen ? 400 : 0 }}
      >
        <SidebarShell side="right" onClose={closeSidebar}>
          {activeSidebar === 'view-settings' && <SidePanel />}
          {activeSidebar === 'ai-sidekick' && <AiSidekickPanel />}
        </SidebarShell>
      </div>
    </div>
  )
}
