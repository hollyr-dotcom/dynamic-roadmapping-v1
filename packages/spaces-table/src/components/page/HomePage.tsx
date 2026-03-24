import { useState, useEffect, useRef } from 'react'
import {
  Button,
  Checkbox,
  DropdownMenu,
  IconButton,
  IconHouse,
  IconClock,
  IconCross,
  IconStar,
  IconInsights,
  IconRectanglePlayStack,
  IconPlus,
  IconChevronRight,
  IconChevronDown,
  IconLayout,
  IconMagnifyingGlass,
  IconRocket,
  IconTable,
  IconFileSpreadsheet,
  Tooltip,
  IconWand,
  IconCard,
  IconEyeOpen,
  IconSquarePencil,
  Input,
} from '@mirohq/design-system'
import { JiraLogo } from '../JiraLogo'

// Figma asset URLs (valid for 7 days — refreshed 2026-03-21)
const imgBoardIconTable = 'https://www.figma.com/api/mcp/asset/d7b60294-cc30-4857-8d54-a7653877ba6e'
const imgLogotype = 'https://www.figma.com/api/mcp/asset/80edae33-8543-4004-9cd9-3c2683b456f7'
const imgFlowchart = 'https://www.figma.com/api/mcp/asset/a4dddbd5-d73c-4e7c-8197-74a7c5d867b0'
const imgMindMap = 'https://www.figma.com/api/mcp/asset/77a865ad-4463-4519-9320-6831a30db731'
const imgAvatar = 'https://www.figma.com/api/mcp/asset/99ca612c-bb8f-43e3-9e2d-03c360402bab'
const imgAvatar1 = 'https://www.figma.com/api/mcp/asset/a84e9247-5ce5-4dbd-a4df-6d7306575fe6'
const imgTeamLogo = 'https://www.figma.com/api/mcp/asset/44bfeb43-b76c-4d54-95fb-97977f613434'
const imgIconPlant = 'https://www.figma.com/api/mcp/asset/b30043eb-8310-45fe-938e-7043c16d9b1e'
const imgIconPaper = 'https://www.figma.com/api/mcp/asset/b2c32c3d-f6c6-4bca-82ea-e939aa8b8fd6'
const imgIconCursor = 'https://www.figma.com/api/mcp/asset/5aa2aa86-317b-45da-8fbb-ad70ae381e9e'
const imgIconPeople = 'https://www.figma.com/api/mcp/asset/f41d1387-525d-485b-b551-6283d8fbc72c'
const imgIconOrgChart = 'https://www.figma.com/api/mcp/asset/84a5a35e-70db-41e7-9170-5a37ac2ad7b8'
const imgShareAvatar = 'https://www.figma.com/api/mcp/asset/33cf113b-9e21-4dfe-882a-5d61c2dd67ff'
const imgMiroTeamLogo = 'https://www.figma.com/api/mcp/asset/c9119d54-1298-4f33-a414-9b1ce85ffd9c'

interface HomePageProps {
  onOpenApp: (importSource?: 'jira' | 'miro' | 'csv') => void
}

