import { useState, useRef, useCallback, useEffect } from 'react'
import { Button, IconButton, IconCross, Tooltip } from '@mirohq/design-system'
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
import AiPanelSolutionReview from './components/sidebar/AiPanelSolutionReview'
import { SidePanel } from './components/sidebar/SidePanel'
import { RowDetailPanel } from './components/sidebar/RowDetailPanel'
import { JiraPanel } from './components/sidebar/JiraPanel'
import { JiraDetailPanel } from './components/sidebar/JiraDetailPanel'
import { CanvasOverlay } from './components/canvas/CanvasOverlay'
import { CanvasTableWidget } from './components/canvas/CanvasTableWidget'
import { CanvasNavPanels } from './components/canvas/CanvasNavPanels'
import { CanvasCreationToolbar } from './components/canvas/CanvasCreationToolbar'
import { CanvasGhostChrome } from './components/canvas/CanvasGhostChrome'
import { CanvasFeedbackCard, type FeedbackCardData } from './components/canvas/CanvasFeedbackCard'
import { CanvasRecordCard } from './components/canvas/CanvasRecordCard'
import { MoveToRoadmapSnackbar } from './components/page/MoveToRoadmapSnackbar'
import { getRandomBoardIconIndex } from './components/BoardIcons'
import { CanvasDocumentWidget } from './components/canvas/CanvasDocumentWidget'
import { CanvasConnectionLine } from './components/canvas/CanvasConnectionLine'
import { generatePRD, type DocumentContent } from './components/canvas/generatePRD'
import { FlowProgressCard } from './components/canvas/FlowProgressCard'
import BoardSidekickPanel from './components/sidebar/BoardSidekickPanel'
import { OverviewPage, OVERVIEW_CARD_SUMMARIES, OVERVIEW_ROWS, CARDS as OVERVIEW_CARDS } from './components/page/OverviewPage'

type PageId = 'overview' | 'backlog' | 'roadmap'

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

interface SidekickBoard {
  id: string
  name: string
  feedbackCard: FeedbackCardData
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
  // DEV: skip homepage, start with data + side panel open for faster testing
  const [view, setView] = useState<'home' | 'app'>('app')
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
  // DEV: start with row-detail open
  const [activeSidebar, setActiveSidebar] = useState<SidebarId | null>('row-detail')
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

  // DEV: start with first row selected
  const [selectedRow, setSelectedRow] = useState<SpaceRow | null>(sampleData[0])
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
  const [sidekickKey, setSidekickKey] = useState(0)
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [canvasTransitionPhase, setCanvasTransitionPhase] = useState<'idle' | 'loading' | 'complete'>('idle')
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
  const [boardSidekickOpen, setBoardSidekickOpen] = useState(false)
  const [sidekickTransitioning, setSidekickTransitioning] = useState(false)
  const [boardIconIndex, setBoardIconIndex] = useState<number>(0)
  const [flowStreaming, setFlowStreaming] = useState(false)
  const [flowCardMounted, setFlowCardMounted] = useState(false)
  const [flowProgress, setFlowProgress] = useState(0)
  const [docAccepted, setDocAccepted] = useState(false)
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
  const [panelLayout, setPanelLayout] = useState<'Halfscreen' | 'Right' | 'Fullscreen'>('Right')
  const [sidekickBoards, setSidekickBoards] = useState<SidekickBoard[]>([])
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

