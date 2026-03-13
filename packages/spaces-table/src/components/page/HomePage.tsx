import {
  IconHouse,
  IconClock,
  IconStar,
  IconInsights,
  IconRectanglePlayStack,
  IconPlus,
  IconChevronRight,
  IconSquaresFour,
  IconQuestionMarkCircle,
  IconCog,
  IconMagnifyingGlass,
  IconChevronDown,
} from '@mirohq/design-system'

interface HomePageProps {
  onOpenApp: () => void
}

const boards = [
  { id: 1, emoji: '💡', name: 'Insights: Onboarding Journey Map', modifier: 'Holly Rankin', date: 'Today', space: 'Miro Insights ...', classification: 'Internal', owner: 'Holly Rankin' },
  { id: 2, emoji: '🔬', name: 'Miro Insights Playtests', modifier: 'Cody Mathisen', date: 'Jan 30', space: 'Miro Insights ...', classification: 'Internal', owner: 'Mor Sela' },
  { id: 3, emoji: '💬', name: 'Insights-Driven Roadmapping Evolution', modifier: 'Lauren Brucato', date: 'Yesterday', space: '', classification: 'Internal', owner: 'Lauren Brucato' },
  { id: 4, emoji: '📊', name: 'Metrics Dashboard', modifier: 'Holly Rankin', date: 'Jan 31', space: 'Roadmap Tracki...', classification: '', owner: 'Holly Rankin' },
  { id: 5, emoji: '🎯', name: 'Product & Design Jams', modifier: 'Holly Rankin', date: 'Jan 29', space: '', classification: '', owner: 'Holly Rankin' },
  { id: 6, emoji: '🗺️', name: 'FY27 Strategic Roadmap', modifier: 'Mike Walk', date: 'Jan 28', space: 'Miro Insights ...', classification: 'Internal', owner: 'Mike Walk' },
  { id: 7, emoji: '📋', name: 'Q1 Planning Session', modifier: 'Holly Rankin', date: 'Jan 27', space: '', classification: '', owner: 'Holly Rankin' },
]

const templates = [
  { label: 'AI Playground', color: '#EEF3FF', icon: '✦' },
  { label: 'Project Workspace', color: '#FFF3EE', icon: '◆' },
  { label: 'UX Research Project', color: '#F0FFF4', icon: '◉' },
  { label: 'Crazy Eights', color: '#FFF8EE', icon: '✸' },
  { label: 'Research Insight Sy...', color: '#F5F0FF', icon: '◈' },
  { label: 'Prototype', color: '#EEFAFF', icon: '⬡' },
]

const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop&crop=face'