const templates = [
  { label: 'Blank Board', isBlank: true },
  { label: 'Flowchart', img: imgFlowchart },
  { label: 'Mind Map', img: imgMindMap },
  {
    label: 'Kanban Framework', custom: (
      <div className="w-full h-full bg-white flex flex-col gap-3 items-start justify-center p-3">
        <div className="bg-[#867aff] h-2 rounded-full w-full" />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-2 w-full">
            <div className="h-px flex-1 bg-[#d1d4db]" />
            <div className="h-px flex-1 bg-[#d1d4db]" />
            <div className="h-px flex-1 bg-[#d1d4db]" />
          </div>
          <div className="flex flex-col gap-1 w-1/3">
            <div className="border border-[#fd3] h-2 w-full" />
            <div className="border border-[#867aff] h-2 w-full" />
          </div>
          <div className="flex gap-2 w-full">
            <div className="h-px flex-1 bg-[#d1d4db]" />
            <div className="h-px flex-1 bg-[#d1d4db]" />
            <div className="h-px flex-1 bg-[#d1d4db]" />
          </div>
        </div>
      </div>
    )
  },
  {
    label: 'Quick Retrospective', custom: (
      <div className="w-full h-full grid grid-cols-2 gap-1 p-2">
        <div className="rounded bg-[#BBDEFB] h-full" />
        <div className="rounded bg-[#C8E6C9] h-full" />
        <div className="rounded bg-[#FFE0B2] h-full" />
        <div className="rounded bg-[#F8BBD0] h-full" />
      </div>
    )
  },
  {
    label: 'Intelligent Templates', custom: (
      <div className="w-full h-full flex flex-col gap-1.5 p-2 justify-center">
        <div className="flex gap-1.5">
          <div className="flex-1 h-6 rounded bg-[#FFF59D] border border-[#F9A825]/30" />
          <div className="flex-1 h-6 rounded bg-[#B39DDB] border border-[#7E57C2]/30" />
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 h-6 rounded bg-[#80CBC4] border border-[#00897B]/30" />
          <div className="flex-1 h-6 rounded bg-[#EF9A9A] border border-[#E53935]/30" />
        </div>
      </div>
    )
  },
]

const boards = [
  { iconImg: imgIconPlant,    name: 'FY25 Product Illustrations...',  modifier: 'Alberta', date: 'Today', space: '',                classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 3 },
  { iconImg: imgIconPaper,    name: 'Design Reviews - FY25 Q4',       modifier: 'Alberta', date: 'Today', space: 'Product Design',   classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { iconImg: imgIconCursor,   name: 'User Testing Prep',               modifier: 'Alberta', date: 'Today', space: "Alberta's Space",  classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 1 },
  { iconImg: imgIconOrgChart, name: 'Space Overview - Reviews',        modifier: 'Alberta', date: 'Today', space: 'Spaces',           classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { iconImg: imgIconPeople,   name: 'Design Review Team Picker',       modifier: 'Alberta', date: 'Today', space: 'Spaces',           classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { iconImg: imgIconPeople,   name: 'Design Review Team Picker',       modifier: 'Alberta', date: 'Today', space: 'Spaces',           classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
]

export function HomePage({ onOpenApp }: HomePageProps) {
  const [spacesMenuOpen, setSpacesMenuOpen] = useState(false)
  const [yourSpacesExpanded, setYourSpacesExpanded] = useState(true)
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<'create' | 'csv' | 'share' | 'miro' | 'jira'>('create')
  const [jiraSelectedKeys, setJiraSelectedKeys] = useState<Set<string>>(new Set(['UR-348', 'UR-347']))
  const [modalFading, setModalFading] = useState(false)
  const [spaceName, setSpaceName] = useState('Project Galaxy')
  const [importJira, setImportJira] = useState(false)
  const [importTables, setImportTables] = useState(false)
  const [importCsv, setImportCsv] = useState(false)
  const [enrichInsights, setEnrichInsights] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!spacesMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSpacesMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [spacesMenuOpen])

  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden">

      {/* ── Left sidebar ── */}
      <div className="flex flex-col w-[236px] shrink-0 bg-white border-r border-[#d1d4db] h-full overflow-visible">

        {/* Team header */}
        <div className="flex items-center gap-2 px-3 pt-4 pb-2 mt-1">
          <div className="w-8 h-8 rounded-[6px] overflow-hidden shrink-0 border border-[#d1d4db]">
            <img src={imgTeamLogo} alt="Mirage" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-[16px] text-[#1a1b1e] leading-tight truncate" style={{ fontFamily: "'Roobert PRO', sans-serif", letterSpacing: '-0.16px' }}>Mirage</span>
            <span className="text-[12px] text-[#656b81] leading-tight" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Miro</span>
          </div>
          <IconChevronDown size="small" />
        </div>

        {/* Search */}
        <div className="px-3 pt-1 pb-4">
          <div className="flex items-center gap-2 border border-[#d1d4db] bg-[#f8f8f9] rounded-lg px-3 h-9">
            <IconMagnifyingGlass size="small" />
            <span className="text-[13px] text-[#9da3b4]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Search by title or topic</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-2 mb-4">
          {[
            { label: 'Home', icon: IconHouse, active: true },
            { label: 'Recent', icon: IconClock, active: false },
            { label: 'Starred', icon: IconStar, active: false },
            { label: 'Insights', icon: IconInsights, active: false },
            { label: 'Video Recordings', icon: IconRectanglePlayStack, active: false },
          ].map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-lg w-full text-left ${active ? 'bg-[#f3f4f6]' : ''}`}
            >
              <Icon size="medium" />
              <span className={`text-[14px] text-[#1a1b1e] leading-none ${active ? 'font-semibold' : ''}`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {label}
              </span>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 h-px bg-[#e9eaef] mb-4" />

        {/* Spaces */}
        <div className="px-2 relative" ref={menuRef}>
          <div className="flex items-center justify-between pl-2 pr-1 mb-2">
            <span className="text-[14px] text-[#656b81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Spaces</span>
            <DropdownMenu open={spacesMenuOpen} onClose={() => setSpacesMenuOpen(false)}>
              <Tooltip delayDuration={0} open={spacesMenuOpen ? false : undefined}>
                <Tooltip.Trigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <button
                      onClick={() => setSpacesMenuOpen(v => !v)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                        spacesMenuOpen ? 'bg-[#e9eaef]' : 'hover:bg-[#f3f4f6]'
                      }`}
                    >
                      <IconPlus size="small" />
                    </button>
                  </DropdownMenu.Trigger>
                </Tooltip.Trigger>
                <Tooltip.Content side="top" sideOffset={4}>
                  Create a space
                </Tooltip.Content>
              </Tooltip>
              <DropdownMenu.Content side="bottom" align="start" sideOffset={4} alignOffset={-16} css={{ minWidth: 220 }}>
                <DropdownMenu.Item onSelect={() => { setSpacesMenuOpen(false); onOpenApp() }}>
                  <DropdownMenu.IconSlot>
                    <span className="inline-flex items-center justify-center size-4 rounded-sm bg-gradient-to-br from-[#6C5CE7] to-[#2D3436] overflow-hidden">
                      <span className="text-white text-[8px] font-bold">E</span>
                    </span>
                  </DropdownMenu.IconSlot>
                  EPD WoW v2.2
                </DropdownMenu.Item>
                <DropdownMenu.Separator css={{ marginTop: 4, marginBottom: 4 }} />
                <DropdownMenu.Item onSelect={() => { setSpacesMenuOpen(false); setCreateSpaceModalOpen(true) }}>
                  <DropdownMenu.IconSlot><IconRocket /></DropdownMenu.IconSlot>
                  Roadmap
                </DropdownMenu.Item>
                <DropdownMenu.Separator css={{ marginTop: 4, marginBottom: 4 }} />
                <DropdownMenu.Item onSelect={() => { setSpacesMenuOpen(false) }}>
                  <DropdownMenu.IconSlot><IconLayout /></DropdownMenu.IconSlot>
                  Blueprint
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => { setSpacesMenuOpen(false); setCreateSpaceModalOpen(true) }}>
                  <DropdownMenu.IconSlot><IconPlus /></DropdownMenu.IconSlot>
                  Blank
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>

          {/* Your Spaces */}
          <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg w-full text-left">
            {yourSpacesExpanded ? <IconChevronDown size="small" /> : <IconChevronRight size="small" />}
            <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Your Spaces</span>
          </div>

          {yourSpacesExpanded && (
            <div className="flex flex-col gap-0.5 pl-2 mb-1">
              {['Project Newton', 'Sync Communication', 'Project Newton'].map((name, i) => (
                <div key={i} className="flex items-center px-3 py-2 rounded-lg w-full text-left">
                  <span className="text-[14px] text-[#1c1c1c]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{name}</span>
                </div>
              ))}
            </div>
          )}

          {/* All Spaces */}
          <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg w-full text-left">
            <IconChevronRight size="small" />
            <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>All Spaces</span>
          </div>
        </div>
      </div>

      {/* ── Space modal ── */}
      {createSpaceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(99,107,130,0.55)' }}
          onClick={() => { setCreateSpaceModalOpen(false); setSpaceName('Project Galaxy'); setImportJira(false); setImportTables(false); setImportCsv(false); setEnrichInsights(true); setModalStep('create') }}
        >
          <div
            className="bg-white flex flex-col relative"
            style={{
              width: (modalStep === 'miro' || modalStep === 'jira') ? 1200 : 560,
              maxWidth: (modalStep === 'miro' || modalStep === 'jira') ? 1200 : 560,
              height: (modalStep === 'miro' || modalStep === 'jira') ? 752 : undefined,
              padding: (modalStep === 'miro' || modalStep === 'jira' || modalStep === 'share') ? 0 : 40,
              gap: (modalStep === 'miro' || modalStep === 'jira' || modalStep === 'share') ? 0 : 16,
              borderRadius: modalStep === 'share' ? 16 : 8,
              isolation: 'isolate',
              filter: modalStep === 'share'
                ? 'drop-shadow(0px 8px 32px rgba(5, 0, 56, 0.08))'
                : 'drop-shadow(0px 6px 16px rgba(34, 36, 40, 0.12)) drop-shadow(0px 0px 8px rgba(34, 36, 40, 0.06))',
              opacity: modalFading ? 0 : 1,
              transition: 'opacity 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <div className="absolute top-4 right-4 z-10">
              <IconButton
                variant="ghost"
                size="large"
                aria-label="Close"
                onPress={() => { setCreateSpaceModalOpen(false); setSpaceName('Project Galaxy'); setImportJira(false); setImportTables(false); setImportCsv(false); setEnrichInsights(true); setModalStep('create') }}
              >
                <IconCross />
              </IconButton>
            </div>

            {modalStep === 'create' ? (<>
              {/* Title */}
              <h2 className="text-[22px] text-[#1a1b1e] leading-[40px] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif", minHeight: 40 }}>Name your roadmap space</h2>

              {/* Space name */}
              <Input
                autoFocus
                size="x-large"
                placeholder="Project Galaxy"
                value={spaceName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpaceName(e.target.value)}
              />

              {/* Import records from */}
              <div className="flex flex-col gap-5 py-2">
                <span className="font-body font-semibold text-[16px] text-[#1a1b1e] leading-none">Import records from</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: <JiraLogo size={20} />, label: 'Jira', tooltip: 'Import issues and epics from your Jira projects', checked: importJira, toggle: () => { setImportJira(v => !v); setImportTables(false); setImportCsv(false) } },
                    { icon: <IconTable css={{ width: 20, height: 20 }} />, label: 'Tables', tooltip: 'Pull in items from your Miro tables', checked: importTables, toggle: () => { setImportTables(v => !v); setImportJira(false); setImportCsv(false) } },
                    { icon: <IconFileSpreadsheet css={{ width: 20, height: 20 }} />, label: 'CSV', tooltip: 'Upload a spreadsheet of work items', checked: importCsv, toggle: () => { setImportCsv(v => !v); setImportJira(false); setImportTables(false) } },
                  ].map(({ icon, label, tooltip, checked, toggle }) => (
                    <Tooltip key={label}>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={toggle}
                          className={`flex items-center gap-2 h-12 rounded-full transition-colors duration-150 ${
                            checked
                              ? 'border-[#4262FF] hover:border-[#3350e0] active:border-[#2b44c7]'
                              : 'border-[#e9eaef] hover:border-[#d5d8de] active:border-[#c2c5cc]'
                          } bg-white`}
                          style={{ borderWidth: '1.5px', borderStyle: 'solid', paddingLeft: 18, paddingRight: 12 }}
                        >
                          <span className="shrink-0 -translate-y-px">{icon}</span>
                          <span className="text-[16px] text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif', paddingBottom: 1 }}>{label}</span>
                          <div className="pointer-events-none shrink-0 pill-checkbox translate-y-0.5">
                            <Checkbox checked={checked} />
                          </div>
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content side="top" sideOffset={4}>{tooltip}</Tooltip.Content>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Enrich records with */}
              <div className="flex flex-col gap-5 py-2">
                <span className="font-body font-semibold text-[16px] text-[#1a1b1e] leading-none">Enrich records with</span>
                <div className="flex">
                  <Tooltip>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() => setEnrichInsights(v => !v)}
                        className={`flex items-center gap-2 h-12 rounded-full transition-colors duration-150 ${
                          enrichInsights
                            ? 'border-[#4262FF] hover:border-[#3350e0] active:border-[#2b44c7]'
                            : 'border-[#e9eaef] hover:border-[#d5d8de] active:border-[#c2c5cc]'
                        } bg-white`}
                        style={{ borderWidth: '1.5px', borderStyle: 'solid', paddingLeft: 18, paddingRight: 12 }}
                      >
                        <span className="shrink-0 -translate-y-px">
                          <IconInsights css={{ width: 20, height: 20 }} />
                        </span>
                        <span className="text-[16px] text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif', paddingBottom: 1 }}>Insights</span>
                        <div className="pointer-events-none shrink-0 pill-checkbox translate-y-0.5">
                          <Checkbox checked={enrichInsights} />
                        </div>
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" sideOffset={4}>Enrich items with customer feedback and signals</Tooltip.Content>
                  </Tooltip>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="primary"
                  size="large"
                  onPress={() => {
                    const importSource = importJira ? 'jira' as const : importTables ? 'miro' as const : importCsv ? 'csv' as const : null
                    setCreateSpaceModalOpen(false); setSpaceName('Project Galaxy'); setImportJira(false); setImportTables(false); setImportCsv(false); setEnrichInsights(true); setModalStep('create')
                    onOpenApp(importSource ?? undefined)
                  }}
                >
                  <Button.Label>{(importJira || importTables || importCsv) ? 'Create and import' : 'Create'}</Button.Label>
                </Button>
                <Button
                  variant="ghost"
                  size="large"
                  onPress={() => { setCreateSpaceModalOpen(false); setSpaceName('Project Galaxy'); setImportJira(false); setImportTables(false); setImportCsv(false); setEnrichInsights(true); setModalStep('create') }}
                >
                  <Button.Label>Cancel</Button.Label>
                </Button>
              </div>
            </>) : modalStep === 'csv' ? (<>
              {/* CSV field mapping step */}
              <div className="flex flex-col gap-2 pr-12">
                <h2 className="text-[24px] text-[#222428] leading-[1.35]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 400 }}>Map fields to your backlog</h2>
                <p className="text-[16px] text-[#222428] leading-[1.5]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Match your imported fields to the corresponding backlog fields.</p>
              </div>

              {/* Field mapping table */}
              <div className="flex flex-col gap-4">
                {/* Column headers */}
                <div className="flex items-center gap-4">
                  <div className="w-[200px] shrink-0">
                    <span className="text-[14px] font-semibold text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Imported field</span>
                  </div>
                  <div className="w-6 shrink-0" />
                  <div className="flex-1">
                    <span className="text-[14px] font-semibold text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Backlog field</span>
                  </div>
                </div>

                {/* Rows */}
                {[
                  { col: 'Column 1', field: 'ID', hint: 'Unique identifier for each issue' },
                  { col: 'Column 2', field: 'Task', hint: "The issue's display namee" },
                  { col: 'Column 3', field: 'Description', hint: 'Brief summary of the issue' },
                  { col: 'Column 4', field: 'Assigned to', hint: 'Person responsible for completing the issue' },
                ].map(({ col, field, hint }) => (
                  <div key={field} className="flex items-start gap-4">
                    {/* Dropdown */}
                    <div className="w-[200px] shrink-0 relative">
                      <div className="flex items-center justify-between border border-[#e0e2e8] rounded-lg px-3 h-10 bg-white cursor-pointer hover:border-[#c7cad5] transition-colors">
                        <span className="text-[14px] text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{col}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#656b81" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center w-6 h-10 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#656b81" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>

                    {/* Backlog field */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center h-10 border border-[#e0e2e8] rounded-lg px-3 bg-[#f1f2f5]">
                        <span className="text-[14px] text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{field}</span>
                      </div>
                      <span className="text-[12px] text-[#656b81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{hint}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2" style={{ position: 'absolute', bottom: 40, left: 40 }}>
                <Button
                  variant="primary"
                  size="large"
                  onPress={() => { setModalFading(true); setTimeout(() => { setModalStep('share'); setModalFading(false) }, 220) }}
                >
                  <Button.Label>Continue</Button.Label>
                </Button>
              </div>
            </>) : modalStep === 'share' ? (<>
              {/* Share space step — Header */}
              <div style={{ padding: '32px 96px 8px 40px', flexShrink: 0 }}>
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 600, fontSize: 14, color: '#222428', margin: 0, lineHeight: 1 }}>Share space "{spaceName || 'Project Galaxy'}"</p>
              </div>

              {/* Share space step — Body 1: search */}
              <div style={{ padding: '16px 40px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, border: '1px solid #3859FF', borderRadius: 4, background: '#fff', paddingLeft: 12, paddingRight: 4 }}>
                  {/* Search icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="8.5" cy="8.5" r="5" stroke="#222428" strokeWidth="1.5"/>
                    <path d="M13 13L17 17" stroke="#222428" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ flex: 1, fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: 16, color: '#222428', lineHeight: '1.5' }}>Enter emails or invite from the team</span>
                  {/* Clear button */}
                  <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3 3 13" stroke="#222428" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                </div>
              </div>

              {/* Share space step — Body 2: space access */}
              <div style={{ padding: '8px 24px 8px 42px', display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 0 }}>
                {/* Label */}
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 600, fontSize: 14, color: '#222428', margin: 0, lineHeight: 1 }}>Space access</p>

                {/* Members */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Owner row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={imgShareAvatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, objectFit: 'cover', border: '3px solid white' }} />
                    <span style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: 14, color: '#222428', width: 270 }}>You're the space owner</span>
                  </div>

                  {/* Team row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={imgMiroTeamLogo} alt="" style={{ width: 30, height: 30, flexShrink: 0, objectFit: 'cover' }} />
                      <span style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: 14, color: '#222428' }}>Miro team (1864)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: 14, color: '#555A6A' }}>No access</span>
                      <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, cursor: 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#555A6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share space step — Footer */}
              <div style={{ borderTop: '1px solid #E0E2E8', padding: '16px 16px 16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, marginTop: 'auto' }}>
                {/* Copy link */}
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-4.95l-1 1" stroke="#3859FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 4.95l1-1" stroke="#3859FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#3859FF' }}>Copy Space link</span>
                </div>
                {/* Continue without inviting */}
                <Button
                  variant="ghost"
                  size="large"
                  onPress={() => { setCreateSpaceModalOpen(false); setSpaceName('Project Galaxy'); setImportJira(false); setImportTables(false); setImportCsv(false); setEnrichInsights(true); setModalStep('create'); onOpenApp() }}
                >
                  <Button.Label>Continue without inviting</Button.Label>
                  <Button.IconSlot placement="end"><IconChevronRight /></Button.IconSlot>
                </Button>
              </div>
            </>) : modalStep === 'jira' ? (<>
              {/* Jira step — Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 72px 0 32px', flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 400, fontSize: 24, lineHeight: '135%', color: '#222428', margin: 0 }}>Select issues</h2>
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', margin: '2px 0 0 0' }}>Company URL</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {([
                    { label: 'Settings', Icon: IconWand },
                    { label: 'Configure cards', Icon: IconCard },
                    { label: 'Show imported', Icon: IconEyeOpen },
                    { label: 'Create issue', Icon: IconSquarePencil },
                  ] as Array<{ label: string; Icon: (props: { css?: Record<string, unknown> }) => JSX.Element }>).map(({ label, Icon }) => (
                    <button key={label} className="hover:bg-[#f1f2f5] transition-colors" style={{ height: 32, padding: '0 10px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: 16, color: '#222428', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon css={{ width: 16, height: 16, minWidth: 16, minHeight: 16, color: '#222428', flexShrink: 0 }} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jira step — Search */}
              <div style={{ padding: '16px 32px 0', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e2e8', borderRadius: 6, height: 40, padding: '0 12px', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9da3b4" strokeWidth="1.5"/><path d="M10.5 10.5L14 14" stroke="#9da3b4" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, color: '#9da3b4' }}>Basic search</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#222428' }}>Advanced search</span>
                    <div style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: '#4262FF', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', right: 3, top: 3, width: 14, height: 14, borderRadius: '50%', backgroundColor: 'white' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Jira step — Table */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '12px 32px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '32px 24px 100px 1fr 140px 32px 120px', gap: 8, alignItems: 'center', padding: '0 8px', height: 36, borderBottom: '1px solid #e0e2e8', flexShrink: 0 }}>
                  <div />
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 11 }}>≡</span> Rank
                  </span>
                  {[
                    { label: 'Key', prefix: 'T' },
                    { label: 'Summary', prefix: null },
                    { label: 'Assignee', prefix: null },
                    { label: 'P', prefix: null },
                    { label: 'Status', prefix: null },
                  ].map(({ label, prefix }) => (
                    <span key={label} style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      {prefix && <span style={{ fontSize: 11, fontStyle: 'italic' }}>{prefix}</span>}
                      {label}
                    </span>
                  ))}
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {([
                    { key: 'SE-397', type: 'bug', summary: "Manual resize of sidebar after expand button doesn't work", assignee: 'Chance Curtis', priority: null, status: 'To Do' },
                    { key: 'ENTS-1', type: 'story', summary: '[FE] Come up with contracts for Custom Roles based on e...', assignee: 'Petar Grchev...', priority: 'high', status: 'To Do' },
                    { key: 'UR-349', type: 'task', summary: 'Test all Password dumpers', assignee: '-', priority: null, status: 'Backlog' },
                    { key: 'UR-348', type: 'task', summary: 'Create User Password Reader', assignee: '-', priority: null, status: 'Backlog' },
                    { key: 'SE-396', type: 'bug', summary: 'Last scrolled item is not visible', assignee: '-', priority: null, status: 'Backlog' },
                    { key: 'UR-347', type: 'task', summary: 'Create User Password Writer', assignee: '-', priority: null, status: 'To Do' },
                    { key: 'UR-346', type: 'task', summary: 'Implement migration write strategies for Password', assignee: '-', priority: null, status: 'Backlog' },
                    { key: 'UR-345', type: 'task', summary: 'Implement migration read strategies for Password', assignee: '-', priority: null, status: 'Backlog' },
                    { key: 'ENTS-2', type: 'story', summary: 'Migrate miro-site-sso from Lokalise to Phrase', assignee: 'Kostya Teplo...', priority: null, status: 'Review/Testing' },
                    { key: 'UR-344', type: 'task', summary: 'Create dumper to clear all Passwords from DDB', assignee: '-', priority: null, status: 'Backlog' },
                  ] as Array<{ key: string; type: string; summary: string; assignee: string; priority: string | null; status: string }>).map((issue) => {
                    const checked = jiraSelectedKeys.has(issue.key)
                    const typeColor = issue.type === 'bug' ? '#FF5630' : issue.type === 'story' ? '#65BA43' : '#4BADE8'
                    const statusBg = issue.status === 'Review/Testing' ? '#FFD02F' : 'transparent'
                    const statusTxt = issue.status === 'Review/Testing' ? '#1a1b1e' : '#656b81'
                    return (
                      <div
                        key={issue.key}
                        className="hover:bg-[#f9f9fb] transition-colors"
                        style={{ display: 'grid', gridTemplateColumns: '32px 24px 100px 1fr 140px 32px 120px', gap: 8, alignItems: 'center', padding: '0 8px', height: 44, borderBottom: '1px solid #f1f2f5', cursor: 'pointer' }}
                        onClick={() => setJiraSelectedKeys(prev => { const next = new Set(prev); if (next.has(issue.key)) next.delete(issue.key); else next.add(issue.key); return next })}
                      >
                        <div style={{ width: 16, height: 16, borderRadius: 3, border: checked ? 'none' : '1.5px solid #9da3b4', backgroundColor: checked ? '#4262FF' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {checked && <svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 3.5l2.5 2.5 5.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, color: '#9da3b4' }}>…</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: typeColor, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#4262FF', whiteSpace: 'nowrap' }}>{issue.key}</span>
                        </div>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#222428', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.summary}</span>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.assignee}</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {issue.priority === 'high'
                            ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v8M4 5l3-3 3 3" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #9da3b4' }} />
                          }
                        </div>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, color: statusTxt, backgroundColor: statusBg, borderRadius: 3, padding: statusBg !== 'transparent' ? '2px 6px' : 0, whiteSpace: 'nowrap' }}>{issue.status}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Jira step — Footer */}
              <div style={{ padding: '16px 32px 32px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Button
                  variant="primary"
                  size="large"
                  onPress={() => { setModalFading(true); setTimeout(() => { setModalStep('share'); setModalFading(false) }, 220) }}
                >
                  <Button.Label>Import</Button.Label>
                </Button>
              </div>
            </>) : (<>
              {/* Miro step — Header */}
              <div style={{ padding: '32px 96px 8px 40px', flexShrink: 0 }}>
                <h2 style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 400, fontSize: 24, lineHeight: '135%', color: '#222428', margin: 0 }}>Select data table</h2>
              </div>

              {/* Miro step — Body */}
              <div style={{ padding: '16px 40px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflow: 'hidden' }}>

                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 50, background: '#F3F4F6', borderRadius: 5, padding: '5px 5px 5px 10px', flexShrink: 0 }}>
                  <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <circle cx="10.5" cy="10.5" r="6.5" stroke="#1C1C1C" strokeWidth="1.875"/>
                      <path d="M16.5 16.5L21.5 21.5" stroke="#040C33" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: 16, color: '#686685' }}>Search data tables</span>
                </div>

                {/* Board list */}
                <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                  {[
                    { name: 'FY25 Product Illustrations...', modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                    { name: 'Design Reviews - FY25 Q4',     modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                    { name: 'User Testing Prep',            modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                    { name: 'Space Overview - Reviews',     modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                    { name: 'Design Review Team Picker',    modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                    { name: 'Design Review Team Picker',    modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                    { name: 'Design Review Team Picker',    modified: 'Modified by Alberta, Today', board: 'FY26 Board', space: 'Space', lastOpened: 'Today', owner: 'Alberta Mcdonald' },
                  ].map((board, i) => (
                    <div key={i} className="hover:bg-[#f9f9fb] transition-colors" style={{ display: 'flex', alignItems: 'center', height: 76, cursor: 'pointer', flexShrink: 0, borderRadius: 5 }}>
                      {/* Name + subtitle */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 15, minWidth: 0, paddingLeft: 15, paddingRight: 30 }}>
                        <img src={imgBoardIconTable} alt="" style={{ width: 42, height: 42, flexShrink: 0, objectFit: 'contain', padding: 7, boxSizing: 'content-box' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 700, fontSize: 16, color: '#1A1B1E', margin: 0, lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.name}</p>
                          <p style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: 15, color: '#656B81', margin: 0, lineHeight: '25px' }}>{board.modified}</p>
                        </div>
                      </div>
                      {/* Board / Space */}
                      <div style={{ width: 299, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 15, paddingBottom: 15 }}>
                        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 16, color: '#1A1B1E', margin: 0, lineHeight: '1.5' }}>{board.board}</p>
                        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 16, color: '#1A1B1E', margin: 0, lineHeight: '1.5' }}>{board.space}</p>
                      </div>
                      {/* Last opened */}
                      <div style={{ width: 170, flexShrink: 0 }}>
                        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 16, color: '#656B81', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.lastOpened}</p>
                      </div>
                      {/* Owner */}
                      <div style={{ width: 191, flexShrink: 0 }}>
                        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 16, color: '#656B81', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.owner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Miro step — Footer */}
              <div style={{ padding: '16px 40px 40px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <Button
                  variant="primary"
                  size="large"
                  onPress={() => { setModalFading(true); setTimeout(() => { setModalStep('csv'); setModalFading(false) }, 220) }}
                >
                  <Button.Label>Complete setup</Button.Label>
                </Button>
                <Button
                  variant="ghost"
                  size="large"
                  onPress={() => { setCreateSpaceModalOpen(false); setSpaceName('Project Galaxy'); setImportJira(false); setImportTables(false); setImportCsv(false); setEnrichInsights(true); setModalStep('create'); onOpenApp() }}
                >
                  <Button.Label>Configure later</Button.Label>
                </Button>
              </div>
            </>)}

          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-7 py-3 bg-white border-b border-[#ebecf0] shrink-0">
          <img src={imgLogotype} alt="miro" style={{ width: '74px', height: '26px' }} />
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-[46px] h-[46px] flex items-center justify-center rounded-lg">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2a6.5 6.5 0 00-6.5 6.5v3.5L3 14.5A1 1 0 004 16h14a1 1 0 001-1.5L17.5 12V8.5A6.5 6.5 0 0011 2z" stroke="#1a1b1e" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 16a2 2 0 004 0" stroke="#1a1b1e" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="absolute top-1 right-1 bg-[#1a1b1e] text-white text-[9px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center leading-none">9</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=74&h=74&fit=crop&crop=face"
              alt="TL"
              className="w-[37px] h-[37px] rounded-full object-cover border-2 border-white"
            />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 pt-6 pb-10">

            {/* Template carousel */}
            <div className="mb-8 pt-2">
              <div className="flex gap-5">
                {templates.map((t) => (
                  <div
                    key={t.label}
                    className="flex-1 flex flex-col gap-2"
                  >
                    <div className="w-full h-[108px] rounded-xl border border-[#d1d4db] overflow-hidden bg-white flex items-center justify-center">
                      {t.isBlank ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <IconPlus size="large" />
                        </div>
                      ) : t.img ? (
                        <img src={t.img} alt={t.label} className="w-full h-full object-cover" />
                      ) : t.custom ? (
                        t.custom
                      ) : null}
                    </div>
                    <span className="text-[16px] text-[#6c7173] px-1 text-left" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600 }}>
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Boards header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[24px] font-semibold text-[#1a1b1e]" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Boards in this team</h2>
              <div className="flex items-center gap-1.5 bg-[#4262FF] text-white text-[14px] font-medium px-4 py-2 rounded-lg">
                <IconPlus size="small" />
                Create new
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[14px] text-[#656b81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Filter by:</span>
              {['All boards', 'Owned by anyone', 'Any classification'].map(label => (
                <div key={label} className="flex items-center gap-1.5 border border-[#d1d4db] rounded-lg px-3 py-1.5 text-[14px] text-[#1a1b1e] bg-white" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {label}
                  <IconChevronDown size="small" />
                </div>
              ))}
              <span className="text-[14px] text-[#656b81] ml-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>Sort by:</span>
              <div className="flex items-center gap-1.5 border border-[#d1d4db] rounded-lg px-3 py-1.5 text-[14px] text-[#1a1b1e] bg-white" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Last opened
                <IconChevronDown size="small" />
              </div>
            </div>

            {/* Board table */}
            <div>
              {/* Header */}
              <div className="grid gap-4 px-4 py-2 border-b border-[#e9eaef]" style={{ gridTemplateColumns: '3fr 1fr 1.5fr 1fr 1fr 1.5fr' }}>
                {['', 'Online users', 'Space', 'Last opened', 'Classification', 'Owner'].map((h, i) => (
                  <span key={i} className="text-[13px] text-[#656b81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {boards.map((board, idx) => (
                <div
                  key={idx}
                  className={`w-full grid gap-4 px-4 py-4 text-left ${idx < boards.length - 1 ? 'border-b border-[#e9eaef]' : ''}`}
                  style={{ gridTemplateColumns: '3fr 1fr 1.5fr 1fr 1fr 1.5fr' }}
                >
                  {/* Name + icon */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                      <img src={board.iconImg} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#1a1b1e] truncate" style={{ fontFamily: 'Open Sans, sans-serif' }}>{board.name}</div>
                      <div className="text-[12px] text-[#656b81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Modified by {board.modifier}, {board.date}</div>
                    </div>
                  </div>

                  {/* Online users */}
                  <div className="flex items-center gap-1">
                    {board.onlineCount > 0 && (
                      <>
                        <img src={imgAvatar} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-white" />
                        {board.onlineCount > 1 && (
                          <>
                            <img src={imgAvatar1} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-white -ml-2" />
                            {board.onlineCount > 2 && (
                              <span className="text-[11px] text-[#656b81] bg-[#f3f4f6] rounded-full px-1.5 py-0.5 -ml-1">+{board.onlineCount - 2}</span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Space */}
                  <div className="flex items-center">
                    {board.space && (
                      <div className="flex items-center gap-1">
                        <span className="text-[12px]">🗂</span>
                        <span className="text-[13px] text-[#656b81] truncate">{board.space}</span>
                      </div>
                    )}
                  </div>

                  {/* Last opened */}
                  <div className="flex items-center">
                    <span className="text-[13px] text-[#1a1b1e]">{board.date}</span>
                  </div>

                  {/* Classification */}
                  <div className="flex items-center">
                    {board.classification && (
                      <span className="text-[11px] font-bold text-[#1a1b1e] bg-[#FFD02F] px-2 py-0.5 rounded">{board.classification}</span>
                    )}
                  </div>

                  {/* Owner */}
                  <div className="flex items-center">
                    <span className="text-[13px] text-[#1a1b1e] truncate">{board.owner}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
