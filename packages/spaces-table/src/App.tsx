import { useState, useRef, useCallback, useEffect } from 'react'
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
import { CanvasOverlay } from './components/canvas/CanvasOverlay'
import { CanvasTableWidget } from './components/canvas/CanvasTableWidget'
import { CanvasPillButton } from './components/canvas/CanvasPillButton'
import { CanvasNavPanels } from './components/canvas/CanvasNavPanels'

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
      { id: 'timeline-view', label: 'Timeline', type: 'timeline' },
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

  const [newColumnMenuOpen, setNewColumnMenuOpen] = useState(false)
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [navHovered, setNavHovered] = useState(false)

  const toggleSidebar = useCallback((id: SidebarId) =>
    setActiveSidebar((prev) => (prev === id ? null : id)), [])

  const toggleCanvas = useCallback(() => {
    setCanvasOpen(prev => {
      if (!prev) setActiveSidebar(null)
      return !prev
    })
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const target = e.target as HTMLElement
      const isEditing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === 'Escape' && canvasOpen) {
        e.preventDefault()
        setCanvasOpen(false)
        return
      }

      if (meta && e.key === 'k') {
        e.preventDefault()
        toggleSidebar('ai-sidekick')
      }
      if (meta && e.key === ',') {
        e.preventDefault()
        toggleSidebar('view-settings')
      }
      if (e.key === '+' && !meta && !isEditing) {
        e.preventDefault()
        setNewColumnMenuOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar, canvasOpen])

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
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      {/* Main app layout — scales down when canvas opens */}
      <div
        className="flex w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: canvasOpen ? 'scale(0.92)' : 'scale(1)',
          opacity: canvasOpen ? 0 : 1,
          pointerEvents: canvasOpen ? 'none' : 'auto',
        }}
      >
      {/* Left sidebar slot */}
      <div
        className="shrink-0 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: isLeftOpen ? 320 : 0 }}
      >
        <SidebarShell side="left" onClose={closeSidebar} showClose={false} width={320}>
          <SpaceMenu onClose={closeSidebar} activePage={activePage} onPageChange={switchPage} />
        </SidebarShell>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)}>
          <TopNavBar
            borderOpacity={scrollFade}
            scrollFade={scrollFade}
            databaseTitle={databaseTitle}
            isMenuOpen={isLeftOpen}
            onToggleMenu={() => toggleSidebar('space-menu')}
          />
        </div>
        {/* Scroll area — vertical + horizontal, table header sticks below toolbar */}
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-auto page-scroll flex flex-col">
          <div onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)}>
            <DatabaseTitle opacity={1 - scrollFade} title={databaseTitle} onTitleChange={setDatabaseTitle} />
            <ViewTabsToolbar tabs={currentTabs} activeSidebar={activeSidebar} onToggleSidebar={toggleSidebar} activeTab={activeTab} onTabChange={setActiveTab} onAddView={handleAddView} onRenameTab={handleRenameTab} onDuplicateTab={handleDuplicateTab} onDeleteTab={handleDeleteTab} onReorderTabs={handleReorderTabs} newColumnMenuOpen={newColumnMenuOpen} onNewColumnMenuOpenChange={setNewColumnMenuOpen} />
          </div>

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
        style={{ width: isRightOpen ? 320 : 0 }}
      >
        <SidebarShell side="right" onClose={closeSidebar} showClose={activeSidebar !== 'view-settings'}>
          {activeSidebar === 'view-settings' && <SidePanel onClose={closeSidebar} fields={pageFields} />}
          {activeSidebar === 'ai-sidekick' && <AiSidekickPanel />}
        </SidebarShell>
      </div>
      </div>

      {/* Canvas overlay */}
      <CanvasOverlay isOpen={canvasOpen} />

      {/* Canvas table widget */}
      <CanvasTableWidget
        isOpen={canvasOpen}
        databaseTitle={databaseTitle}
        onTitleChange={setDatabaseTitle}
        tabs={currentTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeSidebar={activeSidebar}
        onToggleSidebar={toggleSidebar}
        onAddView={handleAddView}
        onRenameTab={handleRenameTab}
        onDuplicateTab={handleDuplicateTab}
        onDeleteTab={handleDeleteTab}
        onReorderTabs={handleReorderTabs}
        newColumnMenuOpen={newColumnMenuOpen}
        onNewColumnMenuOpenChange={setNewColumnMenuOpen}
        activeViewType={activeTabConfig?.type}
        viewData={viewData}
        fields={pageFields}
        kanbanColumns={activePage === 'roadmap' ? ROADMAP_KANBAN_COLUMNS : undefined}
      />

      {/* Canvas floating nav panels */}
      <CanvasNavPanels isOpen={canvasOpen} databaseTitle={databaseTitle} />

      {/* Pill button — always on top, centered within toolbar area */}
      <CanvasPillButton canvasOpen={canvasOpen} onToggle={toggleCanvas} leftWidth={isLeftOpen ? 320 : 0} rightWidth={isRightOpen ? 320 : 0} visible={canvasOpen || navHovered} onHoverChange={setNavHovered} pageTitle={databaseTitle} />
    </div>
  )
}
