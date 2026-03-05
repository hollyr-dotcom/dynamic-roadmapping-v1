import { useState, useRef, useCallback } from 'react'
import { sampleData, fields, roadmapData, roadmapFields } from '@spaces/shared'
import type { Priority } from '@spaces/shared'
import { TopNavBar } from './components/page/TopNavBar'
import { DatabaseTitle } from './components/page/DatabaseTitle'
import { ViewTabsToolbar, type SidebarId, type TabConfig } from './components/page/ViewTabsToolbar'
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
      { id: 'all-items', label: 'All items' },
      { id: 'prioritization', label: 'Prioritization' },
    ],
    defaultTab: 'all-items',
  },
  roadmap: {
    title: 'Roadmap',
    tabs: [
      { id: 'roadmap', label: 'Roadmap' },
      { id: 'kanban', label: 'Kanban' },
      { id: 'done', label: 'Done' },
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const fadeStart = 10
    const fadeZone = 25
    const scrollTop = e.currentTarget.scrollTop
    setScrollFade(Math.max(0, Math.min(1, (scrollTop - fadeStart) / fadeZone)))
  }

  const isLeftOpen = activeSidebar === 'space-menu'
  const isRightOpen = activeSidebar === 'ai-sidekick' || activeSidebar === 'view-settings'
  const pageConfig = PAGE_CONFIGS[activePage]

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
          <ViewTabsToolbar tabs={pageConfig.tabs} activeSidebar={activeSidebar} onToggleSidebar={toggleSidebar} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Backlog views */}
          {activePage === 'backlog' && activeTab === 'all-items' && (
            <DataTable data={sampleData} fields={fields} />
          )}
          {activePage === 'backlog' && activeTab === 'prioritization' && (
            <KanbanBoard data={sampleData} fields={fields} />
          )}

          {/* Roadmap views */}
          {activePage === 'roadmap' && activeTab === 'roadmap' && (
            <TimelinePlaceholder />
          )}
          {activePage === 'roadmap' && activeTab === 'kanban' && (
            <KanbanBoard data={roadmapData} fields={roadmapFields} columns={ROADMAP_KANBAN_COLUMNS} />
          )}
          {activePage === 'roadmap' && activeTab === 'done' && (
            <DataTable data={roadmapData.filter(r => r.status === 'done')} fields={roadmapFields} />
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
