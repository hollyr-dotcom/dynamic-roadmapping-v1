import { useState, useEffect, useRef } from 'react'
import {
  IconHouse,
  IconClock,
  IconStar,
  IconInsights,
  IconRectanglePlayStack,
  IconPlus,
  IconChevronRight,
  IconChevronDown,
  IconMagnifyingGlass,
  IconLayout,
  IconMap,
} from '@mirohq/design-system'

// Figma asset URLs (valid for 7 days)
const imgFlowchart = 'https://www.figma.com/api/mcp/asset/6ba42a08-630f-4ccc-9f62-54f93def85ef'
const imgMindMap = 'https://www.figma.com/api/mcp/asset/201f5647-1b17-4e83-8646-bc7e0544bd32'
const imgAvatar = 'https://www.figma.com/api/mcp/asset/21f01b96-dd1f-4d43-988d-090c66c82fb0'
const imgAvatar1 = 'https://www.figma.com/api/mcp/asset/c232da90-4266-4675-bebd-8056348a6e65'
const imgTeamLogo = 'https://www.figma.com/api/mcp/asset/c3fad6a0-37fd-4eac-8e4d-2698a45aefd3'

interface HomePageProps {
  onOpenApp: () => void
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
  { color: '#4262FF', icon: '▣', name: 'Space Overview - Annotations...', modifier: 'Alberta', date: 'Today', space: '', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 3 },
  { color: '#1A9DE1', icon: '⬜', name: 'Design Reviews - FY25 Q4', modifier: 'Alberta', date: 'Today', space: 'Product Design', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { color: '#F76707', icon: '▷', name: 'User Testing Prep', modifier: 'Alberta', date: 'Today', space: "Alberta's Space", classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 1 },
  { color: '#7048E8', icon: '👤', name: 'Space Overview - Reviews', modifier: 'Alberta', date: 'Today', space: 'Spaces', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { color: '#E03131', icon: '👥', name: 'Design Review Team Picker', modifier: 'Alberta', date: 'Today', space: 'Spaces', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { color: '#E03131', icon: '👥', name: 'Design Review Team Picker', modifier: 'Alberta', date: 'Today', space: 'Spaces', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
]

export function HomePage({ onOpenApp }: HomePageProps) {
  const [spacesMenuOpen, setSpacesMenuOpen] = useState(false)
  const [yourSpacesExpanded, setYourSpacesExpanded] = useState(true)
  const [createSubmenuOpen, setCreateSubmenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!spacesMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSpacesMenuOpen(false)
        setCreateSubmenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [spacesMenuOpen])

  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden">

      {/* ── Left sidebar ── */}
      <div className="flex flex-col w-[236px] shrink-0 bg-white border-r border-[#d1d4db] h-full overflow-y-auto">

        {/* Team header */}
        <div className="flex items-center gap-2 px-3 pt-2 pb-1 mt-1">
          <div className="w-8 h-8 rounded-[6px] overflow-hidden shrink-0 border border-[#d1d4db]">
            <img src={imgTeamLogo} alt="Mirage" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-[16px] text-[#1a1b1e] leading-tight truncate" style={{ fontFamily: 'Roobert PRO, sans-serif', letterSpacing: '-0.16px' }}>Mirage</span>
            <span className="text-[12px] text-[#656b81] leading-tight" style={{ fontFamily: 'Roobert PRO, sans-serif' }}>Miro</span>
          </div>
          <IconChevronDown size="small" />
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 border border-[#d1d4db] rounded-lg px-3 h-8">
            <IconMagnifyingGlass size="small" />
            <span className="text-[13px] text-[#656b81]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Search by title or topic</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 mb-2">
          {[
            { label: 'Home', icon: IconHouse, active: true },
            { label: 'Recent', icon: IconClock, active: false },
            { label: 'Starred', icon: IconStar, active: false },
            { label: 'Insights', icon: IconInsights, active: false },
            { label: 'Video Recordings', icon: IconRectanglePlayStack, active: false },
          ].map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              onClick={active ? undefined : onOpenApp}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg w-full text-left transition-colors ${active ? 'bg-[#f3f4f6]' : 'hover:bg-[#f3f4f6]'}`}
            >
              <Icon size="medium" />
              <span className={`text-[14px] text-[#1a1b1e] leading-none ${active ? 'font-bold' : ''}`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 h-px bg-[#e9eaef] mb-3" />

        {/* Spaces */}
        <div className="px-2 relative" ref={menuRef}>
          <div className="flex items-center justify-between pl-2 pr-1 mb-1">
            <span className="text-[14px] text-[#656b81]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Spaces</span>
            <button
              onClick={() => setSpacesMenuOpen(v => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f3f4f6] transition-colors"
            >
              <IconPlus size="small" />
            </button>
          </div>

          {/* Spaces dropdown */}
          {spacesMenuOpen && (
            <div className="absolute left-full top-0 ml-2 w-[220px] bg-white border border-[#e9eaef] rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.12)] z-50 py-2">
              <div className="px-3 py-2 hover:bg-[#f3f4f6] cursor-pointer rounded-lg mx-1" onClick={() => { setSpacesMenuOpen(false); onOpenApp() }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded bg-[#FFD02F] flex items-center justify-center shrink-0 text-[10px] font-bold">M</div>
                  <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Miro</span>
                </div>
                <div className="flex items-center gap-1 pl-7">
                  <span className="text-[12px] text-[#656b81]">Official blueprints ·</span>
                  <span className="text-[12px] text-[#4262FF]">View all</span>
                </div>
              </div>
              <button onClick={() => { setSpacesMenuOpen(false); onOpenApp() }} className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-[#f3f4f6] text-left mx-0 rounded-lg">
                <div className="w-5 h-5 rounded bg-[#4262FF] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 10 10" width="10" height="10" fill="white"><rect x="0" y="0" width="4" height="4" rx="0.5"/><rect x="6" y="0" width="4" height="4" rx="0.5"/><rect x="0" y="6" width="4" height="4" rx="0.5"/></svg>
                </div>
                <span className="text-[14px] text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Miro EPD Project</span>
              </button>
              <div className="relative">
                <button
                  onMouseEnter={() => setCreateSubmenuOpen(true)}
                  onMouseLeave={() => setCreateSubmenuOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-[#f3f4f6] text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border border-dashed border-[#d1d4db] flex items-center justify-center shrink-0">
                      <IconPlus size="small" />
                    </div>
                    <span className="text-[14px] text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>blank Space</span>
                  </div>
                  <IconChevronRight size="small" />
                </button>
                {createSubmenuOpen && (
                  <div
                    className="absolute left-full top-0 ml-1 w-[180px] bg-white border border-[#e9eaef] rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.1)] z-50 py-2"
                    onMouseEnter={() => setCreateSubmenuOpen(true)}
                    onMouseLeave={() => setCreateSubmenuOpen(false)}
                  >
                    <button onClick={() => { setSpacesMenuOpen(false); setCreateSubmenuOpen(false); onOpenApp() }} className="flex items-center justify-between w-full px-3 py-2 hover:bg-[#f3f4f6] text-left">
                      <div className="flex items-center gap-2">
                        <IconMap size="small" />
                        <span className="text-[14px] text-[#1a1b1e]">Roadmap</span>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-[#4262FF] px-1.5 py-0.5 rounded-full">New</span>
                    </button>
                    <button onClick={() => { setSpacesMenuOpen(false); setCreateSubmenuOpen(false); onOpenApp() }} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#f3f4f6] text-left">
                      <IconLayout size="small" />
                      <span className="text-[14px] text-[#1a1b1e]">Blank</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Your Spaces */}
          <button
            onClick={() => setYourSpacesExpanded(v => !v)}
            className="flex items-center gap-1.5 px-2 py-2 rounded-lg w-full text-left hover:bg-[#f3f4f6] transition-colors"
          >
            {yourSpacesExpanded ? <IconChevronDown size="small" /> : <IconChevronRight size="small" />}
            <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Your Spaces</span>
          </button>

          {yourSpacesExpanded && (
            <div className="flex flex-col gap-0.5 pl-2 mb-1">
              {['Project Newton', 'Sync Communication', 'Project Newton'].map((name, i) => (
                <button key={i} onClick={onOpenApp} className="flex items-center px-3 py-2 rounded-lg w-full text-left hover:bg-[#f3f4f6] transition-colors">
                  <span className="text-[14px] text-[#1c1c1c]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>{name}</span>
                </button>
              ))}
            </div>
          )}

          {/* All Spaces */}
          <button onClick={onOpenApp} className="flex items-center gap-1.5 px-2 py-2 rounded-lg w-full text-left hover:bg-[#f3f4f6] transition-colors">
            <IconChevronRight size="small" />
            <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>All Spaces</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-3 bg-white shrink-0">
          <span className="text-[24px] font-bold italic text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>miro</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f3f4f6]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5A1 1 0 003.5 15h13a1 1 0 00.866-1.5L16 11V8a6 6 0 00-6-6z" stroke="#1a1b1e" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 15a2 2 0 004 0" stroke="#1a1b1e" strokeWidth="1.5"/>
                </svg>
              </button>
              <span className="absolute -top-0.5 -right-0.5 bg-[#4262FF] text-white text-[9px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center leading-none">8</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0CA678] flex items-center justify-center text-white text-[12px] font-bold">TL</div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 pt-4 pb-10">

            {/* Template carousel */}
            <div className="bg-[#f3f4f6] rounded-lg p-6 mb-8">
              <div className="flex gap-4 overflow-x-auto">
                {templates.map((t) => (
                  <button
                    key={t.label}
                    onClick={onOpenApp}
                    className="flex-shrink-0 flex flex-col gap-2"
                    style={{ width: '168px' }}
                  >
                    <div className="w-full h-[92px] rounded-xl border border-[#d1d4db] overflow-hidden bg-white flex items-center justify-center hover:border-[#4262FF] transition-colors">
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
                    <span className="text-[16px] text-[#6c7173] px-1 text-left" style={{ fontFamily: 'Roobert PRO, sans-serif', fontWeight: 500 }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Boards header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Boards in this team</h2>
              <button onClick={onOpenApp} className="flex items-center gap-1.5 bg-[#4262FF] hover:bg-[#2D4FE0] text-white text-[14px] font-medium px-4 py-2 rounded-lg transition-colors">
                <IconPlus size="small" />
                Create new
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4">
              {['Owned by anyone', 'Any classification'].map(label => (
                <button key={label} className="flex items-center gap-1.5 border border-[#d1d4db] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1b1e] hover:bg-[#f3f4f6] bg-white transition-colors">
                  {label}
                  <IconChevronDown size="small" />
                </button>
              ))}
              <span className="text-[13px] text-[#656b81] ml-2">Sort by:</span>
              <button className="flex items-center gap-1.5 border border-[#d1d4db] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1b1e] hover:bg-[#f3f4f6] bg-white transition-colors">
                Last opened
                <IconChevronDown size="small" />
              </button>
            </div>

            {/* Board table */}
            <div className="border border-[#e9eaef] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid gap-4 px-4 py-3 bg-white border-b border-[#e9eaef]" style={{ gridTemplateColumns: '3fr 1fr 1.5fr 1fr 1fr 1.5fr' }}>
                {['', 'Online users', 'Space', 'Last opened', 'Classification', 'Owner'].map((h, i) => (
                  <span key={i} className="text-[12px] font-semibold text-[#656b81] uppercase tracking-wide">{h}</span>
                ))}
              </div>

              {/* Rows */}
              {boards.map((board, idx) => (
                <button
                  key={idx}
                  onClick={onOpenApp}
                  className={`w-full grid gap-4 px-4 py-3 text-left hover:bg-[#f9f9fb] transition-colors ${idx < boards.length - 1 ? 'border-b border-[#f3f4f6]' : ''}`}
                  style={{ gridTemplateColumns: '3fr 1fr 1.5fr 1fr 1fr 1.5fr' }}
                >
                  {/* Name + icon */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg shrink-0 mt-0.5 overflow-hidden" style={{ backgroundColor: board.color + '22', border: `1.5px solid ${board.color}44` }}>
                      <div className="w-full h-full flex items-center justify-center" style={{ color: board.color, fontSize: '16px' }}>
                        {board.icon}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-[#1a1b1e] truncate">{board.name}</div>
                      <div className="text-[12px] text-[#656b81]">Modified by {board.modifier}, {board.date}</div>
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
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