export function HomePage({ onOpenApp }: HomePageProps) {
  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden">
      {/* Left sidebar */}
      <div className="flex flex-col w-[160px] shrink-0 bg-[#f9f9fb] border-r border-[#e9eaef] h-full">
        {/* Team header */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <div className="w-8 h-8 rounded-[6px] bg-[#FFD02F] flex items-center justify-center shrink-0">
            <span className="text-[13px] font-bold text-black">M</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-semibold text-[15px] text-[#1a1b1e] truncate leading-none" style={{ fontFamily: 'Open Sans, sans-serif' }}>Miro</span>
            <IconChevronDown size="small" />
          </div>
        </div>

        {/* Search */}
        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 bg-[#f3f4f6] rounded px-2 h-9">
            <IconMagnifyingGlass size="small" />
            <span className="text-[13px] text-[#686685]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Search...</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-2 mt-1">
          {[
            { label: 'Home', icon: IconHouse, active: true },
            { label: 'Recent', icon: IconClock, active: false },
            { label: 'Starred', icon: IconStar, active: false },
            { label: 'Insights', icon: IconInsights, active: false },
            { label: 'Recordings', icon: IconRectanglePlayStack, active: false },
          ].map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              onClick={active ? undefined : onOpenApp}
              className={`flex items-center gap-3 px-2 py-2 rounded w-full text-left transition-colors ${
                active ? 'bg-[#f3f4f6]' : 'hover:bg-[#f1f2f5]'
              }`}
            >
              <Icon size="small" />
              <span
                className={`text-[14px] text-[#222428] leading-none ${active ? 'font-semibold' : ''}`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-2 my-3 h-px bg-[#e9eaef]" />

        {/* Spaces section */}
        <div className="px-2">
          <div className="flex items-center justify-between pl-2 pr-1 mb-1">
            <span className="text-[13px] text-[#656b81]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Spaces</span>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f1f2f5]">
              <IconPlus size="small" />
            </button>
          </div>
          <button
            onClick={onOpenApp}
            className="flex items-center gap-1.5 px-2 py-2 rounded w-full text-left hover:bg-[#f1f2f5] transition-colors"
          >
            <IconChevronRight size="small" />
            <span className="text-[13px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Noto Sans, sans-serif' }}>Your Spaces</span>
          </button>
        </div>

        {/* Bottom icons */}
        <div className="mt-auto border-t border-[#e9eaef] flex items-center gap-1 px-2 py-2">
          <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#f1f2f5]">
            <IconSquaresFour size="small" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#f1f2f5]">
            <IconQuestionMarkCircle size="small" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#f1f2f5]">
            <IconCog size="small" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e9eaef] shrink-0">
          <span className="text-[20px] font-bold text-[#1a1b1e] italic" style={{ fontFamily: 'Open Sans, sans-serif' }}>miro</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#f1f2f5]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5A1 1 0 003.5 15h13a1 1 0 00.866-1.5L16 11V8a6 6 0 00-6-6z" stroke="#1a1b1e" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 15a2 2 0 004 0" stroke="#1a1b1e" strokeWidth="1.5"/>
                </svg>
              </button>
              <span className="absolute -top-0.5 -right-0.5 bg-[#4262FF] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">8+</span>
            </div>
            <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[900px] mx-auto px-8 pt-12 pb-8">
            {/* Hero */}
            <h1 className="text-[28px] font-semibold text-[#1a1b1e] text-center mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Ready to kick things off?
            </h1>

            {/* Search bar */}
            <div className="relative mb-2">
              <div className="flex items-center bg-white border border-[#d1d4db] rounded-lg px-4 h-12 shadow-sm">
                <IconMagnifyingGlass size="medium" />
                <input
                  className="flex-1 ml-3 text-[14px] text-[#1a1b1e] outline-none placeholder:text-[#686685]"
                  placeholder="Search or ask anything"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
                <span className="text-[12px] text-[#656b81] font-mono">⌘+shift+E</span>
              </div>
            </div>
            <div className="flex justify-end mb-8">
              <span className="text-[11px] text-[#656b81] bg-[#f3f4f6] px-2 py-0.5 rounded-full">Beta</span>
            </div>

            {/* Templates */}
            <div className="mb-6">
              <div className="flex items-center gap-1 mb-3">
                <span className="text-[14px] font-semibold text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Templates for Design</span>
                <IconChevronDown size="small" />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Blank template */}
                <button
                  onClick={onOpenApp}
                  className="flex-shrink-0 w-[140px] h-[96px] border border-dashed border-[#d1d4db] rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-[#f9f9fb] transition-colors"
                >
                  <span className="text-[24px] text-[#656b81]">+</span>
                  <span className="text-[12px] text-[#656b81]">Blank</span>
                </button>
                {templates.map((t) => (
                  <button
                    key={t.label}
                    onClick={onOpenApp}
                    className="flex-shrink-0 w-[140px] h-[96px] rounded-lg overflow-hidden border border-[#e9eaef] hover:border-[#4262FF] transition-colors"
                    style={{ backgroundColor: t.color }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <span className="text-[22px]">{t.icon}</span>
                      <span className="text-[11px] text-[#1a1b1e] text-center font-medium leading-tight" style={{ fontFamily: 'Open Sans, sans-serif' }}>{t.label}</span>
                    </div>
                  </button>
                ))}
                <button className="flex-shrink-0 w-[140px] h-[96px] border border-[#e9eaef] rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-[#f9f9fb] transition-colors">
                  <span className="text-[14px] text-[#4262FF] font-medium">From Miroverse →</span>
                </button>
              </div>
            </div>

            {/* Board list */}
            <div>
              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-[13px] text-[#656b81]">Filter by</span>
                <select className="text-[13px] text-[#1a1b1e] border border-[#e9eaef] rounded px-2 py-1 bg-white appearance-none pr-6 cursor-pointer">
                  <option>All boards</option>
                </select>
                <select className="text-[13px] text-[#1a1b1e] border border-[#e9eaef] rounded px-2 py-1 bg-white appearance-none pr-6 cursor-pointer">
                  <option>Any classification</option>
                </select>
                <span className="text-[13px] text-[#656b81] ml-2">Sort by</span>
                <select className="text-[13px] text-[#1a1b1e] border border-[#e9eaef] rounded px-2 py-1 bg-white appearance-none pr-6 cursor-pointer">
                  <option>Last opened</option>
                </select>
                <div className="ml-auto flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded bg-[#f3f4f6]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill="#1a1b1e"/><rect x="8" y="1" width="5" height="5" rx="1" fill="#1a1b1e"/><rect x="1" y="8" width="5" height="5" rx="1" fill="#1a1b1e"/><rect x="8" y="8" width="5" height="5" rx="1" fill="#1a1b1e"/></svg>
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f1f2f5]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="2" rx="1" fill="#656b81"/><rect x="1" y="6" width="12" height="2" rx="1" fill="#656b81"/><rect x="1" y="10" width="12" height="2" rx="1" fill="#656b81"/></svg>
                  </button>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-3 py-2 border-b border-[#e9eaef]">
                {['Name', 'Online users', 'Space', 'Classification', 'Last opened', 'Owner'].map(h => (
                  <span key={h} className="text-[12px] font-semibold text-[#656b81] uppercase tracking-wide" style={{ fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
                ))}
              </div>

              {/* Board rows */}
              {boards.map((board) => (
                <button
                  key={board.id}
                  onClick={onOpenApp}
                  className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-3 py-3 border-b border-[#f3f4f6] hover:bg-[#f9f9fb] transition-colors text-left"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-[18px] shrink-0 mt-0.5">{board.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[#1a1b1e] truncate" style={{ fontFamily: 'Open Sans, sans-serif' }}>{board.name}</div>
                      <div className="text-[11px] text-[#656b81]">Modified by {board.modifier}, {board.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img src={avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                  </div>
                  <div className="flex items-center">
                    {board.space && (
                      <span className="text-[12px] text-[#656b81] truncate">{board.space}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {board.classification && (
                      <span className="text-[11px] font-medium text-[#B54708] bg-[#FEF3C7] border border-[#FCD34D] px-2 py-0.5 rounded">{board.classification}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-[13px] text-[#1a1b1e]">{board.date}</span>
                  </div>
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
