import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  IconCross,
  IconSlidersX,
  IconStickyNote,
  IconArrowUp,
  IconChevronRight,
  IconChevronLeft,
  Checkbox,
} from '@mirohq/design-system'

interface InsightsChatPanelProps {
  onClose: () => void
}

interface Message {
  role: 'user' | 'ai'
  text: string
}

const FILTER_OPTIONS = ['Company', 'Source', 'Type', 'User role']

const FILTER_SUB_OPTIONS: Record<string, string[]> = {
  'Company':   ['Spotify', 'Stripe', 'Linear', 'Atlassian', 'Notion', 'Shopify', 'Dropbox', 'Google', 'Apple'],
  'Source':    ['Survey', 'Interview', 'Support Ticket', 'NPS', 'Forum'],
  'Type':      ['Call', 'Ticket', 'Message', 'Other'],
  'User role': ['Admin', 'End User', 'Manager', 'Developer', 'Designer'],
}

const AI_RESPONSES: string[] = [
  "Based on your backlog, the top 3 items by estimated revenue impact are the AI portfolio advisor ($425K), real-time transaction categorisation ($917K), and tax-loss harvesting ($921K). These also have the highest customer mention counts.",
  "I can see 9,873 unique customers have requested improvements to transaction categorisation. Companies like Spotify, Stripe, and Linear are most affected. Would you like me to pull the latest feedback signals for this item?",
  "Looking at your 'Now' priority items, the multi-currency wallet has the broadest customer base (8,532 accounts). Atlassian and Notion have flagged FX conversion delays as a top renewal blocker.",
]

function buildFilteredResponse(filterChecked: Set<string>): string | null {
  const companies = FILTER_SUB_OPTIONS['Company'].filter(f => filterChecked.has(f))
  const sources   = FILTER_SUB_OPTIONS['Source'].filter(f => filterChecked.has(f))
  const roles     = FILTER_SUB_OPTIONS['User role'].filter(f => filterChecked.has(f))
  const types     = FILTER_SUB_OPTIONS['Type'].filter(f => filterChecked.has(f))

  if (companies.length > 0 && sources.length > 0) {
    return `Scoped to ${companies.join(', ')} via ${sources.join(' & ')}: I found ${companies.length * 2800 + 900} signals. The top theme is integration reliability (${companies.length * 700 + 300} mentions). ${companies[0]} has flagged this as a Q3 renewal risk with an estimated impact of $${(companies.length * 48 + 32)}K.`
  }
  if (companies.length > 0) {
    const second = companies[1] ?? companies[0]
    return `Scoped to ${companies.join(', ')}: ${companies.length * 2400 + 800} relevant signals found. Leading themes are workflow automation gaps (${companies.length * 580 + 210} mentions) and API rate limits. Both ${companies[0]} and ${second} have escalated these to your CSM in the last 30 days.`
  }
  if (sources.length > 0) {
    return `Looking at ${sources.join(' & ')} data: the highest-signal theme is onboarding complexity (1,847 mentions), followed by export limitations. Confidence is high — over 80% of sampled items are clearly categorised across your backlog.`
  }
  if (roles.length > 0) {
    return `Filtering to ${roles.join(' & ')} users: this cohort has ${roles.length * 1200 + 400} unique signals. ${roles.includes('Admin') ? 'Admins primarily flag permission management and audit log gaps. ' : ''}${roles.includes('End User') ? 'End users cite performance issues during peak hours. ' : ''}${roles.includes('Developer') ? 'Developers report API documentation gaps and webhook reliability issues.' : ''}`
  }
  if (types.length > 0) {
    return `Filtered to ${types.join(' & ')} signal types: ${types.length * 1600 + 500} items matched. The top 3 recurring themes are onboarding gaps, notification overload, and missing bulk actions — accounting for 67% of all matched signals.`
  }
  return null
}

