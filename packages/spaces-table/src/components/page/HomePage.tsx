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
} from '@mirohq/design-system'

interface HomePageProps {
  onOpenApp: () => void
}

const boards = [
  { id: 1, color: '#4262FF', initials: 'SP', name: 'Space Overview - Annotations...', modifier: 'Alberta', date: 'Today', space: '', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 3 },
  { id: 2, color: '#0CA678', initials: 'DR', name: 'Design Reviews - FY25 Q4', modifier: 'Alberta', date: 'Today', space: 'Product Design', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { id: 3, color: '#F76707', initials: 'UT', name: 'User Testing Prep', modifier: 'Alberta', date: 'Today', space: "Alberta's Space", classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 1 },
  { id: 4, color: '#7048E8', initials: 'SO', name: 'Space Overview - Reviews', modifier: 'Alberta', date: 'Today', space: 'Spaces', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { id: 5, color: '#E03131', initials: 'DT', name: 'Design Review Team Picker', modifier: 'Alberta', date: 'Today', space: 'Spaces', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
  { id: 6, color: '#E03131', initials: 'DT', name: 'Design Review Team Picker', modifier: 'Alberta', date: 'Today', space: 'Spaces', classification: 'INTERNAL', owner: 'Alberta Mcdo...', onlineCount: 0 },
]

const templates = [
  { label: 'Blank Board', isBlank: true },
  { label: 'Flowchart', bg: '#FFF3E0', preview: 'flowchart' },
  { label: 'Mind Map', bg: '#F3E8FF', preview: 'mindmap' },
  { label: 'Kanban Framework', bg: '#E8F5E9', preview: 'kanban' },
  { label: 'Quick Retrospective', bg: '#E3F2FD', preview: 'retro' },
  { label: 'Intelligent Templates', bg: '#FFF8E1', preview: 'intelligent' },
]

const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop&crop=face'

function TemplatePreview({ type, bg }: { type: string; bg: string }) {
  const shapes: Record<string, JSX.Element> = {
    flowchart: (
      <svg viewBox="0 0 80 50" className="w-full h-full">
        <rect x="28" y="4" width="24" height="12" rx="2" fill="#FFB84D" stroke="#E8960A" strokeWidth="1"/>
        <line x1="40" y1="16" x2="40" y2="22" stroke="#888" strokeWidth="1"/>
        <polygon points="40,22 34,30 46,30" fill="none" stroke="#888" strokeWidth="1"/>
        <rect x="26" y="32" width="28" height="12" rx="2" fill="#4BB8A9" stroke="#2A9D8F" strokeWidth="1"/>
      </svg>
    ),
    mindmap: (
      <svg viewBox="0 0 80 50" className="w-full h-full">
        <circle cx="40" cy="25" r="8" fill="#9B59B6" stroke="#8E44AD" strokeWidth="1"/>
        <circle cx="15" cy="15" r="5" fill="#E8A0BF" stroke="#D884A8" strokeWidth="1"/>
        <circle cx="65" cy="12" r="5" fill="#A8D8EA" stroke="#89C4D4" strokeWidth="1"/>
        <circle cx="68" cy="35" r="5" fill="#A8E6CF" stroke="#82CDB5" strokeWidth="1"/>
        <circle cx="15" cy="38" r="5" fill="#FFD3A5" stroke="#FFBB6B" strokeWidth="1"/>
        <line x1="32" y1="20" x2="20" y2="17" stroke="#aaa" strokeWidth="1"/>
        <line x1="48" y1="20" x2="60" y2="15" stroke="#aaa" strokeWidth="1"/>
        <line x1="48" y1="30" x2="63" y2="33" stroke="#aaa" strokeWidth="1"/>
        <line x1="32" y1="30" x2="20" y2="35" stroke="#aaa" strokeWidth="1"/>
      </svg>
    ),
    kanban: (
      <svg viewBox="0 0 80 50" className="w-full h-full">
        <rect x="4" y="8" width="20" height="34" rx="2" fill="#E8F5E9" stroke="#C8E6C9" strokeWidth="1"/>
        <rect x="30" y="8" width="20" height="34" rx="2" fill="#E3F2FD" stroke="#BBDEFB" strokeWidth="1"/>
        <rect x="56" y="8" width="20" height="34" rx="2" fill="#FFF3E0" stroke="#FFE0B2" strokeWidth="1"/>
        <rect x="7" y="12" width="14" height="6" rx="1" fill="#81C784"/>
        <rect x="7" y="20" width="14" height="6" rx="1" fill="#81C784"/>
        <rect x="33" y="12" width="14" height="6" rx="1" fill="#64B5F6"/>
        <rect x="59" y="12" width="14" height="6" rx="1" fill="#FFB74D"/>
      </svg>
    ),
    retro: (
      <svg viewBox="0 0 80 50" className="w-full h-full">
        <rect x="4" y="6" width="34" height="17" rx="2" fill="#BBDEFB" stroke="#90CAF9" strokeWidth="1"/>
        <rect x="42" y="6" width="34" height="17" rx="2" fill="#C8E6C9" stroke="#A5D6A7" strokeWidth="1"/>
        <rect x="4" y="27" width="34" height="17" rx="2" fill="#FFE0B2" stroke="#FFCC80" strokeWidth="1"/>
        <rect x="42" y="27" width="34" height="17" rx="2" fill="#F8BBD0" stroke="#F48FB1" strokeWidth="1"/>
      </svg>
    ),
    intelligent: (
      <svg viewBox="0 0 80 50" className="w-full h-full">
        <rect x="8" y="8" width="26" height="14" rx="2" fill="#FFF59D" stroke="#FFF176" strokeWidth="1"/>
        <rect x="46" y="8" width="26" height="14" rx="2" fill="#B39DDB" stroke="#9575CD" strokeWidth="1"/>
        <rect x="8" y="28" width="26" height="14" rx="2" fill="#80CBC4" stroke="#4DB6AC" strokeWidth="1"/>
        <rect x="46" y="28" width="26" height="14" rx="2" fill="#EF9A9A" stroke="#E57373" strokeWidth="1"/>
        <circle cx="40" cy="25" r="3" fill="#555"/>
      </svg>
    ),
  }
  return (
    <div className="w-full h-full p-2 flex items-center justify-center" style={{ background: bg }}>
      {shapes[type] || null}
    </div>
  )
}

export function HomePage({ onOpenApp }: HomePageProps) {
  const [spacesMenuOpen, setSpacesMenuOpen] = useState(false)
  const [yourSpacesExpanded, setYourSpacesExpanded] = useState(true)
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
      <div className="flex flex-col w-[236px] shrink-0 bg-white border-r border-[#d1d4db] h-full overflow-y-auto">
        {/* Team header */}
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <div className="w-8 h-8 rounded-[6px] bg-black flex items-center justify-center shrink-0 overflow-hidden">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5z" fill="white"/>
              <path d="M17 14l-1.5 5H20z" fill="#FFD02F"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-[15px] text-[#1a1b1e] leading-tight truncate" style={{ fontFamily: 'Roobert PRO, sans-serif' }}>Mirage</span>
            <span className="text-[12px] text-[#656b81] leading-tight">Miro</span>
          </div>
          <IconChevronDown size="small" />
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 border border-[#d1d4db] rounded-lg px-3 h-8 bg-white">
            <IconMagnifyingGlass size="small" />
            <span className="text-[13px] text-[#656b81]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Search by title or topic</span>
          </div>
        </div>

        {/* Nav items */}
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
              className={`flex items-center gap-3 px-2 py-2 rounded-lg w-full text-left transition-colors ${
                active ? 'bg-[#f3f4f6]' : 'hover:bg-[#f3f4f6]'
              }`}
            >
              <Icon size="medium" />
              <span
                className={`text-[14px] text-[#1a1b1e] leading-none ${active ? 'font-bold' : ''}`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 h-px bg-[#e9eaef] mb-3" />

        {/* Spaces */}
        <div className="px-2" ref={menuRef}>
          <div className="flex items-center justify-between pl-2 pr-1 mb-1">
            <span className="text-[14px] text-[#656b81]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Spaces</span>
            <div className="relative">
              <button
                onClick={() => setSpacesMenuOpen(v => !v)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f3f4f6]"
              >
                <IconPlus size="small" />
              </button>

              {/* Spaces dropdown */}
              {spacesMenuOpen && (
                <div className="absolute left-full top-0 ml-2 w-[220px] bg-white border border-[#e9eaef] rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.12)] z-50 py-2">
                  {/* Miro item */}
                  <div className="px-3 py-2 hover:bg-[#f3f4f6] cursor-pointer" onClick={() => { setSpacesMenuOpen(false); onOpenApp() }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-5 h-5 rounded bg-[#FFD02F] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold">M</span>
                      </div>
                      <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Miro</span>
                    </div>
                    <div className="flex items-center gap-1 pl-7">
                      <span className="text-[12px] text-[#656b81]">Official blueprints ·</span>
                      <span className="text-[12px] text-[#4262FF] hover:underline">View all</span>
                    </div>
                  </div>
                  {/* Miro EPD Project */}
                  <button onClick={() => { setSpacesMenuOpen(false); onOpenApp() }} className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-[#f3f4f6] text-left">
                    <div className="w-5 h-5 rounded bg-[#4262FF] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 14 14" width="10" height="10" fill="white"><rect x="1" y="1" width="5" height="5" rx="0.5"/><rect x="8" y="1" width="5" height="5" rx="0.5"/><rect x="1" y="8" width="5" height="5" rx="0.5"/></svg>
                    </div>
                    <span className="text-[14px] text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Miro EPD Project</span>
                  </button>
                  {/* blank Space */}
                  <button onClick={() => { setSpacesMenuOpen(false); onOpenApp() }} className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-[#f3f4f6] text-left">
                    <div className="w-5 h-5 rounded border border-dashed border-[#d1d4db] flex items-center justify-center shrink-0">
                      <IconPlus size="small" />
                    </div>
                    <span className="text-[14px] text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>blank Space</span>
                  </button>
                </div>
              )}
            </div>
          </div>

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
                <button
                  key={i}
                  onClick={onOpenApp}
                  className="flex items-center px-3 py-2 rounded-lg w-full text-left hover:bg-[#f3f4f6] transition-colors"
                >
                  <span className="text-[14px] text-[#1c1c1c]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>{name}</span>
                </button>
              ))}
            </div>
          )}

          {/* All Spaces */}
          <button
            onClick={onOpenApp}
            className="flex items-center gap-1.5 px-2 py-2 rounded-lg w-full text-left hover:bg-[#f3f4f6] transition-colors"
          >
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
              <span className="absolute -top-0.5 -right-0.5 bg-[#4262FF] text-white text-[9px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">8</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0CA678] flex items-center justify-center text-white text-[12px] font-bold">TL</div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 pt-6 pb-10">

            {/* Templates row */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
              {/* Blank Board */}
              <button
                onClick={onOpenApp}
                className="flex-shrink-0 w-[140px] h-[100px] border-2 border-dashed border-[#d1d4db] rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#4262FF] hover:bg-[#f5f7ff] transition-colors"
              >
                <span className="text-[28px] text-[#656b81] leading-none">+</span>
                <span className="text-[12px] text-[#656b81] font-medium">Blank Board</span>
              </button>

              {templates.slice(1).map((t) => (
                <button
                  key={t.label}
                  onClick={onOpenApp}
                  className="flex-shrink-0 w-[140px] h-[100px] rounded-xl overflow-hidden border border-[#e9eaef] hover:border-[#4262FF] transition-all hover:shadow-md"
                >
                  <div className="w-full h-[68px]">
                    <TemplatePreview type={t.preview!} bg={t.bg!} />
                  </div>
                  <div className="bg-white px-2 py-1 text-left border-t border-[#e9eaef]">
                    <span className="text-[11px] text-[#1a1b1e] font-medium leading-tight block truncate">{t.label}</span>
                  </div>
                </button>
              ))}

              <button
                onClick={onOpenApp}
                className="flex-shrink-0 w-[140px] h-[100px] rounded-xl border border-[#e9eaef] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
              >
                <span className="text-[13px] text-[#4262FF] font-medium">Explore →</span>
              </button>
            </div>

            {/* Boards header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Boards in this team</h2>
              <button
                onClick={onOpenApp}
                className="flex items-center gap-1.5 bg-[#4262FF] hover:bg-[#2D4FE0] text-white text-[14px] font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <IconPlus size="small" />
                Create new
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {['Owned by anyone', 'Any classification'].map(label => (
                <button key={label} className="flex items-center gap-1.5 border border-[#d1d4db] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1b1e] hover:bg-[#f3f4f6] transition-colors">
                  {label}
                  <IconChevronDown size="small" />
                </button>
              ))}
              <span className="text-[13px] text-[#656b81] ml-2">Sort by:</span>
              <button className="flex items-center gap-1.5 border border-[#d1d4db] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1b1e] hover:bg-[#f3f4f6] transition-colors">
                Last opened
                <IconChevronDown size="small" />
              </button>
            </div>

            {/* Board table */}
            <div className="border border-[#e9eaef] rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[3fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-4 py-3 bg-white border-b border-[#e9eaef]">
                {['', 'Online users', 'Space', 'Last opened', 'Classification', 'Owner'].map((h, i) => (
                  <span key={i} className="text-[12px] font-semibold text-[#656b81] uppercase tracking-wide">{h}</span>
                ))}
              </div>

              {/* Rows */}
              {boards.map((board, idx) => (
                <button
                  key={board.id}
                  onClick={onOpenApp}
                  className={`w-full grid grid-cols-[3fr_1fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-4 py-3 text-left hover:bg-[#f9f9fb] transition-colors ${
                    idx < boards.length - 1 ? 'border-b border-[#f3f4f6]' : ''
                  }`}
                >
                  {/* Name */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold mt-0.5"
                      style={{ backgroundColor: board.color }}
                    >
                      {board.initials}
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
                        <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-white" />
                        {board.onlineCount > 1 && (
                          <span className="text-[12px] text-[#656b81]">+{board.onlineCount - 1}</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Space */}
                  <div className="flex items-center">
                    {board.space && (
                      <span className="text-[13px] text-[#656b81] truncate">{board.space}</span>
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
