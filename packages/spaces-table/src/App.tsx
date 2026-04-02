import { useState, useRef, useCallback, useEffect } from 'react'
import { Button, IconButton, IconCross } from '@mirohq/design-system'
import { ShareSpaceDialog } from './components/page/ShareSpaceDialog'
import { sampleData, fields, roadmapData, roadmapFields } from '@spaces/shared'
import type { Priority, SpaceRow, Status, FieldDefinition } from '@spaces/shared'
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
import { SidePanel } from './components/sidebar/SidePanel'
import { RowDetailPanel } from './components/sidebar/RowDetailPanel'
import { JiraPanel } from './components/sidebar/JiraPanel'
import { JiraDetailPanel } from './components/sidebar/JiraDetailPanel'
import { CanvasOverlay } from './components/canvas/CanvasOverlay'
import { CanvasTableWidget } from './components/canvas/CanvasTableWidget'
import { CanvasNavPanels } from './components/canvas/CanvasNavPanels'
import { CanvasFeedbackCard, type FeedbackCardData } from './components/canvas/CanvasFeedbackCard'
import { CanvasRecordCard } from './components/canvas/CanvasRecordCard'
import { MoveToRoadmapSnackbar } from './components/page/MoveToRoadmapSnackbar'
import { getRandomBoardIconIndex } from './components/BoardIcons'
import { CanvasDocumentWidget } from './components/canvas/CanvasDocumentWidget'
import { CanvasConnectionLine } from './components/canvas/CanvasConnectionLine'
import { generatePRD, type DocumentContent } from './components/canvas/generatePRD'
import { FlowProgressCard } from './components/canvas/FlowProgressCard'

type PageId = 'backlog' | 'roadmap'

interface CanvasWidget {
  id: string
  type?: 'table' | 'feedback-card' | 'record-card' | 'document'
  activeTab: string
  x: number
  y: number
  feedbackCard?: FeedbackCardData
  recordRow?: SpaceRow
  recordFields?: FieldDefinition[]
  recordPrompt?: string
  documentContent?: DocumentContent
  linkedWidgetId?: string
}

interface PageConfig {
  title: string
  tabs: TabConfig[]
  defaultTab: string
}

