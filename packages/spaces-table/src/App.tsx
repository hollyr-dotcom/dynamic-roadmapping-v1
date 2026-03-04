import { useRef, useState, useEffect } from 'react'
import { TopNavBar } from './components/page/TopNavBar'
import { DatabaseTitle } from './components/page/DatabaseTitle'
import { ViewTabsToolbar } from './components/page/ViewTabsToolbar'
import { DataTable } from './components/table'

export function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollFade, setScrollFade] = useState(0)
  const [databaseTitle, setDatabaseTitle] = useState('Backlog')

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

  return (
    <div ref={scrollRef} className="flex flex-col w-screen h-screen bg-white overflow-y-auto page-scroll">
      <TopNavBar borderOpacity={scrollFade} scrollFade={scrollFade} databaseTitle={databaseTitle} />
      <DatabaseTitle opacity={1 - scrollFade} title={databaseTitle} onTitleChange={setDatabaseTitle} />
      <ViewTabsToolbar />
      <DataTable />
    </div>
  )
}
