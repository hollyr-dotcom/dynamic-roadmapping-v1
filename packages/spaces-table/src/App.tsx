import { useRef, useState, useEffect } from 'react'
import { TopNavBar } from './components/page/TopNavBar'
import { DatabaseTitle } from './components/page/DatabaseTitle'
import { ViewTabsToolbar, type SidebarId } from './components/page/ViewTabsToolbar'
import { DataTable } from './components/table'
import { SidebarShell } from './components/sidebar/SidebarShell'
import { SpaceMenu } from './components/sidebar/SpaceMenu'
import { AiSidekickPanel } from './components/sidebar/AiSidekickPanel'
import { SidePanel } from './components/sidebar/SidePanel'

export function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollFade, setScrollFade] = useState(0)
  const [databaseTitle, setDatabaseTitle] = useState('Backlog')
  const [activeSidebar, setActiveSidebar] = useState<SidebarId | null>(null)

  const toggleSidebar = (id: SidebarId) =>
    setActiveSidebar((prev) => (prev === id ? null : id))

  const closeSidebar = () => setActiveSidebar(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const fadeStart = 10
      const fadeZone = 25
      setScrollFade(Math.max(0, Math.min(1, (el.scrollTop - fadeStart) / fadeZone)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const isLeftOpen = activeSidebar === 'space-menu'
  const isRightOpen = activeSidebar === 'ai-sidekick' || activeSidebar === 'view-settings'

  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden">
      {/* Left sidebar slot */}
      <div
        className="shrink-0 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: isLeftOpen ? 280 : 0 }}
      >
        <SidebarShell side="left" onClose={closeSidebar} showClose={false} width={280}>
          <SpaceMenu onClose={closeSidebar} />
        </SidebarShell>
      </div>

      {/* Main content */}
      <div ref={scrollRef} className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto page-scroll">
        <TopNavBar
          borderOpacity={scrollFade}
          scrollFade={scrollFade}
          databaseTitle={databaseTitle}
          isMenuOpen={isLeftOpen}
          onToggleMenu={() => toggleSidebar('space-menu')}
        />
        <DatabaseTitle opacity={1 - scrollFade} title={databaseTitle} onTitleChange={setDatabaseTitle} />
        <ViewTabsToolbar activeSidebar={activeSidebar} onToggleSidebar={toggleSidebar} />
        <DataTable />
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
