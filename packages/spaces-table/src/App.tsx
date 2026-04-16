import { useState, useRef, useCallback, useEffect } from 'react'
import { Button, IconButton, IconCross, IconArrowUp, IconChevronDown, IconSquarePencil, IconClockCounterClockwise, IconDotsThreeVertical, IconArrowsInSimple, Tooltip } from '@mirohq/design-system'
import { ShareSpaceDialog } from './components/page/ShareSpaceDialog'
import { sampleData, fields, roadmapData, roadmapFields } from '@spaces/shared'
import type { Priority, SpaceRow, Status } from '@spaces/shared'
import { TopNavBar } from './components/page/TopNavBar'
import { DatabaseTitle } from './components/page/DatabaseTitle'
import { ViewTabsToolbar, type SidebarId, type TabConfig, type ViewType } from './components/page/ViewTabsToolbar'
import { DataTable } from './components/table'
import { KanbanBoard } from './components/kanban'
import { TimelinePlaceholder } from './components/timeline'
import { SidebarShell } from './components/sidebar/SidebarShell'
import { HomePage } from './components/page/HomePage'
import { InsightsModal } from './components/page/InsightsModal'
import { JiraImportModal } from './components/page/JiraImportModal'
import { InsightsToast } from './components/page/InsightsToast'
import { SpaceMenu } from './components/sidebar/SpaceMenu'
import { InsightsChatPanel } from './components/sidebar/InsightsChatPanel'
import AiPanelSolutionReview from './components/sidebar/AiPanelSolutionReview'
import { SidePanel } from './components/sidebar/SidePanel'
import { RowDetailPanel } from './components/sidebar/RowDetailPanel'
import { JiraPanel } from './components/sidebar/JiraPanel'
import { JiraDetailPanel } from './components/sidebar/JiraDetailPanel'
import { CanvasOverlay } from './components/canvas/CanvasOverlay'
import { CanvasTableWidget } from './components/canvas/CanvasTableWidget'
import { CanvasNavPanels } from './components/canvas/CanvasNavPanels'
import { CanvasFeedbackCard, type FeedbackCardData } from './components/canvas/CanvasFeedbackCard'
import { MoveToRoadmapSnackbar } from './components/page/MoveToRoadmapSnackbar'
import { OverviewPage, OVERVIEW_CARD_SUMMARIES, OVERVIEW_ROWS, CARDS as OVERVIEW_CARDS } from './components/page/OverviewPage'

type PageId = 'overview' | 'backlog' | 'roadmap'

interface CanvasWidget {
  id: string
  type?: 'table' | 'feedback-card'
  activeTab: string
  x: number
  y: number
  feedbackCard?: FeedbackCardData
}

interface PageConfig {
  title: string
  tabs: TabConfig[]
  defaultTab: string
}

const PAGE_CONFIGS: Record<PageId, PageConfig> = {
  overview: {
    title: 'Overview',
    tabs: [
      { id: 'overview', label: 'Overview', type: 'table' },
    ],
    defaultTab: 'overview',
  },
  backlog: {
    title: 'Backlog',
    tabs: [
      { id: 'all-items', label: 'All ideas', type: 'table' },
      { id: 'prioritization', label: 'Prioritization', type: 'kanban' },
    ],
    defaultTab: 'all-items',
  },
  roadmap: {
    title: 'Roadmap',
    tabs: [
      { id: 'roadmap', label: 'Roadmap', type: 'timeline' },
      { id: 'kanban', label: 'New, prioritized, up next', type: 'kanban' },
      { id: 'all-items-roadmap', label: 'All items', type: 'table' },
      { id: 'done', label: 'Done', type: 'table' },
    ],
    defaultTab: 'roadmap',
  },
}

const ROADMAP_KANBAN_COLUMNS: Priority[] = ['now', 'next', 'later']