const PAGE_CONFIGS: Record<PageId, PageConfig> = {
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
  const [pendingImport, setPendingImport] = useState<'jira' | 'miro' | 'csv' | null>(null)
  const [backlogHasData, setBacklogHasData] = useState(true)
  const [roadmapHasData, setRoadmapHasData] = useState(true)
  const hasData = activePage === 'backlog' ? backlogHasData : roadmapHasData
  const setHasData = (val: boolean) => activePage === 'backlog' ? setBacklogHasData(val) : setRoadmapHasData(val)
  const [backlogData, setBacklogData] = useState<SpaceRow[]>(sampleData)
  const [roadmapItems, setRoadmapItems] = useState<SpaceRow[]>(roadmapData)
  const [activeTab, setActiveTab] = useState('all-items')
  const [pageTabs, setPageTabs] = useState<Record<PageId, TabConfig[]>>({
    backlog: PAGE_CONFIGS.backlog.tabs,
    roadmap: PAGE_CONFIGS.roadmap.tabs,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const [selectedRow, setSelectedRow] = useState<SpaceRow | null>(null)
  const [selectedRowDates, setSelectedRowDates] = useState<{ startDate: string; endDate: string } | undefined>(undefined)
  const [selectedJiraRow, setSelectedJiraRow] = useState<SpaceRow | null>(null)
  const [jiraPanelOpen, setJiraPanelOpen] = useState(false)
  const [isJiraDetailOpen, setIsJiraDetailOpen] = useState(false)
  const [initialCompany, setInitialCompany] = useState<string | undefined>(undefined)
  const [newColumnMenuOpen, setNewColumnMenuOpen] = useState(false)
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
  const [boardName, setBoardName] = useState<string | null>(null)
  const [boardIconIndex, setBoardIconIndex] = useState<number>(0)
  const [flowStreaming, setFlowStreaming] = useState(false)
  const [flowProgress, setFlowProgress] = useState(0)
  const [boards, setBoards] = useState<{ id: string; name: string; iconIndex: number }[]>([])
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
  const [panelLayout, setPanelLayout] = useState<'Center' | 'Right' | 'Fullscreen'>('Right')

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

  const toggleSidebar = useCallback((id: SidebarId) =>
    setActiveSidebar((prev) => (prev === id ? null : id)), [])

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

  const closeSidebar = () => { setActiveSidebar(null); setIsJiraDetailOpen(false); setPanelLayout('Right') }

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

  const handleAddRecordToBoard = useCallback((rowId: string, prompt: string) => {
    const row = backlogData.find(r => r.id === rowId) ?? roadmapItems.find(r => r.id === rowId)
    if (!row) return

    // Generate board name from prompt + record title
    const shortTitle = row.title.length > 30 ? row.title.slice(0, 30).trimEnd() + '…' : row.title
    const PROMPT_PREFIX: Record<string, string> = {
      'Write a PRD': 'PRD',
      'Explore insights': 'Insights',
      'Estimate with team': 'Estimation',
    }
    const prefix = PROMPT_PREFIX[prompt] || prompt
    const name = `${prefix}: ${shortTitle}`
    const boardId = `board-${Date.now()}`
    const iconIdx = getRandomBoardIconIndex()

    const widgetId = `record-${Date.now()}`
    const docWidgetId = `doc-${Date.now()}`
    // Position card left of centre, doc to its right
    const sidebarW = 320
    const visibleW = window.innerWidth - sidebarW
    const cardW = 340
    const cardH = 160
    const docGap = 120
    const docW = 600
    const totalW = cardW + docGap + docW
    // At zoom 0.7, world coords are scaled down — offset so content clears the sidebar
    const zoomLevel = 0.7
    const startX = (sidebarW / zoomLevel) + ((visibleW / zoomLevel) - totalW) / 2

    const cardWidget: CanvasWidget = {
      id: widgetId,
      type: 'record-card',
      activeTab: '',
      x: startX,
      y: (window.innerHeight - cardH) / 2,
      recordRow: row,
      recordFields: activePage === 'backlog' ? fields : roadmapFields,
      recordPrompt: prompt,
    }

    const prdContent = generatePRD(row, prompt)
    const docWidget: CanvasWidget = {
      id: docWidgetId,
      type: 'document',
      activeTab: '',
      x: startX + cardW + docGap,
      y: cardWidget.y - 20,
      documentContent: prdContent,
      linkedWidgetId: widgetId,
    }

    setBoardName(name)
    setBoardIconIndex(iconIdx)
    setBoards(prev => [...prev, { id: boardId, name, iconIndex: iconIdx }])

    if (!canvasOpen) {
      setWidgets([cardWidget, docWidget])
      setCanvasOpen(true)
      setPanX(0)
      setPanY(0)
      setZoom(0.7)
      setSelectedWidgetId(widgetId)
    } else {
      setWidgets(prev => [...prev, cardWidget, docWidget])
      setSelectedWidgetId(widgetId)
    }
    setActiveSidebar('space-menu')
  }, [backlogData, roadmapItems, canvasOpen, activePage])

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
  const currentTabs = pageTabs[activePage]
  const activeTabConfig = currentTabs.find(t => t.id === activeTab)
  const pageData = hasData ? (activePage === 'backlog' ? backlogData : roadmapItems) : []
  const pageFields = activePage === 'backlog' ? fields : roadmapFields
  const PRIORITY_ORDER: Record<Priority, number> = { now: 0, triage: 1, next: 2, later: 3, icebox: 4 }
  const baseViewData = activeTab === 'done' ? pageData.filter(r => r.status === 'done') : pageData
  const sortedViewData = [...baseViewData].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 5) - (PRIORITY_ORDER[b.priority] ?? 5))
  const viewData = companyFilter.length > 0 ? sortedViewData.filter(r => companyFilter.some(f => r.companies?.includes(f))) : sortedViewData

  if (view === 'home') {
    return <HomePage onOpenApp={(importSource?: 'jira' | 'miro' | 'csv', name?: string) => {
      if (name) setSpaceName(name)
      setIsInitialLoad(true)
      setView('app')
      setActivePage('backlog')
      setActiveTab('all-items')
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
      {/* Main app layout — scales down when canvas opens */}
      <div
        className="flex w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: canvasOpen ? 'scale(0.92)' : 'scale(1)',
          opacity: canvasOpen ? 0 : 1,
          pointerEvents: canvasOpen ? 'none' : 'auto',
        }}
      >
      {/* Main content — shifts right when left sidebar is open */}
      <div
        className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-[padding-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ paddingLeft: isLeftOpen ? (jiraPanelOpen ? 400 : 320) : 0 }}
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
        {/* Scroll area — vertical + horizontal, table header sticks below toolbar */}
        <div ref={scrollRef} onScroll={handleScroll} className={`flex-1 min-h-0 overflow-auto page-scroll flex flex-col${pageTransitioning ? ' page-transitioning-out' : ''}`}>
          <div className="sticky left-0" onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)} onClick={e => e.stopPropagation()}>
            <DatabaseTitle opacity={1} scrollFade={scrollFade} title={databaseTitle} onTitleChange={setDatabaseTitle} disableControls={emptyVariant === 'disabled' && !hasData} />
          </div>
          <div className={`sticky top-0 left-0 ${kanbanCardSelected ? 'z-0' : 'z-20'}`} onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)} onClick={e => e.stopPropagation()}>
            <ViewTabsToolbar tabs={currentTabs} activeSidebar={activeSidebar} onToggleSidebar={toggleSidebar} activeTab={activeTab} onTabChange={setActiveTab} onAddView={handleAddView} onRenameTab={handleRenameTab} onDuplicateTab={handleDuplicateTab} onDeleteTab={handleDeleteTab} onReorderTabs={handleReorderTabs} newColumnMenuOpen={newColumnMenuOpen} onNewColumnMenuOpenChange={setNewColumnMenuOpen} companyFilter={companyFilter} onClearCompanyFilter={(name) => setCompanyFilter(prev => prev.filter(n => n !== name))} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} showImportPopover={showImportPopover} onDismissImportPopover={() => setShowImportPopover(false)} hideControls={emptyVariant === 'hidden' && !hasData} disableControls={emptyVariant === 'disabled' && !hasData} />
          </div>

          {/* Type-based view renderer — show empty state for any view type when no data */}
          {!hasData ? (
            <DataTable key={`empty-${activePage}`} data={[]} fields={pageFields} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} onAddRecord={(title) => { closeSidebar(); setShowSharePopover(false); setHasData(true); if (activePage === 'roadmap') { setRoadmapItems([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'now', status: 'planning' }]) } else { setBacklogData([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'triage' }]) }; setTimeout(() => setShowImportPopover(true), 800) }} activePage={activePage} animateIn={!isInitialLoad} onEmptyInteract={closeSidebar} />
          ) : (<>
          {activeTabConfig?.type === 'table' && (
              <DataTable key={activeTab} data={viewData} fields={pageFields} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onCompanyClick={(row, name) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(name); setActiveSidebar('row-detail'); handleCompanyFilter(name) }} updatedRows={updatedRows} insightsAllDots={insightsAllDots} onTableInteract={() => setInsightsAllDots(false)} isImporting={isImporting} onImportComplete={handleImportComplete} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} onAddRecord={(title) => { setShowSharePopover(false); setHasData(true); setBacklogData([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'triage' }]); setTimeout(() => setShowImportPopover(true), 800) }} activePage={activePage} onAddToBoard={handleAddRecordToBoard} />
          )}
          {activeTabConfig?.type === 'kanban' && (
            <KanbanBoard key={activeTab} data={viewData} fields={pageFields} columns={activePage === 'roadmap' ? ROADMAP_KANBAN_COLUMNS : undefined} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onCardSelectedChange={setKanbanCardSelected} />
          )}
          {activeTabConfig?.type === 'timeline' && (
            <TimelinePlaceholder key={activeTab} data={roadmapItems} parentScrollRef={scrollRef} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onBarSelectedChange={setKanbanCardSelected} ghostRowId={ghostRowId ?? undefined} onBarPlaced={(rowId, startDate, endDate) => { setSelectedRowDates({ startDate, endDate }); setGhostRowId(null) }} />
          )}
          </>)}
        </div>
      </div>
      </div>


      {/* Left sidebar — fixed overlay, slides in over the top nav */}
      <div
        className="fixed top-0 left-0 h-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          zIndex: canvasOpen ? 110 : 50,
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
            <SpaceMenu onClose={closeSidebar} activePage={activePage} onPageChange={switchPage} onGoHome={() => { closeSidebar(); setView('home') }} spaceName={spaceName} boards={boards} activeBoardId={canvasOpen && boardName ? boards.find(b => b.name === boardName)?.id : undefined} />
          </SidebarShell>
        )}
      </div>

      {/* Right sidebar backdrop — suppressed during ghost bar placement so the timeline receives pointer events */}
      {isRightOpen && !ghostRowId && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Right sidebar — fixed overlay, slides in over the top nav */}
      <div
        className="fixed top-0 right-0 h-full z-50 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: activeSidebar === 'row-detail' ? 376 + 24 : activeSidebar === 'ai-sidekick' ? 420 + 36 : 320,
          transform: (isRightOpen && !(activeSidebar === 'row-detail' && (panelLayout === 'Center' || panelLayout === 'Fullscreen'))) ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {activeSidebar === 'row-detail' ? (
          <div className="h-full px-3 py-6 flex">
            <div
              className="flex-1 overflow-hidden rounded-xl"
              style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)' }}
            >
              {isJiraDetailOpen && selectedJiraRow
                ? <JiraDetailPanel row={selectedJiraRow} onClose={() => { setIsJiraDetailOpen(false); closeSidebar() }} />
                : selectedRow && <RowDetailPanel row={selectedRow} onClose={closeSidebar} initialCompany={initialCompany} onAddToBoard={handleAddToBoard} onRowUpdated={handleRowUpdated} timelineDates={selectedRowDates} onCompanyFilter={handleCompanyFilter} activeCompanyFilter={companyFilter.length > 0 ? companyFilter : null} selectedLayout={panelLayout} onLayoutChange={setPanelLayout} />
              }
            </div>
          </div>
        ) : activeSidebar === 'ai-sidekick' ? (
          <div className="h-full pl-3 pr-6 py-6 flex">
            <div
              className="flex-1 overflow-visible rounded-xl"
              style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)' }}
            >
              <InsightsChatPanel onClose={closeSidebar} />
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
      {widgets.filter(w => w.type === 'table' || (!w.type)).map(widget => {
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

      {/* Record cards on canvas */}
      {widgets.filter(w => w.type === 'record-card' && w.recordRow).map(widget => (
        <CanvasRecordCard
          key={widget.id}
          widget={widget}
          panX={panX}
          panY={panY}
          zoom={zoom}
          isOpen={canvasOpen}
          selected={selectedWidgetId === widget.id}
          onSelect={() => setSelectedWidgetId(widget.id)}
          onMove={(x, y) => handleWidgetMove(widget.id, x, y)}
          smoothPanning={smoothPanning}
        />
      ))}

      {/* Document widgets on canvas */}
      {widgets.filter(w => w.type === 'document' && w.documentContent).map(widget => (
        <CanvasDocumentWidget
          key={widget.id}
          widget={widget}
          panX={panX}
          panY={panY}
          zoom={zoom}
          isOpen={canvasOpen}
          selected={selectedWidgetId === widget.id}
          onSelect={() => setSelectedWidgetId(widget.id)}
          onMove={(x, y) => handleWidgetMove(widget.id, x, y)}
          smoothPanning={smoothPanning}
          onStreamingChange={(streaming, progress) => { setFlowStreaming(streaming); setFlowProgress(progress) }}
        />
      ))}

      {/* Connection lines between linked widgets */}
      {widgets.filter(w => w.type === 'document' && w.linkedWidgetId).map(docWidget => {
        const sourceWidget = widgets.find(w => w.id === docWidget.linkedWidgetId)
        if (!sourceWidget) return null
        return (
          <CanvasConnectionLine
            key={`line-${docWidget.id}`}
            fromX={sourceWidget.x}
            fromY={sourceWidget.y}
            fromWidth={340}
            fromHeight={160}
            toX={docWidget.x}
            toY={docWidget.y}
            toHeight={400}
            panX={panX}
            panY={panY}
            zoom={zoom}
            isOpen={canvasOpen}
            smoothPanning={smoothPanning}
          />
        )
      })}

      {/* Canvas floating nav panels */}
      <CanvasNavPanels isOpen={canvasOpen} databaseTitle={databaseTitle} onMenuClick={() => setActiveSidebar(activeSidebar === 'space-menu' ? null : 'space-menu')} isMenuOpen={canvasOpen && activeSidebar === 'space-menu'} boardName={boardName ?? undefined} boardIconIndex={boardIconIndex} />

      {/* Flow progress card */}
      <FlowProgressCard
        visible={canvasOpen && flowStreaming}
        progress={flowProgress}
        onStop={() => setFlowStreaming(false)}
        onClose={() => setFlowStreaming(false)}
      />

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