export function InsightsChatPanel({ onClose }: InsightsChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const [filterView, setFilterView] = useState<string | null>(null)
  const [filterSearch, setFilterSearch] = useState('')
  const [filterChecked, setFilterChecked] = useState<Set<string>>(new Set())
  const responseIndex = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sliderBtnRef = useRef<HTMLButtonElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (!filterOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (sliderBtnRef.current?.contains(target)) return
      if (filterDropdownRef.current?.contains(target)) return
      setFilterOpen(false)
      setFilterView(null)
      setFilterSearch('')
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [filterOpen])

  const openFilter = () => {
    if (filterOpen) { setFilterOpen(false); setFilterView(null); setFilterSearch(''); return }
    const rect = sliderBtnRef.current?.getBoundingClientRect()
    if (rect) setDropdownPos({ top: rect.top - 8, left: rect.left })
    setFilterOpen(true)
  }

  const removeFilter = (opt: string) => {
    setFilterChecked(prev => { const n = new Set(prev); n.delete(opt); return n })
  }

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const filtered = buildFilteredResponse(filterChecked)
      const response = filtered ?? AI_RESPONSES[responseIndex.current % AI_RESPONSES.length]
      if (!filtered) responseIndex.current++
      setMessages(m => [...m, { role: 'ai', text: response }])
    }, 1000)
  }

  const activeFilters = [...filterChecked]
  const hasFilters = activeFilters.length > 0

  return (
    <div className="flex flex-col h-full bg-white rounded-xl" style={{ fontFamily: 'Open Sans, sans-serif' }}>

      {/* Header */}
      <div className="flex items-center gap-2 h-14 px-4 shrink-0">
        <span
          className="text-[16px] text-[#222428] leading-[1.4]"
          style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}
        >
          Miro Insights
        </span>
        <span
          className="inline-flex items-center rounded-[4px] px-[6px] h-[20px] text-[11px] font-semibold text-[#3C3F4A] shrink-0"
          style={{ backgroundColor: '#E9EAEF', letterSpacing: '0.02em' }}
        >
          Beta
        </span>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0"
          aria-label="Close"
        >
          <IconCross css={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 pb-2 my-auto">
          <img src="/miro-insights-icon.svg" alt="Miro Insights" style={{ width: 24, height: 20 }} />
          <div className="flex flex-col gap-3">
            <p
              className="text-[#222428] leading-[1.4]"
              style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 20, fontFeatureSettings: "'ss01' 1" }}
            >
              Hey Richard
            </p>
            <p className="text-[14px] text-[#222428] leading-[1.5]">
              Easily surface customer feedback across all of your{' '}
              <span style={{ textDecoration: 'underline' }}>connected tools</span>{' '}
              in your organization with Miro Insights.
            </p>
            <p className="text-[14px] text-[#222428] leading-[1.5]">
              The AI uses your team's ownership and goals to find the most relevant signals in customer feedback and surface high-confidence insights.
            </p>
            <p className="text-[14px] text-[#222428] leading-[1.5]">
              Can you provide context on ownership & goals?
            </p>
          </div>
        </div>

        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div
                className="max-w-[85%] rounded-lg px-4 py-3 text-[14px] leading-[1.57] text-[#3C3F4A] whitespace-pre-wrap"
                style={{ backgroundColor: '#F1F2F5', fontFamily: 'Open Sans, sans-serif' }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <p className="text-[14px] leading-[1.57] text-[#222428] whitespace-pre-wrap" style={{ fontFamily: 'Open Sans, sans-serif' }}>{msg.text}</p>
            </div>
          )
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Thinking indicator */}
      {typing && (
        <div className="shrink-0 flex items-center gap-2 px-4 text-[#656B81]" style={{ paddingBottom: 16 }}>
          <img src="/miro-insights-icon.svg" alt="" style={{ width: 20, height: 17 }} />
          <span className="text-[13px]">Thinking…</span>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-3 pb-4" style={{ paddingTop: typing ? 0 : 8 }}>
        <div
          className="flex flex-col rounded-xl bg-white"
          style={{ border: '1px solid #E0E2E8', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}
        >
          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-1 px-3 pt-2">
              {activeFilters.map(f => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 pl-2 pr-1 h-[22px] rounded-full text-[12px] font-medium"
                  style={{ backgroundColor: '#EEF1FF', color: '#4262FF' }}
                >
                  {f}
                  <button
                    onClick={() => removeFilter(f)}
                    className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#C6D0FF] transition-colors"
                  >
                    <IconCross css={{ width: 8, height: 8 }} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything..."
            className="flex-1 px-3 pt-3 pb-2 text-[13px] text-[#222428] outline-none bg-transparent placeholder:text-[#7D8297] resize-none"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              <button
                ref={sliderBtnRef}
                onClick={openFilter}
                className="relative w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: filterOpen || hasFilters ? '#4262FF' : '#656B81', backgroundColor: filterOpen || hasFilters ? '#F2F4FC' : 'transparent' }}
              >
                <IconSlidersX css={{ width: 16, height: 16 }} />
                {hasFilters && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full text-white px-[3px]"
                    style={{ backgroundColor: '#4262FF', fontSize: 9, lineHeight: 1 }}
                  >
                    {filterChecked.size}
                  </span>
                )}
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconStickyNote css={{ width: 16, height: 16 }} />
              </button>
            </div>
            <button
              onClick={send}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-white"
              style={{ backgroundColor: input.trim() ? '#4262FF' : '#AEB2C0' }}
            >
              <IconArrowUp css={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter dropdown */}
      {filterOpen && createPortal(
        <div
          ref={filterDropdownRef}
          className="fixed z-[9999] bg-white rounded-[8px] flex flex-col overflow-hidden"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: 200,
            transform: 'translateY(-100%)',
            border: '0.5px solid #E9EAEF',
            boxShadow: '0px 0px 12px 0px rgba(34,36,40,0.04), 0px 2px 8px 0px rgba(34,36,40,0.12)',
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          {filterView === null ? (
            <>
              <div className="flex items-center justify-between px-3 py-[10px]">
                <p className="text-[14px] text-[#656B81] leading-[1.4]">Select filters</p>
                {hasFilters && (
                  <button
                    onClick={() => setFilterChecked(new Set())}
                    className="text-[12px] text-[#4262FF] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mx-3 border-t border-[#E9EAEF]" />
              {FILTER_OPTIONS.map(label => {
                const count = FILTER_SUB_OPTIONS[label].filter(o => filterChecked.has(o)).length
                return (
                  <button
                    key={label}
                    className="flex items-center justify-between px-3 h-10 hover:bg-[#F1F2F5] transition-colors w-full"
                    onClick={() => { setFilterView(label); setFilterSearch('') }}
                  >
                    <span className="text-[14px] leading-[1.4] text-[#222428]">{label}</span>
                    <div className="flex items-center gap-1.5">
                      {count > 0 && (
                        <span
                          className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white px-1"
                          style={{ backgroundColor: '#4262FF', fontSize: 11 }}
                        >
                          {count}
                        </span>
                      )}
                      <IconChevronRight css={{ width: 16, height: 16, color: '#656B81' }} />
                    </div>
                  </button>
                )
              })}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-2 h-10 border-b border-[#E9EAEF] shrink-0">
                <button
                  onClick={() => { setFilterView(null); setFilterSearch('') }}
                  className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#F1F2F5] shrink-0"
                >
                  <IconChevronLeft css={{ width: 14, height: 14, color: '#656B81' }} />
                </button>
                <span className="text-[14px] text-[#222428]">{filterView}</span>
              </div>
              <div className="px-3 py-2 shrink-0">
                <input
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full text-[13px] text-[#222428] placeholder:text-[#AEB2C0] outline-none border border-[#E9EAEF] rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 200 }}>
                {(FILTER_SUB_OPTIONS[filterView] ?? [])
                  .filter(opt => opt.toLowerCase().includes(filterSearch.toLowerCase()))
                  .map(opt => (
                    <div
                      key={opt}
                      className="flex items-center gap-2 px-3 h-10 hover:bg-[#F1F2F5] transition-colors w-full text-left shrink-0 cursor-pointer select-none"
                      onClick={() => setFilterChecked(prev => {
                        const next = new Set(prev)
                        next.has(opt) ? next.delete(opt) : next.add(opt)
                        return next
                      })}
                    >
                      <div className="pointer-events-none shrink-0">
                        <Checkbox
                          checked={filterChecked.has(opt)}
                          variant="solid-prominent"
                          size="small"
                        />
                      </div>
                      <span className="text-[14px] text-[#222428] truncate">{opt}</span>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