export function App() {
  const [scrollFade, setScrollFade] = useState(0)
  const [view, setView] = useState<'home' | 'app'>('home')
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [emptyVariant] = useState<'hidden' | 'disabled'>('disabled')
  const [spaceName, setSpaceName] = useState('Project Galaxy')
  const [showInsightsModal, setShowInsightsModal] = useState(false)
  const [showInsightsToast, setShowInsightsToast] = useState(false)
  const [showImportPopover, setShowImportPopover] = useState(false)
  const [showSharePopover, setShowSharePopover] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [activePage, setActivePage] = useState<PageId>('backlog')
  const [databaseTitle, setDatabaseTitle] = useState('Backlog')
  const [activeSidebar, setActiveSidebar] = useState<SidebarId | null>(null)
  const [pendingImport, setPendingImport] = useState<'jira' | 'miro' | 'csv' | 'backlog' | null>(null)
  const [backlogHasData, setBacklogHasData] = useState(true)
  const [roadmapHasData, setRoadmapHasData] = useState(true)
  const [overviewHasData, setOverviewHasData] = useState(true)
  const hasData = activePage === 'overview' ? overviewHasData : activePage === 'backlog' ? backlogHasData : roadmapHasData
  const setHasData = (val: boolean) => activePage === 'overview' ? setOverviewHasData(val) : activePage === 'backlog' ? setBacklogHasData(val) : setRoadmapHasData(val)
  const [backlogData, setBacklogData] = useState<SpaceRow[]>(sampleData)
  const [roadmapItems, setRoadmapItems] = useState<SpaceRow[]>(roadmapData)
  const [activeTab, setActiveTab] = useState('all-items')
  const [pageTabs, setPageTabs] = useState<Record<PageId, TabConfig[]>>({
    overview: PAGE_CONFIGS.overview.tabs,
    backlog: PAGE_CONFIGS.backlog.tabs,
    roadmap: PAGE_CONFIGS.roadmap.tabs,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const [selectedRow, setSelectedRow] = useState<SpaceRow | null>(null)
  const [overviewCardId, setOverviewCardId] = useState<string | null>(null)
  const [selectedRowDates, setSelectedRowDates] = useState<{ startDate: string; endDate: string } | undefined>(undefined)
  const [selectedJiraRow, setSelectedJiraRow] = useState<SpaceRow | null>(null)
  const [jiraPanelOpen, setJiraPanelOpen] = useState(false)
  const [isJiraDetailOpen, setIsJiraDetailOpen] = useState(false)
  const [initialCompany, setInitialCompany] = useState<string | undefined>(undefined)
  const [newColumnMenuOpen, setNewColumnMenuOpen] = useState(false)
  const [sidekickFocusItemId, setSidekickFocusItemId] = useState<string | undefined>(undefined)
  const [sidekickSource, setSidekickSource] = useState<'toolbar' | 'panel'>('toolbar')
  const [sidekickContextMessage, setSidekickContextMessage] = useState<string | undefined>(undefined)
  const [floatingBarText, setFloatingBarText] = useState('')
  const [floatingBarThinking, setFloatingBarThinking] = useState(false)
  const [overviewFullChat, setOverviewFullChat] = useState(false)
  const [sidekickKey, setSidekickKey] = useState(0)
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [navHovered, setNavHovered] = useState(false)
  const [kanbanCardSelected, setKanbanCardSelected] = useState(false)

  // Canvas pan/zoom/selection state
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [widgets, setWidgets] = useState<CanvasWidget[]>([])
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)
  const [smoothPanning, setSmoothPanning] = useState(false)
  const [updatedRows, setUpdatedRows] = useState<Set<string>>(new Set())
  const [insightsAllDots, setInsightsAllDots] = useState(false)
  const [syncShimmering, setSyncShimmering] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [pendingToast, setPendingToast] = useState(false)
  const [showJiraAuth, setShowJiraAuth] = useState(false)
  const [movedRow, setMovedRow] = useState<SpaceRow | null>(null)
  const [showMoveSnackbar, setShowMoveSnackbar] = useState(false)
  const [pageTransitioning, setPageTransitioning] = useState(false)
  const [ghostRowId, setGhostRowId] = useState<string | null>(null)
  const [companyFilter, setCompanyFilter] = useState<string[]>([])
  const [panelLayout, setPanelLayout] = useState<'Halfscreen' | 'Right' | 'Fullscreen'>('Right')
  const [sidekickLayout, setSidekickLayout] = useState<'Halfscreen' | 'Right' | 'Fullscreen'>('Right')
  const [sidekickLayoutOpen, setSidekickLayoutOpen] = useState(false)
  const sidekickLayoutBtnRef = useRef<HTMLButtonElement>(null)
  const [sidekickLayoutPos, setSidekickLayoutPos] = useState({ top: 0, right: 0 })

  const handleCompanyFilter = useCallback((name: string) => {
    setCompanyFilter(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }, [])

  const handleImportComplete = useCallback(() => {
    setIsImporting(false)
    if (pendingToast) {
      setPendingToast(false)
      setShowInsightsToast(true)
      setTimeout(() => setShowImportPopover(true), 4000)
    }
  }, [pendingToast])

  const handleMoveToRoadmap = useCallback((rowId: string) => {
    setBacklogData(prev => {
      const row = prev.find(r => r.id === rowId)
      if (!row) return prev
      const movedWithStatus = { ...row, status: 'planning' as Status }
      setRoadmapItems(ri => [...ri, movedWithStatus])
      setMovedRow(movedWithStatus)
      setShowMoveSnackbar(true)
      return prev.filter(r => r.id !== rowId)
    })
    // Close any open sidebar so the row detail doesn't linger
    setActiveSidebar(null)
    setSelectedRow(null)
  }, [])

  // Sidekick apply actions — actually mutate roadmap/backlog state
  const handleApplyReprioritize = useCallback((itemId: string, newPriority: string, _reason: string) => {
    const isOnRoadmap = roadmapItems.find(r => r.id === itemId);
    const isInBacklog = backlogData.find(b => b.id === itemId);

    if (isOnRoadmap) {
      // Item already on roadmap — just change priority
      setRoadmapItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, priority: newPriority as any } : item
      ))
    } else if (isInBacklog) {
      // Item in backlog, not on roadmap — move it to roadmap
      setBacklogData(prev => prev.filter(item => item.id !== itemId))
      setRoadmapItems(prev => [...prev, { ...isInBacklog, priority: newPriority as any, status: 'planning' as any }])
    }

    // Visual highlight
    setUpdatedRows(prev => new Set([...prev, itemId]))
    setTimeout(() => setUpdatedRows(prev => { const next = new Set(prev); next.delete(itemId); return next }), 10000)
    // Switch to kanban view (now/next/later) so PM sees the priority change in context
    setTimeout(() => {
      if (activePage !== 'roadmap') setActivePage('roadmap')
      setActiveTab('kanban')
      setTimeout(() => {
        const row = document.querySelector(`[data-row-id="${itemId}"]`)
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }, 500)
  }, [activePage, roadmapItems, backlogData])

  const handleApplySwap = useCallback((cutId: string, addId: string, _reason: string) => {
    // Demote the cut item to 'later'
    setRoadmapItems(prev => prev.map(item =>
      item.id === cutId ? { ...item, priority: 'later' as any } : item
    ))
    setBacklogData(prev => prev.map(item =>
      item.id === cutId ? { ...item, priority: 'later' as any } : item
    ))
    // Promote the add item to 'now'
    const addInBacklog = backlogData.find(b => b.id === addId)
    if (addInBacklog) {
      // Move from backlog to roadmap
      setBacklogData(prev => prev.filter(r => r.id !== addId))
      setRoadmapItems(prev => [...prev, { ...addInBacklog, priority: 'now' as any, status: 'planning' as any }])
    } else {
      setRoadmapItems(prev => prev.map(item =>
        item.id === addId ? { ...item, priority: 'now' as any } : item
      ))
    }
    // Visual highlight both
    setUpdatedRows(prev => new Set([...prev, cutId, addId]))
    setTimeout(() => setUpdatedRows(prev => { const next = new Set(prev); next.delete(cutId); next.delete(addId); return next }), 10000)
    // Switch to kanban view (now/next/later) so PM sees both items in their new columns
    setTimeout(() => {
      if (activePage !== 'roadmap') setActivePage('roadmap')
      setActiveTab('kanban')
      setTimeout(() => {
        const row = document.querySelector(`[data-row-id="${addId}"]`)
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }, 500)
  }, [backlogData, activePage])

  const toggleSidebar = useCallback((id: SidebarId) => {
    setActiveSidebar((prev) => {
      if (prev === id) return null;
      if (id === 'ai-sidekick') setSidekickKey(k => k + 1);
      return id;
    });
  }, [])

  const toggleCanvas = useCallback(() => {
    setCanvasOpen(prev => {
      if (!prev) {
        setActiveSidebar(null)
        setWidgets([{ id: `widget-${Date.now()}`, activeTab, x: 0, y: 128 }])
      } else {
        setWidgets([])
      }
      setPanX(0)
      setPanY(0)
      setZoom(1)
      setSelectedWidgetId(null)
      return !prev
    })
  }, [activeTab])

  // Focal-point zoom helper
  const zoomTo = useCallback((newZoom: number, focalX: number, focalY: number) => {
    const clamped = Math.min(3, Math.max(0.1, newZoom))
    setZoom(prev => {
      const ratio = clamped / prev
      setPanX(p => focalX - ratio * (focalX - p))
      setPanY(p => focalY - ratio * (focalY - p))
      return clamped
    })
  }, [])

  // Reset initial load flag after first app render so page-switch animations work
  useEffect(() => {
    if (view === 'app' && isInitialLoad) setIsInitialLoad(false)
  }, [view, isInitialLoad])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const target = e.target as HTMLElement
      const isEditing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === 'Escape' && canvasOpen) {
        e.preventDefault()
        setCanvasOpen(false)
        setPanX(0)
        setPanY(0)
        setZoom(1)
        setSelectedWidgetId(null)
        setWidgets([])
        return
      }

      // Delete selected widget (only duplicates — keep at least one)
      if (canvasOpen && !isEditing && (e.key === 'Backspace' || e.key === 'Delete') && selectedWidgetId) {
        if (widgets.length > 1) {
          e.preventDefault()
          setWidgets(prev => prev.filter(w => w.id !== selectedWidgetId))
          setSelectedWidgetId(null)
        }
        return
      }

      // Canvas zoom: +/- toward viewport center
      if (canvasOpen && !isEditing) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault()
          const cx = window.innerWidth / 2
          const cy = window.innerHeight / 2
          zoomTo(zoom + 0.1, cx, cy)
          return
        }
        if (e.key === '-') {
          e.preventDefault()
          const cx = window.innerWidth / 2
          const cy = window.innerHeight / 2
          zoomTo(zoom - 0.1, cx, cy)
          return
        }
      }

      if (meta && e.key === 'k') {
        e.preventDefault()
        toggleSidebar('ai-sidekick')
      }
      // View settings sidebar disabled
      // if (meta && e.key === ',') {
      //   e.preventDefault()
      //   toggleSidebar('view-settings')
      // }
      if (e.key === '+' && !meta && !isEditing && !canvasOpen) {
        e.preventDefault()
        setNewColumnMenuOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar, canvasOpen, zoom, zoomTo, widgets, selectedWidgetId])

  const closeSidebar = () => { setActiveSidebar(null); setIsJiraDetailOpen(false); setPanelLayout('Right'); setSidekickFocusItemId(undefined) }

  // Wire up global close for Sidekick panel
  useEffect(() => {
    (window as any).__closeAiPanel = closeSidebar
    return () => { delete (window as any).__closeAiPanel }
  })

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

  const handleOpenMovedRow = useCallback(() => {
    setShowMoveSnackbar(false)
    setPageTransitioning(true)
    setTimeout(() => {
      setActivePage('roadmap')
      setActiveTab('roadmap')
      setDatabaseTitle('Roadmap')
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
        setScrollFade(0)
      }
      setPageTransitioning(false)
      // Open sidebar with the moved row after transition
      if (movedRow) {
        setSelectedRow(movedRow)
        setSelectedRowDates({ startDate: '—', endDate: '—' })
        setInitialCompany(undefined)
        setActiveSidebar('row-detail')
        setGhostRowId(movedRow.id)
      }
      setMovedRow(null)
    }, 150)
  }, [movedRow])

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

  // Canvas widget handlers
  const handleWidgetTabChange = useCallback((widgetId: string, tabId: string) => {
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, activeTab: tabId } : w))
  }, [])

  const handleDuplicateWidget = useCallback((sourceWidgetId: string, newTabId: string) => {
    // Measure source widget's actual width from the DOM
    const sourceCard = document.querySelector(`[data-widget-id="${sourceWidgetId}"] [data-widget-card]`) as HTMLElement | null
    const cardWidth = sourceCard?.offsetWidth ?? 800
    const gap = 60 // space between widgets

    let newX = 0
    let newY = 0

    setWidgets(prev => {
      const source = prev.find(w => w.id === sourceWidgetId)
      if (!source) return prev
      newX = source.x + cardWidth + gap
      newY = source.y
      const newWidget: CanvasWidget = {
        id: `widget-${Date.now()}`,
        activeTab: newTabId,
        x: newX,
        y: newY,
      }
      return [...prev, newWidget]
    })

    // Auto-pan: place new widget's top-left at top-left of visible canvas,
    // clearing the floating nav panels
    const padX = 80
    const padY = 100
    const targetPanX = padX - newX * zoom
    const targetPanY = padY - newY * zoom

    setSmoothPanning(true)
    requestAnimationFrame(() => {
      setPanX(targetPanX)
      setPanY(targetPanY)
    })
    setTimeout(() => setSmoothPanning(false), 700)

    // Trigger shimmer on sync indicators after pan settles
    setSyncShimmering(true)
    setTimeout(() => setSyncShimmering(false), 4800)
  }, [panX, zoom])

  const handleWidgetMove = useCallback((widgetId: string, x: number, y: number) => {
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, x, y } : w))
  }, [])

  const handleRowUpdated = useCallback((id: string) => {
    setUpdatedRows(prev => new Set([...prev, id]))
  }, [])

  const handleAddToBoard = useCallback((cardData: FeedbackCardData) => {
    const cardWidget: CanvasWidget = {
      id: `feedback-${Date.now()}`,
      type: 'feedback-card',
      activeTab: '',
      x: window.innerWidth - 380,
      y: 128,
      feedbackCard: cardData,
    }
    if (!canvasOpen) {
      setWidgets([{ id: `widget-${Date.now()}`, type: 'table', activeTab, x: 0, y: 128 }, cardWidget])
      setCanvasOpen(true)
      setPanX(0)
      setPanY(0)
      setZoom(1)
      setSelectedWidgetId(null)
    } else {
      setWidgets(prev => [...prev, cardWidget])
    }
    setActiveSidebar(null)
  }, [canvasOpen, activeTab])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const fadeStart = 10
    const fadeZone = 25
    const scrollTop = e.currentTarget.scrollTop
    setScrollFade(Math.max(0, Math.min(1, (scrollTop - fadeStart) / fadeZone)))
  }

  const isLeftOpen = activeSidebar === 'space-menu' || jiraPanelOpen
  const isRightOpen = activeSidebar === 'ai-sidekick' || activeSidebar === 'view-settings' || activeSidebar === 'row-detail'
  // Dynamic view rendering
  const currentTabs = pageTabs[activePage] ?? pageTabs.backlog
  const activeTabConfig = currentTabs.find(t => t.id === activeTab)
  const pageData = hasData ? (activePage === 'backlog' ? backlogData : roadmapItems) : []
  const pageFields = activePage === 'backlog' ? fields : roadmapFields
  const PRIORITY_ORDER: Record<Priority, number> = { now: 0, triage: 1, next: 2, later: 3, icebox: 4 }
  const baseViewData = activeTab === 'done' ? pageData.filter(r => r.status === 'done') : pageData
  const sortedViewData = [...baseViewData].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 5) - (PRIORITY_ORDER[b.priority] ?? 5))
  const viewData = companyFilter.length > 0 ? sortedViewData.filter(r => companyFilter.some(f => r.companies?.includes(f))) : sortedViewData

  if (view === 'home') {
    return <HomePage onOpenApp={(importSource?: 'jira' | 'miro' | 'csv', activePage?: string) => {
      setIsInitialLoad(true)
      setView('app')
      const page = (activePage && activePage in PAGE_CONFIGS ? activePage : 'backlog') as PageId
      setActivePage(page)
      setDatabaseTitle(PAGE_CONFIGS[page].title)
      setActiveTab(PAGE_CONFIGS[page].defaultTab)
      setActiveSidebar('space-menu')
      if (importSource) {
        setBacklogHasData(false)
        setRoadmapHasData(false)
        setPendingToast(true)
        setTimeout(() => setPendingImport(importSource), 300)
      } else {
        setBacklogHasData(false)
        setRoadmapHasData(false)
        setTimeout(() => setShowShareDialog(true), 400)
      }
    }} />
  }

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      {/* Full-screen Sidekick chat — overview only, covers everything */}
      {overviewFullChat && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#FFFFFF',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 12px 0 24px',
            height: 56,
            flexShrink: 0,
            borderBottom: '0.5px solid #E9EAEF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>Sidekick</span>
              <IconChevronDown size="small" color="icon-secondary" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconButton size="medium" variant="ghost-neutral" onPress={() => {}} aria-label="New chat">
                <IconSquarePencil />
              </IconButton>
              <IconButton size="medium" variant="ghost-neutral" onPress={() => {}} aria-label="History">
                <IconClockCounterClockwise />
              </IconButton>
              <IconButton size="medium" variant="ghost-neutral" onPress={() => {}} aria-label="More">
                <IconDotsThreeVertical />
              </IconButton>
              <IconButton size="medium" variant="ghost-neutral" onPress={() => { setOverviewFullChat(false); setActiveSidebar('ai-sidekick'); }} aria-label="Collapse">
                <IconArrowsInSimple />
              </IconButton>
            </div>
          </div>
          {/* Chat body — centered 680px column */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ width: 680, maxWidth: '100%', height: '100%' }}>
              <AiPanelSolutionReview
                key={sidekickKey}
                activePage={activePage}
                focusItemId={sidekickFocusItemId}
                contextUserMessage={sidekickContextMessage}
                onApplyReprioritize={handleApplyReprioritize}
                onApplySwap={handleApplySwap}
                liveRoadmapItems={roadmapItems}
                liveBacklogItems={backlogData}
                fullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Main app layout — scales down when canvas opens */}
      <div
        className="flex w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: canvasOpen ? 'scale(0.92)' : undefined,
          opacity: canvasOpen ? 0 : 1,
          pointerEvents: canvasOpen ? 'none' : 'auto',
        }}
      >
      {/* Main content — shifts right when left sidebar is open.
          isolate: creates stacking context so sticky z-indexes (z-[9999]) stay below fixed sidebar overlays (z-50) */}
      <div
        className="isolate flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-[padding-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ paddingLeft: isLeftOpen ? (jiraPanelOpen ? 400 : 320) : 0, transition: 'padding-left 0.45s cubic-bezier(0.16,1,0.3,1)' }}
        onClick={isLeftOpen && hasData ? () => { setActiveSidebar(null); setJiraPanelOpen(false) } : undefined}
      >
        <div onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)} onClick={e => e.stopPropagation()}>
          <TopNavBar
            borderOpacity={scrollFade}
            scrollFade={scrollFade}
            databaseTitle={databaseTitle}
            spaceName={spaceName}
            isMenuOpen={isLeftOpen}
            onToggleMenu={() => toggleSidebar('space-menu')}
            showSharePopover={showSharePopover}
            onDismissSharePopover={() => setShowSharePopover(false)}
          />
        </div>
        {/* Scroll area — database title scrolls away, tabs stick under header */}
        <div ref={scrollRef} onScroll={handleScroll} className={`flex-1 min-h-0 overflow-y-auto overflow-x-auto page-scroll flex flex-col relative${pageTransitioning ? ' page-transitioning-out' : ''}`}>
          <div className="sticky left-0 z-[45]" onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)}>
            <DatabaseTitle opacity={1} scrollFade={scrollFade} title={databaseTitle} onTitleChange={setDatabaseTitle} disableControls={emptyVariant === 'disabled' && !hasData} centered={activePage === 'overview'} />
          </div>
          {activePage !== 'overview' && (
            <div className={`sticky top-0 left-0 ${kanbanCardSelected ? 'z-0' : 'z-20'}`} onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)}>
              <ViewTabsToolbar tabs={currentTabs} activeSidebar={activeSidebar} onToggleSidebar={toggleSidebar} activeTab={activeTab} onTabChange={setActiveTab} onAddView={handleAddView} onRenameTab={handleRenameTab} onDuplicateTab={handleDuplicateTab} onDeleteTab={handleDeleteTab} onReorderTabs={handleReorderTabs} newColumnMenuOpen={newColumnMenuOpen} onNewColumnMenuOpenChange={setNewColumnMenuOpen} companyFilter={companyFilter} onClearCompanyFilter={(name) => setCompanyFilter(prev => prev.filter(n => n !== name))} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} showImportPopover={showImportPopover} onDismissImportPopover={() => setShowImportPopover(false)} hideControls={emptyVariant === 'hidden' && !hasData} disableControls={emptyVariant === 'disabled' && !hasData} onOpenAiSidekick={() => { setSidekickSource('toolbar'); toggleSidebar('ai-sidekick') }} />
            </div>
          )}

          {activePage === 'overview' && !overviewHasData && (
            <DataTable key="empty-overview" data={[]} fields={pageFields} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} onAddRecord={(title) => { closeSidebar(); setShowSharePopover(false); setOverviewHasData(true); setBacklogData([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'triage' }]); setTimeout(() => setShowImportPopover(true), 800) }} activePage="overview" animateIn={!isInitialLoad} onEmptyInteract={closeSidebar} />
          )}

          {activePage === 'overview' && overviewHasData && <OverviewPage onDiveDeeper={(cardId) => {
                  const row = OVERVIEW_ROWS[cardId] ?? backlogData[0]
                  const card = OVERVIEW_CARDS.find(c => c.id === cardId)
                  const msg = card
                    ? `I'm looking at a "${card.matchTag}" signal for "${row.title}" (${card.confidence} confidence). ${card.description} Walk me through the impact and top customers requesting this.`
                    : `Tell me about ${row.title}`
                  setSidekickFocusItemId(row.id)
                  setSidekickContextMessage(msg)
                  setSidekickKey(k => k + 1)
                  setSidekickSource('toolbar')
                  setActiveSidebar('ai-sidekick')
                }} onAddToRoadmap={(cardId) => { const row = OVERVIEW_ROWS[cardId]; if (row) { setMovedRow(row); setRoadmapItems(prev => [...prev, { ...row, id: `r-ov-${cardId}`, status: 'planning', priority: 'next' }]); setShowMoveSnackbar(true) } }} onReprioritize={() => { setActivePage('backlog'); setDatabaseTitle('Backlog'); setActiveTab('prioritization') }} />}

          {/* Type-based view renderer — show empty state for any view type when no data */}
          {activePage !== 'overview' && !hasData ? (
            <DataTable key={`empty-${activePage}`} data={[]} fields={pageFields} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} onAddRecord={(title) => { closeSidebar(); setShowSharePopover(false); setHasData(true); if (activePage === 'roadmap') { setRoadmapItems([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'now', status: 'planning' }]) } else { setBacklogData([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'triage' }]) }; setTimeout(() => setShowImportPopover(true), 800) }} activePage={activePage} animateIn={!isInitialLoad} onEmptyInteract={closeSidebar} />
          ) : (<>
          {activePage !== 'overview' && activeTabConfig?.type === 'table' && (
              <DataTable key={activeTab} data={viewData} fields={pageFields} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onCompanyClick={(row, name) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(name); setActiveSidebar('row-detail'); handleCompanyFilter(name) }} updatedRows={updatedRows} insightsAllDots={insightsAllDots} onTableInteract={() => setInsightsAllDots(false)} isImporting={isImporting} onImportComplete={handleImportComplete} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onOpenSidekick={(row) => { setSidekickFocusItemId(row.id); setSidekickKey(k => k + 1); setActiveSidebar('ai-sidekick') }} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} onAddRecord={(title) => { setShowSharePopover(false); setHasData(true); setBacklogData([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'triage' }]); setTimeout(() => setShowImportPopover(true), 800) }} activePage={activePage} />
          )}
          {activeTabConfig?.type === 'kanban' && (
            <KanbanBoard key={activeTab} data={viewData} fields={pageFields} columns={activePage === 'roadmap' ? ROADMAP_KANBAN_COLUMNS : undefined} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onCardSelectedChange={setKanbanCardSelected} />
          )}
          {activeTabConfig?.type === 'timeline' && (
            <TimelinePlaceholder key={activeTab} data={roadmapItems} parentScrollRef={scrollRef} onRowClick={(row) => { setSidekickFocusItemId(row.id); setSidekickKey(k => k + 1); setActiveSidebar('ai-sidekick') }} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onBarSelectedChange={setKanbanCardSelected} ghostRowId={ghostRowId ?? undefined} onBarPlaced={(rowId, startDate, endDate) => { setSelectedRowDates({ startDate, endDate }); setGhostRowId(null) }} />
          )}
          </>)}
        </div>

        {/* Floating prompt bar — thinking state + opens Sidekick */}
        {floatingBarThinking && (
          <div style={{
            position: 'sticky',
            bottom: 84,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 428,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            background: '#FFFFFF',
            border: '0.5px solid #E9EAEF',
            boxShadow: '0px 2px 4px rgba(34, 36, 40, 0.08)',
            borderRadius: 24,
            zIndex: 31,
            gap: 10,
            animation: 'fadeSlideIn 300ms ease-out both',
          }} onClick={e => e.stopPropagation()}>
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
              <circle cx="10" cy="10" r="8" stroke="#AEB2C0" strokeWidth="2" fill="none" strokeDasharray="40 60" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 400, color: '#656B81', fontFamily: "'Open Sans', sans-serif", flex: 1 }}>Thinking</span>
            <button
              onClick={() => { setFloatingBarThinking(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#656B81', padding: 0 }}
            >
              <IconCross size="small" />
            </button>
          </div>
        )}
        {activeSidebar !== 'ai-sidekick' && hasData && !overviewFullChat && (
          <div style={{
            position: 'sticky',
            bottom: 12,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 436,
            height: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 8,
            background: '#FFFFFF',
            boxShadow: '0px 6px 16px rgba(34, 36, 40, 0.12), 0px 0px 8px rgba(34, 36, 40, 0.06)',
            borderRadius: 24,
            zIndex: 30,
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F4F4F1',
              borderRadius: 16,
              height: 48,
              width: '100%',
              padding: '0 14px 0 18px',
            }}>
              <input
                type="text"
                value={floatingBarText}
                onChange={(e) => setFloatingBarText(e.target.value)}
                placeholder="What shall we do next?"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#222428',
                  lineHeight: 1.4,
                  fontFamily: "'Open Sans', sans-serif",
                  background: 'transparent',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && floatingBarText.trim()) {
                    const msg = floatingBarText.trim();
                    setFloatingBarText('');
                    setFloatingBarThinking(true);
                    setTimeout(() => {
                      setFloatingBarThinking(false);
                      setSidekickContextMessage(msg);
                      setSidekickKey(k => k + 1);
                      setSidekickSource('toolbar');
                      if (activePage === 'overview') {
                        setOverviewFullChat(true);
                      } else {
                        setActiveSidebar('ai-sidekick');
                      }
                    }, 2000);
                  }
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="4 1 16 22" fill="none" style={{ cursor: 'pointer', flexShrink: 0 }}>
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" stroke="#222428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" stroke="#222428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {floatingBarText.trim() ? (
                  <div
                    onClick={() => {
                      if (floatingBarText.trim()) {
                        const msg = floatingBarText.trim();
                        setFloatingBarText('');
                        setFloatingBarThinking(true);
                        setTimeout(() => {
                          setFloatingBarThinking(false);
                          setSidekickContextMessage(msg);
                          setSidekickKey(k => k + 1);
                          setSidekickSource('toolbar');
                          if (activePage === 'overview') {
                            setOverviewFullChat(true);
                          } else {
                            setActiveSidebar('ai-sidekick');
                          }
                        }, 2000);
                      }
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 12,
                      background: '#222428',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <IconArrowUp size="small" css={{ color: '#FFFFFF' }} />
                  </div>
                ) : (
                  <img src="/icon-voice-llm.png" width={26} height={26} alt="AI" style={{ cursor: 'pointer' }} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>


      {/* Left sidebar — fixed overlay, slides in over the top nav */}
      <div
        className="fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: jiraPanelOpen ? 376 + 24 : 320,
          transform: isLeftOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {jiraPanelOpen ? (
          <div className="h-full px-3 py-6 flex">
            <div className="flex-1 overflow-hidden rounded-xl" style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)' }}>
              {selectedJiraRow && <JiraPanel row={selectedJiraRow} onClose={() => setJiraPanelOpen(false)} />}
            </div>
          </div>
        ) : (
          <SidebarShell side="left" onClose={closeSidebar} showClose={false} width={320}>
            <SpaceMenu onClose={closeSidebar} activePage={activePage} onPageChange={switchPage} onGoHome={() => { closeSidebar(); setView('home') }} spaceName={spaceName} />
          </SidebarShell>
        )}
      </div>

      {/* AI Sidekick — rendered outside the sliding sidebar to avoid white flash on exit */}
      {(() => {
        const skWidth = sidekickLayout === 'Fullscreen' ? window.innerWidth * 0.75 : sidekickLayout === 'Halfscreen' ? window.innerWidth * 0.5 : 400;
        const isCenter = sidekickLayout === 'Fullscreen';
        const isHalfscreen = sidekickLayout === 'Halfscreen';
        return (
          <>
          <div
            className="fixed z-[10000]"
            style={isCenter ? {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              opacity: activeSidebar === 'ai-sidekick' ? 1 : 0,
              pointerEvents: activeSidebar === 'ai-sidekick' ? 'auto' : 'none',
              backgroundColor: 'rgba(0,0,0,0.3)',
              transition: 'opacity 300ms cubic-bezier(0.16,1,0.3,1)',
            } : isHalfscreen ? {
              top: 0,
              right: 0,
              bottom: 0,
              width: skWidth,
              transform: activeSidebar === 'ai-sidekick' ? 'translateX(0)' : 'translateX(100%)',
              pointerEvents: activeSidebar === 'ai-sidekick' ? 'auto' : 'none',
              transition: 'transform 450ms cubic-bezier(0.16,1,0.3,1), width 450ms cubic-bezier(0.16,1,0.3,1)',
            } : {
              top: 56,
              right: 8,
              bottom: 8,
              opacity: activeSidebar === 'ai-sidekick' ? 1 : 0,
              transform: activeSidebar === 'ai-sidekick' ? 'translateX(0)' : 'translateX(16px)',
              pointerEvents: activeSidebar === 'ai-sidekick' ? 'auto' : 'none',
              transition: 'opacity 300ms cubic-bezier(0.16,1,0.3,1), transform 300ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onClick={isCenter ? closeSidebar : undefined}
          >
            {isHalfscreen ? (
              <div className="h-full flex" style={{ paddingTop: 24, paddingBottom: 24, paddingLeft: 12, paddingRight: 12 }}>
                <div className="flex-1 rounded-xl overflow-hidden" style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)', background: '#fff' }}>
                  <AiPanelSolutionReview
                    key={sidekickKey}
                    onClose={closeSidebar}
                    activePage={activePage}
                    focusItemId={sidekickFocusItemId}
                    contextUserMessage={sidekickContextMessage}
                    onApplyReprioritize={handleApplyReprioritize}
                    onApplySwap={handleApplySwap}
                    liveRoadmapItems={roadmapItems}
                    liveBacklogItems={backlogData}
                    layoutButton={
                      <Tooltip>
                        <Tooltip.Trigger asChild>
                          <button
                            ref={sidekickLayoutBtnRef}
                            aria-label="Panel layout"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, border: 'none', cursor: 'pointer', color: '#656B81' }}
                            className="w-8 h-8 rounded-lg hover:bg-[#F1F2F5] transition-colors shrink-0"
                            onClick={() => {
                              const r = sidekickLayoutBtnRef.current?.getBoundingClientRect()
                              if (r) setSidekickLayoutPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
                              setSidekickLayoutOpen(o => !o)
                            }}
                          >
                            <svg width="16" height="14" viewBox="0 0 14 12" fill="none">
                              <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="currentColor" strokeWidth="1.2"/>
                              <rect x="3.5" y="2.5" width="7" height="7" rx="0.8" fill="currentColor"/>
                            </svg>
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Content side="top" sideOffset={4}>Panel view</Tooltip.Content>
                      </Tooltip>
                    }
                  />
                </div>
              </div>
            ) : (
            <div
              className="rounded-xl overflow-hidden h-full"
              style={{ width: skWidth, boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)', background: '#fff' }}
              onClick={isCenter ? (e: React.MouseEvent) => e.stopPropagation() : undefined}
            >
              <AiPanelSolutionReview
                key={sidekickKey}
                onClose={closeSidebar}
                activePage={activePage}
                focusItemId={sidekickFocusItemId}
                contextUserMessage={sidekickContextMessage}
                onApplyReprioritize={handleApplyReprioritize}
                onApplySwap={handleApplySwap}
                layoutButton={
                  <Tooltip>
                    <Tooltip.Trigger asChild>
                      <button
                        ref={sidekickLayoutBtnRef}
                        aria-label="Panel layout"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, border: 'none', cursor: 'pointer', color: '#656B81' }}
                        className="w-8 h-8 rounded-lg hover:bg-[#F1F2F5] transition-colors shrink-0"
                        onClick={() => {
                          const r = sidekickLayoutBtnRef.current?.getBoundingClientRect()
                          if (r) setSidekickLayoutPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
                          setSidekickLayoutOpen(o => !o)
                        }}
                      >
                        {sidekickLayout === 'Right' && (
                          <svg width="16" height="14" viewBox="0 0 14 12" fill="none">
                            <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="currentColor" strokeWidth="1.2"/>
                            <rect x="7.5" y="2.5" width="4" height="7" rx="0.8" fill="currentColor"/>
                          </svg>
                        )}
                        {sidekickLayout === 'Fullscreen' && (
                          <svg width="16" height="14" viewBox="0 0 14 12" fill="none">
                            <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="currentColor" strokeWidth="1.2"/>
                            <rect x="1.5" y="1.5" width="11" height="9" rx="0.8" fill="currentColor"/>
                          </svg>
                        )}
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" sideOffset={4}>Panel view</Tooltip.Content>
                  </Tooltip>
                }
              />
            </div>
            )}
          </div>

          {sidekickLayoutOpen && activeSidebar === 'ai-sidekick' && (
            <>
              <div className="fixed inset-0 z-[10001]" onClick={() => setSidekickLayoutOpen(false)} />
              <div
                className="fixed z-[10002] bg-white flex flex-col rounded-[8px]"
                style={{ top: sidekickLayoutPos.top, right: sidekickLayoutPos.right, padding: '16px 12px', gap: 4, boxShadow: '0px 0px 12px rgba(34,36,40,0.04), 0px 2px 8px rgba(34,36,40,0.12)' }}
              >
                {(['Right', 'Halfscreen', 'Fullscreen'] as const).map(layout => (
                  <button
                    key={layout}
                    className={`flex items-center w-full rounded-[4px] transition-colors text-left ${sidekickLayout === layout ? 'bg-[#F1F2F5]' : 'hover:bg-[#F1F2F5]'}`}
                    style={{ border: 'none', padding: '0 8px 0 0', gap: 0, cursor: 'pointer' }}
                    onClick={() => { setSidekickLayout(layout); setSidekickLayoutOpen(false) }}
                  >
                    <span className="flex items-center justify-end shrink-0" style={{ padding: '12px 0 12px 8px' }}>
                      {layout === 'Right' && (
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                          <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="#222428" strokeWidth="1.2"/>
                          <rect x="7.5" y="2.5" width="4" height="7" rx="0.8" fill="#222428"/>
                        </svg>
                      )}
                      {layout === 'Halfscreen' && (
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                          <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="#222428" strokeWidth="1.2"/>
                          <rect x="3.5" y="2.5" width="7" height="7" rx="0.8" fill="#222428"/>
                        </svg>
                      )}
                      {layout === 'Fullscreen' && (
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                          <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="#222428" strokeWidth="1.2"/>
                          <rect x="1.5" y="1.5" width="11" height="9" rx="0.8" fill="#222428"/>
                        </svg>
                      )}
                    </span>
                    <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, color: '#222428', paddingLeft: 8, paddingTop: 10, paddingBottom: 10, fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                      {layout}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          </>
        )
      })()}
      {/* Right sidebar backdrop — suppressed on overview page and during ghost bar placement */}
      {isRightOpen && !ghostRowId && activePage !== 'overview' && activeSidebar !== 'ai-sidekick' && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Right sidebar — fixed overlay, slides in over the top nav */}
      <div
        className="fixed top-0 right-0 h-full z-50"
        style={{
          width: activeSidebar === 'row-detail' ? (panelLayout === 'Fullscreen' ? window.innerWidth * 0.75 : panelLayout === 'Halfscreen' ? window.innerWidth * 0.5 + 24 : 460 + 24) : activeSidebar === 'ai-sidekick' ? 0 : 320,
          transform: (isRightOpen && activeSidebar !== 'ai-sidekick' && !(activeSidebar === 'row-detail' && panelLayout === 'Fullscreen')) ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 450ms cubic-bezier(0.16,1,0.3,1), width 450ms cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: isRightOpen && activeSidebar !== 'ai-sidekick' ? 'auto' : 'none',
        }}
      >
        {activeSidebar === 'row-detail' ? (
          <div className="h-full py-6 flex" style={{ paddingLeft: 12, paddingRight: 12 }}>
            <div
              className="flex-1 overflow-hidden rounded-xl"
              style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)' }}
            >
              {isJiraDetailOpen && selectedJiraRow
                ? <JiraDetailPanel row={selectedJiraRow} onClose={() => { setIsJiraDetailOpen(false); closeSidebar() }} />
                : selectedRow && <RowDetailPanel row={selectedRow} onClose={closeSidebar} initialCompany={initialCompany} onAddToBoard={handleAddToBoard} onRowUpdated={handleRowUpdated} timelineDates={selectedRowDates} onCompanyFilter={handleCompanyFilter} activeCompanyFilter={companyFilter.length > 0 ? companyFilter : null} selectedLayout={panelLayout} onLayoutChange={setPanelLayout} hideInsightCallout={activePage === 'overview'} hideComments={activePage === 'overview'} overrideSummary={activePage === 'overview' && overviewCardId ? OVERVIEW_CARD_SUMMARIES[overviewCardId] : undefined} onOpenSidekick={() => { setSidekickSource('panel'); setActiveSidebar('ai-sidekick'); setSidekickFocusItemId(selectedRow.id) }} />
              }
            </div>
          </div>
        ) : activeSidebar === 'ai-sidekick' ? (
          <div style={{ position: 'absolute', top: 56, right: 8, bottom: 8, display: 'flex' }}>
            <div
              className="rounded-xl"
              style={{ width: 400, boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)', background: '#fff' }}
            >
              <AiPanelSolutionReview key={sidekickKey} onClose={closeSidebar} activePage={activePage} focusItemId={sidekickFocusItemId} onApplyReprioritize={handleApplyReprioritize} onApplySwap={handleApplySwap} liveRoadmapItems={roadmapItems} liveBacklogItems={backlogData} />
            </div>
          </div>
        ) : (
          <SidebarShell side="right" onClose={closeSidebar} showClose={activeSidebar !== 'view-settings'} width={320}>
            {activeSidebar === 'view-settings' && <SidePanel onClose={closeSidebar} fields={pageFields} />}
          </SidebarShell>
        )}
      </div>

      {/* Canvas overlay */}
      <CanvasOverlay
        isOpen={canvasOpen}
        panX={panX}
        panY={panY}
        zoom={zoom}
        smoothPanning={smoothPanning}
        onPan={(dx: number, dy: number) => { setPanX(p => p + dx); setPanY(p => p + dy) }}
        onZoom={zoomTo}
        onDeselect={() => setSelectedWidgetId(null)}
      />

      {/* Canvas table widgets */}
      {widgets.filter(w => w.type !== 'feedback-card').map(widget => {
        const widgetTabConfig = currentTabs.find(t => t.id === widget.activeTab)
        const widgetViewData = widget.activeTab === 'done' ? pageData.filter(r => r.status === 'done') : pageData
        return (
          <CanvasTableWidget
            key={widget.id}
            widgetId={widget.id}
            isOpen={canvasOpen}
            panX={panX}
            panY={panY}
            zoom={zoom}
            initialX={widget.x}
            initialY={widget.y}
            selected={selectedWidgetId === widget.id}
            onSelect={() => setSelectedWidgetId(widget.id)}
            onMove={(x: number, y: number) => handleWidgetMove(widget.id, x, y)}
            onExitCanvas={toggleCanvas}
            onPan={(dx: number, dy: number) => { setPanX(p => p + dx); setPanY(p => p + dy) }}
            onZoom={zoomTo}
            databaseTitle={databaseTitle}
            onTitleChange={setDatabaseTitle}
            tabs={currentTabs}
            activeTab={widget.activeTab}
            onTabChange={(tabId) => handleWidgetTabChange(widget.id, tabId)}
            activeSidebar={activeSidebar}
            onToggleSidebar={toggleSidebar}
            onAddView={handleAddView}
            onRenameTab={handleRenameTab}
            onDuplicateTab={handleDuplicateTab}
            onDeleteTab={handleDeleteTab}
            onReorderTabs={handleReorderTabs}
            newColumnMenuOpen={newColumnMenuOpen}
            onNewColumnMenuOpenChange={setNewColumnMenuOpen}
            onDuplicateWidget={(newTabId: string) => handleDuplicateWidget(widget.id, newTabId)}
            syncCount={widgets.length}
            syncing={syncShimmering}
            smoothPanning={smoothPanning}
            activeViewType={widgetTabConfig?.type}
            viewData={widgetViewData}
            fields={pageFields}
            kanbanColumns={activePage === 'roadmap' ? ROADMAP_KANBAN_COLUMNS : undefined}
          />
        )
      })}

      {/* Canvas feedback card widgets */}
      {widgets.filter(w => w.type === 'feedback-card' && w.feedbackCard).map(widget => (
        <CanvasFeedbackCard
          key={widget.id}
          data={widget.feedbackCard!}
          panX={panX}
          panY={panY}
          zoom={zoom}
          x={widget.x}
          y={widget.y}
          isOpen={canvasOpen}
          selected={selectedWidgetId === widget.id}
          onSelect={() => setSelectedWidgetId(widget.id)}
          onMove={(x, y) => handleWidgetMove(widget.id, x, y)}
          smoothPanning={smoothPanning}
        />
      ))}

      {/* Canvas floating nav panels */}
      <CanvasNavPanels isOpen={canvasOpen} databaseTitle={databaseTitle} />

      {/* Share space dialog */}
      {showShareDialog && (
        <ShareSpaceDialog
          spaceName={spaceName}
          onContinue={() => setShowShareDialog(false)}
        />
      )}

      {/* Jira auth dialog */}
      {showJiraAuth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(99,107,130,0.55)' }}
          onClick={() => { setShowJiraAuth(false); setPendingImport(null) }}
        >
          <div
            className="bg-white flex flex-col relative"
            style={{
              borderRadius: 16,
              width: 480,
              padding: 40,
              gap: 20,
              boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <IconButton variant="ghost" size="large" aria-label="Close" onPress={() => { setShowJiraAuth(false); setPendingImport(null) }}>
                <IconCross />
              </IconButton>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-[1.5px] border-[#4262FF] flex items-center justify-center shrink-0">
                <span className="text-[#4262FF] text-[13px] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>!</span>
              </div>
              <h2 className="text-[22px] text-[#1a1b1e] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Authorization required</h2>
            </div>

            <p className="text-[15px] text-[#44474f]" style={{ fontFamily: 'Open Sans, sans-serif', lineHeight: 1.5 }}>
              Sign in to Jira using your personal credentials to continue working with Jira Cards in Miro.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" size="large" onPress={() => { setShowJiraAuth(false) }}>
                <Button.Label>Authorize</Button.Label>
              </Button>
              <Button variant="ghost" size="large" onPress={() => { setShowJiraAuth(false); setPendingImport(null) }}>
                <Button.Label>Cancel</Button.Label>
              </Button>
              <div className="flex-1" />
              <Button variant="ghost" size="large" onPress={() => { setShowJiraAuth(false) }}>
                <Button.Label>Skip for now</Button.Label>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Jira import modal */}
      {pendingImport === 'jira' && !showJiraAuth && (
        <JiraImportModal
          onImport={() => { setPendingImport(null); setIsImporting(true); if (activePage === 'roadmap') { setRoadmapHasData(true); setRoadmapItems(roadmapData) } else { setBacklogHasData(true); setBacklogData(sampleData) } }}
          onClose={() => { setPendingImport(null) }}
        />
      )}

      {/* Insights modal */}
      {showInsightsModal && (
        <InsightsModal
          onEnable={() => { setShowInsightsModal(false); setShowInsightsToast(true); setInsightsAllDots(true) }}
          onSkip={() => setShowInsightsModal(false)}
        />
      )}

      {showInsightsToast && (
        <InsightsToast onDismiss={() => setShowInsightsToast(false)} />
      )}

      {showMoveSnackbar && (
        <MoveToRoadmapSnackbar
          onAction={handleOpenMovedRow}
          onDismiss={() => { setShowMoveSnackbar(false); setMovedRow(null) }}
        />
      )}


    </div>
  )
}