  // Keep flow card mounted for exit animation
  useEffect(() => {
    if (flowStreaming) {
      setFlowCardMounted(true)
    } else {
      const timer = setTimeout(() => setFlowCardMounted(false), 400)
      return () => clearTimeout(timer)
    }
  }, [flowStreaming])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const target = e.target as HTMLElement
      const isEditing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === 'Escape' && canvasTransitionPhase !== 'idle' && !canvasOpen) {
        e.preventDefault()
        setSidekickTransitioning(false)
        setCanvasTransitionPhase('idle')
        return
      }

      if (e.key === 'Escape' && canvasOpen) {
        e.preventDefault()
        setCanvasOpen(false)
        setCanvasTransitionPhase('idle')
        setSidekickTransitioning(false)
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

  const handleAddRecordToBoard = useCallback((rowId: string) => {
    const row = backlogData.find(r => r.id === rowId) ?? roadmapItems.find(r => r.id === rowId)
    if (!row) return

    const name = row.title.length > 40 ? row.title.slice(0, 40).trimEnd() + '…' : row.title
    const boardId = `board-${Date.now()}`
    const iconIdx = getRandomBoardIconIndex()

    const widgetId = `record-${Date.now()}`
    const sidekickW = 400 + 8 // panel width + right margin
    const visibleW = window.innerWidth - sidekickW
    const cardW = 340
    const cardH = 160
    const zoomLevel = 0.7
    const startX = ((visibleW / zoomLevel) - cardW) / 2

    const cardWidget: CanvasWidget = {
      id: widgetId,
      type: 'record-card',
      activeTab: '',
      x: startX,
      y: (window.innerHeight - cardH) / 2,
      recordRow: row,
      recordFields: activePage === 'backlog' ? fields : roadmapFields,
    }

    setBoardName(name)
    setBoardIconIndex(iconIdx)
    setBoards(prev => [...prev, { id: boardId, name, iconIndex: iconIdx }])

    if (!canvasOpen) {
      setWidgets([cardWidget])
      setCanvasOpen(true)
      setPanX(0)
      setPanY(0)
      setZoom(0.7)
      setSelectedWidgetId(widgetId)
    } else {
      setWidgets(prev => [...prev, cardWidget])
      setSelectedWidgetId(widgetId)
    }
    setTimeout(() => setBoardSidekickOpen(true), 400)
  }, [backlogData, roadmapItems, canvasOpen, activePage])

  const handleWritePRD = useCallback(() => {
    const recordWidget = widgets.find(w => w.type === 'record-card')
    if (!recordWidget?.recordRow) return

    const prdContent = generatePRD(recordWidget.recordRow, 'Write a PRD')
    const docWidgetId = `doc-${Date.now()}`
    const docGap = 60
    const cardW = 340
    const newY = (56 + 24 + 64) / zoom // 24px below sidekick top + 64px extra

    // Move card to new Y position and create document alongside it
    setWidgets(prev => prev.map(w =>
      w.id === recordWidget.id ? { ...w, y: newY } : w
    ))

    const docWidget: CanvasWidget = {
      id: docWidgetId,
      type: 'document',
      activeTab: '',
      x: recordWidget.x + cardW + docGap,
      y: newY, // top-aligned with card
      documentContent: prdContent,
      linkedWidgetId: recordWidget.id,
    }

    setWidgets(prev => [...prev, docWidget])
    setSelectedWidgetId(null)

    // Auto-pan to center the card+document pair in the available space
    const sidekickW = 400 + 8
    const availableW = window.innerWidth - sidekickW
    const totalW = cardW + docGap + 600 // card + gap + doc
    const centerX = recordWidget.x + totalW / 2
    const targetPanX = (availableW / 2) - centerX * zoom
    const targetPanY = -(newY * zoom) + 56 + 24 + 64 // match card position

    setSmoothPanning(true)
    requestAnimationFrame(() => {
      setPanX(targetPanX)
      setPanY(targetPanY)
    })
    setTimeout(() => setSmoothPanning(false), 700)
  }, [widgets, zoom])

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
    // Track in sidekick boards list
    setSidekickBoards(prev => {
      const name = `Board ${prev.length + 1}`
      return [...prev, { id: cardWidget.id, name, feedbackCard: cardData }]
    })
    setActiveSidebar(null)
  }, [canvasOpen, activeTab])

  const handleSidekickBoardClick = useCallback((board: SidekickBoard) => {
    const cardWidget: CanvasWidget = {
      id: board.id,
      type: 'feedback-card',
      activeTab: '',
      x: window.innerWidth - 380,
      y: 128,
      feedbackCard: board.feedbackCard,
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
      {/* Main app layout — scales down when canvas opens or loading transition starts */}
      <div
        className="flex w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: (canvasOpen || canvasTransitionPhase === 'loading') ? 'scale(0.92)' : undefined,
          opacity: (canvasOpen || canvasTransitionPhase === 'loading') ? 0 : 1,
          pointerEvents: (canvasOpen || canvasTransitionPhase === 'loading') ? 'none' : 'auto',
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
        <div ref={scrollRef} onScroll={handleScroll} className={`flex-1 min-h-0 overflow-y-auto overflow-x-auto page-scroll flex flex-col${pageTransitioning ? ' page-transitioning-out' : ''}`}>
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
              <DataTable key={activeTab} data={viewData} fields={pageFields} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onCompanyClick={(row, name) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(name); setActiveSidebar('row-detail'); handleCompanyFilter(name) }} updatedRows={updatedRows} insightsAllDots={insightsAllDots} onTableInteract={() => setInsightsAllDots(false)} isImporting={isImporting} onImportComplete={handleImportComplete} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onImportSource={(source) => { setShowSharePopover(false); setShowImportPopover(false); setPendingImport(source); setPendingToast(true); if (source === 'jira') setShowJiraAuth(true) }} onAddRecord={(title) => { setShowSharePopover(false); setHasData(true); setBacklogData([{ id: 'new-1', title: title || '', mentions: 0, customers: 0, estRevenue: 0, companies: [], priority: 'triage' }]); setTimeout(() => setShowImportPopover(true), 800) }} activePage={activePage} onAddToBoard={handleAddRecordToBoard} />
          )}
          {activeTabConfig?.type === 'kanban' && (
            <KanbanBoard key={activeTab} data={viewData} fields={pageFields} columns={activePage === 'roadmap' ? ROADMAP_KANBAN_COLUMNS : undefined} onRowClick={(row) => { setSelectedRow(row); setSelectedRowDates(undefined); setInitialCompany(undefined); setActiveSidebar('row-detail') }} onAddToBoard={handleAddRecordToBoard} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onCardSelectedChange={setKanbanCardSelected} />
          )}
          {activeTabConfig?.type === 'timeline' && (
            <TimelinePlaceholder key={activeTab} data={roadmapItems} parentScrollRef={scrollRef} onRowClick={(row) => { setSidekickFocusItemId(row.id); setActiveSidebar('ai-sidekick') }} onAddToBoard={handleAddRecordToBoard} onMoveToRoadmap={handleMoveToRoadmap} showMoveToRoadmap={activePage === 'backlog'} onBarSelectedChange={setKanbanCardSelected} ghostRowId={ghostRowId ?? undefined} onBarPlaced={(rowId, startDate, endDate) => { setSelectedRowDates({ startDate, endDate }); setGhostRowId(null) }} />
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
            <SpaceMenu
              onClose={closeSidebar}
              activePage={activePage}
              onPageChange={switchPage}
              onGoHome={() => { closeSidebar(); setView('home') }}
              spaceName={spaceName}
              sidekickBoards={boards.map(b => ({ id: b.id, name: b.name, iconIndex: b.iconIndex }))}
              onSidekickBoardClick={(board) => {
                const matchingBoard = boards.find(b => b.id === board.id)
                if (matchingBoard) {
                  setBoardName(matchingBoard.name)
                  setCanvasOpen(true)
                  setActiveSidebar(null)
                }
              }}
              activeSidekickBoardId={canvasOpen && boardName ? boards.find(b => b.name === boardName)?.id : undefined}
            />
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
        className="fixed z-50"
        style={{
          top: 64, right: 8, bottom: 8,
          width: activeSidebar === 'row-detail' ? (panelLayout === 'Fullscreen' ? window.innerWidth * 0.75 : panelLayout === 'Halfscreen' ? window.innerWidth * 0.5 : 436) : activeSidebar === 'ai-sidekick' ? 0 : 320,
          transform: (isRightOpen && activeSidebar !== 'ai-sidekick' && !(activeSidebar === 'row-detail' && panelLayout === 'Fullscreen')) ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 450ms cubic-bezier(0.16,1,0.3,1), width 450ms cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: isRightOpen && activeSidebar !== 'ai-sidekick' ? 'auto' : 'none',
        }}
      >
        {activeSidebar === 'row-detail' ? (
          <div className="h-full flex">
            <div
              className="flex-1 overflow-hidden rounded-xl relative"
              style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)' }}
            >
              {isJiraDetailOpen && selectedJiraRow
                ? <JiraDetailPanel row={selectedJiraRow} onClose={() => { setIsJiraDetailOpen(false); closeSidebar() }} />
                : selectedRow && <RowDetailPanel row={selectedRow} onClose={closeSidebar} initialCompany={initialCompany} onAddToBoard={handleAddToBoard} onRowUpdated={handleRowUpdated} timelineDates={selectedRowDates} onCompanyFilter={handleCompanyFilter} activeCompanyFilter={companyFilter.length > 0 ? companyFilter : null} selectedLayout={panelLayout} onLayoutChange={setPanelLayout} hideInsightCallout={activePage === 'overview'} hideComments={activePage === 'overview'} overrideSummary={activePage === 'overview' && overviewCardId ? OVERVIEW_CARD_SUMMARIES[overviewCardId] : undefined} onOpenSidekick={() => { setSidekickSource('panel'); setActiveSidebar('ai-sidekick'); setSidekickFocusItemId(selectedRow.id) }} onWorkOnCanvas={() => { setSidekickTransitioning(true); setTimeout(() => setCanvasTransitionPhase('loading'), 800) }} onMoveToRoadmap={() => handleMoveToRoadmap(selectedRow.id)} />
              }
            </div>
          </div>
        ) : activeSidebar === 'ai-sidekick' ? (
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} />
        ) : (
          <SidebarShell side="right" onClose={closeSidebar} showClose={activeSidebar !== 'view-settings'} width={320}>
            {activeSidebar === 'view-settings' && <SidePanel onClose={closeSidebar} fields={pageFields} />}
          </SidebarShell>
        )}
      </div>

      {/* Canvas overlay */}
      <CanvasOverlay
        isOpen={canvasOpen || canvasTransitionPhase !== 'idle'}
        interactive={canvasOpen}
        panX={panX}
        panY={panY}
        zoom={zoom}
        smoothPanning={smoothPanning}
        onPan={(dx: number, dy: number) => { setPanX(p => p + dx); setPanY(p => p + dy) }}
        onZoom={zoomTo}
        onDeselect={() => setSelectedWidgetId(null)}
      />

      {/* Ghost chrome — visible during canvas loading transition */}
      <CanvasGhostChrome isVisible={canvasTransitionPhase === 'loading' && !canvasOpen} />

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
          externalAccepted={docAccepted}
          onKeep={() => { setDocAccepted(true) }}
          onScrap={() => { setWidgets(prev => prev.filter(w => w.id !== widget.id)); setFlowStreaming(false) }}
        />
      ))}

      {/* Connection lines between linked widgets (disabled for board flow) */}

      {/* Canvas floating nav panels */}
      <CanvasNavPanels isOpen={canvasOpen} databaseTitle={databaseTitle} onMenuClick={() => setActiveSidebar(activeSidebar === 'space-menu' ? null : 'space-menu')} isMenuOpen={canvasOpen && activeSidebar === 'space-menu'} boardName={boardName ?? undefined} boardIconIndex={boardIconIndex} />

      {/* Canvas creation toolbar — left edge, vertically centred */}
      <CanvasCreationToolbar isOpen={canvasOpen} isMenuOpen={canvasOpen && activeSidebar === 'space-menu'} />

      {/* Transitioning sidekick — persists outside main app layout during canvas open */}
      {sidekickTransitioning && (
        <div
          className="fixed z-[10000] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            top: 64,
            right: 8,
            bottom: 8,
            width: 436,
          }}
        >
          <div
            className="h-full overflow-hidden rounded-xl flex flex-col"
            style={{
              boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)',
              background: '#fff',
            }}
          >
            <BoardSidekickPanel
              onClose={() => { setSidekickTransitioning(false); setCanvasTransitionPhase('idle'); closeSidebar() }}
              onWritePRD={handleWritePRD}
              isGenerating={flowStreaming}
              isComplete={!flowStreaming && flowProgress >= 1}
              onAddToBoard={() => setDocAccepted(true)}

              selectedRowTitle={selectedRow?.title}
              spaceName={spaceName}
              onCardReady={() => {
                if (selectedRow) handleAddRecordToBoard(selectedRow.id)
              }}
              onLoadingComplete={() => {
                setCanvasTransitionPhase('complete')
              }}
              onViewDoc={() => {
                const docWidget = widgets.find(w => w.type === 'document')
                if (docWidget) {
                  const targetX = -docWidget.x + (window.innerWidth - 400 - 8 - 600) / 2
                  const targetY = -docWidget.y + (window.innerHeight - 400) / 2
                  setSmoothPanning(true)
                  setPanX(targetX)
                  setPanY(targetY)
                  setTimeout(() => setSmoothPanning(false), 700)
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Board Sidekick + Flow progress — stacked column on the right */}
      <div
        className="fixed z-[10000] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          top: 64,
          right: 8,
          bottom: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: 436,
          opacity: canvasOpen && boardSidekickOpen && !sidekickTransitioning ? 1 : 0,
          transform: canvasOpen && boardSidekickOpen && !sidekickTransitioning ? 'translateX(0)' : 'translateX(16px)',
          pointerEvents: canvasOpen && boardSidekickOpen && !sidekickTransitioning ? 'auto' : 'none',
        }}
      >
        {/* Sidekick panel */}
        <div
          className="h-full overflow-hidden rounded-xl flex flex-col"
          style={{ boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)', background: '#fff' }}
        >
          <BoardSidekickPanel
            onClose={() => setBoardSidekickOpen(false)}
            onWritePRD={handleWritePRD}
            isGenerating={flowStreaming}
            isComplete={!flowStreaming && flowProgress >= 1}
            onAddToBoard={() => setDocAccepted(true)}
            onViewDoc={() => {
              const docWidget = widgets.find(w => w.type === 'document')
              if (!docWidget) return
              const sidekickW = 400 + 8
              const availableW = window.innerWidth - sidekickW
              const targetPanX = (availableW / 2) - (docWidget.x + 300) * zoom
              const targetPanY = -(docWidget.y * zoom) + 56 + 24 + 64
              setSmoothPanning(true)
              requestAnimationFrame(() => { setPanX(targetPanX); setPanY(targetPanY) })
              setTimeout(() => setSmoothPanning(false), 700)
            }}
          />
        </div>
      </div>

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
