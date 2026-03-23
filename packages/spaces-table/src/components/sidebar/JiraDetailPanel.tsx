import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { JiraForm, SourceLogoChip } from './RowDetailPanel'
import {
  IconSocialJira,
  IconDotsThreeVertical,
  IconCross,
  IconHeart,
  IconFlag,

  IconStarFilled,
  IconChevronDown,
  IconSlidersY,
  IconBoard,
  IconSquaresTwoOverlap,
  IconDocFormat,
  IconInformationMarkCircle,
  Chip,
} from '@mirohq/design-system'
import type { SpaceRow } from '@spaces/shared'
import { CompanyLogo } from '../CompanyLogo'

function IconUserTickDown({ css: _css, ...props }: { css?: unknown; width?: number; height?: number }) {
  const size = ((props as { width?: number }).width ?? 24) + 4
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: 0 }}>
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 19c0-3.314 3.134-6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 15l4 4M19 15l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

interface JiraDetailPanelProps {
  row: SpaceRow
  onClose: () => void
}

const JIRA_KEY_MAP: Record<string, string> = {
  r2: 'PT-309', r3: 'PT-411', r7: 'PT-165', r8: 'PT-512',
}

const PRIORITY_CHIP: Record<string, { bg: string; color: string }> = {
  triage: { bg: '#D1F09F', color: '#600000' },
  now:    { bg: '#b5ecff', color: '#003d54' },
  next:   { bg: '#ffc795', color: '#5c3200' },
  later:  { bg: '#d4bbff', color: '#2d0066' },
  icebox: { bg: '#dad8d8', color: '#222428' },
}

const PRIORITY_LABELS: Record<string, string> = {
  now: 'Now', next: 'Next', later: 'Later', triage: 'Triage', icebox: 'Icebox',
}

const INSIGHT_SUMMARIES: Record<string, string> = {
  r2: 'With 118 mentions from 9,873 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $917K in retained and expanded revenue.',
  r3: 'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 2,957 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  r7: 'Tax-loss harvesting is a high-stakes feature with only 16 mentions but an outsized $921K revenue impact across 9,283 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios.',
  r8: "Open Banking integration appears in 16 mentions from 4,759 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $415K in expansion opportunities.",
}

const CARD_STYLES = [
  { borderColor: '#D1F09F', Icon: IconHeart,                  stars: 3, date: 'Aug 02', source: 'App Store' },
  { borderColor: '#d4bbff', Icon: IconFlag,                              date: 'Jul 18', source: 'Gong' },
  { borderColor: '#ffd4b2', Icon: IconUserTickDown,            date: 'Jun 30', source: 'SurveyMonkey' },
  { borderColor: '#D1F09F', Icon: IconHeart,                  stars: 5, date: 'Jun 12', source: 'App Store' },
  { borderColor: '#d4bbff', Icon: IconFlag,                              date: 'May 28', source: 'Play Store' },
]

const CARD_WEIGHTS = [0.28, 0.24, 0.20, 0.16, 0.12]

function generateFeedbackCards(row: SpaceRow) {
  const t = row.title
  const d = row.description ?? t
  const texts = [
    `Our team has been requesting ${t.toLowerCase()} for several quarters. ${d} This would directly reduce the manual overhead our finance team deals with every sprint.`,
    `"${t}" keeps coming up in our quarterly planning sessions. Without it, we're stuck maintaining brittle workarounds. Fixing this would unblock at least three downstream initiatives.`,
    `We've escalated this internally multiple times. ${d} The lack of this capability is one of the top reasons our power users are evaluating alternatives.`,
    `Positive early signal from our pilot group on ${t.toLowerCase()}. Users describe it as intuitive and well-scoped. A few noted edge cases around data freshness that would be worth addressing before GA.`,
    `This came up in our last exec review as a gap we need to close. ${d} Shipping this would meaningfully strengthen our renewal conversations this quarter.`,
  ]
  const authors = [
    'Sarah Kim, VP of Product', 'Marcus Osei, Head of Growth',
    'Priya Nair, Chief Product Officer', 'Tom Hauser, Director of Product',
    'Lena Vogel, Product Lead',
  ]
  const titles = [
    `Quarterly Demand for ${t}`,
    `${t} Blocking Downstream Planning`,
    `Churn Risk: Power Users Evaluating Alternatives`,
    `Positive Pilot Signal, Minor Data Freshness Gaps`,
    `Exec-Level Gap Affecting Renewal Pipeline`,
  ]
  return CARD_STYLES.map((style, i) => ({
    ...style,
    title: titles[i],
    text: texts[i],
    author: authors[i],
    companies: row.companies.slice(0, 1),
  }))
}

const TABS = ['Details', 'Jira', 'Insights', 'Comments']

export function JiraDetailPanel({ row, onClose }: JiraDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Details')
  const [dismissedCards, setDismissedCards] = useState<Set<number>>(new Set())
  const [companiesExpanded, setCompaniesExpanded] = useState(false)

  const [layoutOpen, setLayoutOpen] = useState(false)
  const [layoutPos, setLayoutPos] = useState<{ top: number; right: number } | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<'Center' | 'Right' | 'Fullscreen'>('Center')
  const layoutButtonRef = useRef<HTMLButtonElement>(null)
  const layoutMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!layoutOpen) return
    const handler = (e: MouseEvent) => {
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(e.target as Node)) setLayoutOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [layoutOpen])

  const jiraKey = JIRA_KEY_MAP[row.id] ?? 'PT-100'
  const chip = PRIORITY_CHIP[row.priority] ?? PRIORITY_CHIP.icebox
  const priorityLabel = PRIORITY_LABELS[row.priority] ?? row.priority

  const remainingFraction = CARD_WEIGHTS.reduce((sum, w, i) => dismissedCards.has(i) ? sum : sum + w, 0)
  const adjMentions = Math.round(row.mentions * remainingFraction)
  const adjCustomers = Math.round(row.customers * remainingFraction)
  const adjRevenue = Math.round(row.estRevenue * remainingFraction)

  const allCompanies = [...new Set(row.companies)]
  const MAX_VISIBLE = 4
  const overflow = allCompanies.length - MAX_VISIBLE

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative" style={{ width: 476, fontFamily: 'Open Sans, sans-serif' }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-2 h-12 pl-4 pr-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <IconSocialJira css={{ width: 18, height: 18, flexShrink: 0 }} />
          <p
            className="flex-1 min-w-0 truncate text-[#222428] leading-[1.5]"
            style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: '16px', fontFeatureSettings: "'ss01' 1" }}
          >
            {jiraKey}
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <button
            aria-label="More options"
            className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
          >
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <button
            ref={layoutButtonRef}
            aria-label="Panel layout"
            className="h-6 flex items-center gap-0.5 px-1 rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
            onClick={() => {
              const r = layoutButtonRef.current?.getBoundingClientRect()
              if (r) setLayoutPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
              setLayoutOpen(o => !o)
            }}
          >
            {selectedLayout === 'Center' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="4.5" y="5.5" width="7" height="5" rx="1" fill="currentColor"/>
              </svg>
            )}
            {selectedLayout === 'Right' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8" y="5.5" width="5.5" height="5" rx="1" fill="currentColor"/>
              </svg>
            )}
            {selectedLayout === 'Fullscreen' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 5.5V3h2.5M14 5.5V3h-2.5M2 10.5V13h2.5M14 10.5V13h-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            aria-label="Close panel"
            className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
            onClick={onClose}
          >
            <IconCross css={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* 4px spacer */}
      <div className="h-1 shrink-0" />

      {/* ── Tabs ── */}
      <div className="flex pl-3 pr-4 shrink-0 pb-5 pt-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="mr-1 px-2 py-1 rounded-lg text-[14px] font-semibold transition-colors"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              color: activeTab === tab ? '#4262FF' : '#656B81',
              backgroundColor: activeTab === tab ? '#F2F4FC' : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4px spacer */}
      <div className="h-1 shrink-0" />

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 overflow-y-auto panel-scroll pl-4 pr-4 pt-2 flex flex-col gap-2">

        {activeTab === 'Details' && (
          <>
            {/* ── Jira fields ── */}
            <JiraFieldRow label="Title">
              <p className="text-[14px] font-bold text-[#222428] leading-[1.4] px-2">{row.title}</p>
            </JiraFieldRow>

            <JiraFieldRow label="Description" alignStart>
              <div className="rounded px-2 py-1 w-full" style={{ minHeight: 56 }}>
                <p className="text-[14px] text-[#222428] leading-[1.4]">{row.description ?? '—'}</p>
              </div>
            </JiraFieldRow>

            <JiraFieldRow label="Status">
              <div
                className="inline-flex items-center rounded-[6px] px-2"
                style={{ backgroundColor: chip.bg, color: chip.color, height: 28 }}
              >
                <span className="text-[14px] leading-[20px]">{priorityLabel}</span>
              </div>
            </JiraFieldRow>

            <JiraFieldRow label="Priority">
              <div
                className="inline-flex items-center rounded-[6px] px-2"
                style={{ backgroundColor: chip.bg, color: chip.color, height: 28 }}
              >
                <span className="text-[14px] leading-[20px]">{priorityLabel}</span>
              </div>
            </JiraFieldRow>

            <JiraFieldRow label="Assignee">
              <div className="flex items-center gap-2 px-2">
                <img src="https://i.pravatar.cc/40?img=12" alt="" className="w-5 h-5 rounded-full shrink-0" />
                <span className="text-[14px] text-[#222428]">Alex Kim</span>
              </div>
            </JiraFieldRow>

            <JiraFieldRow label="Sprint">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">Sprint 14</span>
            </JiraFieldRow>

            <JiraFieldRow label="Story points">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">5</span>
            </JiraFieldRow>

            <JiraFieldRow label="Due date">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">Mar 28, 2026</span>
            </JiraFieldRow>

            <JiraFieldRow label="Companies" alignStart>
              <div className="flex flex-col gap-0 py-1 w-full">
                <div className="flex flex-wrap gap-2">
                  {allCompanies.slice(0, MAX_VISIBLE).map(name => (
                    <CompanyLogo key={name} name={name} size={32} />
                  ))}
                  {overflow > 0 && !companiesExpanded && (
                    <button
                      onClick={() => setCompaniesExpanded(true)}
                      className="inline-flex items-center h-[28px] px-2 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{ backgroundColor: '#F1F2F5', color: '#656B81' }}
                    >
                      +{overflow}
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: companiesExpanded ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {allCompanies.slice(MAX_VISIBLE).map(name => (
                      <CompanyLogo key={name} name={name} size={32} />
                    ))}
                    <button
                      onClick={() => setCompaniesExpanded(false)}
                      className="inline-flex items-center h-[28px] px-2 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{ backgroundColor: '#E0E2E8', color: '#656B81' }}
                    >
                      −
                    </button>
                  </div>
                </div>
              </div>
            </JiraFieldRow>

            <JiraFieldRow label="Labels" alignStart>
              <div className="flex flex-wrap gap-2 py-1">
                {['frontend', 'bug'].map(label => (
                  <Chip key={label} removable={false} css={{ fontSize: 14 }}>{label}</Chip>
                ))}
              </div>
            </JiraFieldRow>

          </>
        )}

        {activeTab === 'Jira' && <JiraForm row={row} />}

        {activeTab === 'Insights' && (
          <div className="flex flex-col gap-8 pt-4 pb-6">

            <InsightSection label="Summary">
              <p className="text-[14px] text-[#656B81] leading-[1.4]">
                {INSIGHT_SUMMARIES[row.id] ?? row.description ?? row.title}
              </p>
            </InsightSection>

            <InsightSection label="Top impacted customers">
              <div className="flex flex-wrap gap-2 mt-2">
                {row.companies.map(name => (
                  <CompanyLogo key={name} name={name} size={32} />
                ))}
              </div>
            </InsightSection>

            <InsightSection label="Impact estimates">
              <div className="flex flex-col gap-0 w-full">
                <div className="flex gap-3">
                  <StatBox value={adjMentions} format={n => String(n)} label="Total Mentions" />
                  <StatBox value={adjCustomers} format={n => n.toLocaleString()} label="Unique Customers" />
                </div>
                <div className="flex gap-3">
                  <StatBox value={adjCustomers} format={n => n.toLocaleString()} label="Total Users" />
                  <StatBox value={adjRevenue} format={n => n > 0 ? `$${n}K` : '—'} label="Impacted Customer ARR" />
                </div>
              </div>
            </InsightSection>

            {/* Feedback */}
            <div className="flex flex-col gap-3 -mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#222428] leading-[1]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
                  Feedback
                </span>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] text-[#222428] hover:bg-[#F1F2F5] transition-colors">
                    Relevance
                    <IconChevronDown size="small" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ color: '#222428' }}>
                    <IconSlidersY size="small" />
                  </button>
                </div>
              </div>

              <div style={{ overflowAnchor: 'none' }} className="flex flex-col">
                {generateFeedbackCards(row).map((card, i) => (
                  <div
                    key={i}
                    style={{
                      maxHeight: dismissedCards.has(i) ? 0 : 800,
                      opacity: dismissedCards.has(i) ? 0 : 1,
                      marginBottom: dismissedCards.has(i) ? 0 : 12,
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease, opacity 0.25s ease, margin-bottom 0.35s ease',
                    }}
                  >
                    <FeedbackCard
                      {...card}
                      onDismiss={() => setDismissedCards(prev => new Set([...prev, i]))}
                      onSelect={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="flex-1 flex items-center justify-center py-16">
            <p className="text-[14px] text-[#AEB2C0]">Comments coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

function JiraFieldRow({ label, children, alignStart }: { label: string; children: React.ReactNode; alignStart?: boolean }) {
  return (
    <div className={`flex gap-2 min-h-[40px] py-1 ${alignStart ? 'items-start' : 'items-center'}`}>
      <div className={`w-[100px] shrink-0 flex ${alignStart ? 'h-[32px] items-end pb-[5px]' : 'items-center'}`}>
        <span className="flex items-center gap-1 text-[14px] text-[#656B81] leading-[1.4]">
        {label}
        {label === 'Impacted Customer ARR' && (
          <IconInformationMarkCircle css={{ width: 14, height: 14, color: '#656B81', marginLeft: 4 }} />
        )}
      </span>
      </div>
      <div className="flex-1 min-w-0 flex items-center flex-wrap">
        {children}
      </div>
    </div>
  )
}

function InsightSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-semibold text-[#222428] leading-[1]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function useAnimatedNumber(target: number, duration = 600): number {
  const [displayed, setDisplayed] = useState(0)
  const prevRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    if (from === to) return
    let startTs: number | null = null
    const animate = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const step = Math.max(1, Math.round(Math.abs(to - from) / 12))
      const raw = from + (to - from) * eased
      setDisplayed(Math.round(raw / step) * step)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return displayed
}

function StatBox({ value, format, label, wow }: { value: number; format: (n: number) => string; label: string; wow?: number }) {
  const animated = useAnimatedNumber(value)
  return (
    <div className="flex-1 flex flex-col gap-1 pb-3">
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] text-[#222428] leading-[1.2]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1", display: 'block' }}>
          {format(animated)}
        </span>
        {wow !== undefined && (
          <span style={{ fontSize: 10, fontWeight: 400, color: '#656B81', lineHeight: 1 }}>
            {wow >= 0 ? '+' : ''}{wow}% WoW
          </span>
        )}
      </div>
      <span className="flex items-center gap-1 text-[14px] text-[#656B81] leading-[1.4]">
        {label}
        {label === 'Impacted Customer ARR' && (
          <IconInformationMarkCircle css={{ width: 14, height: 14, color: '#656B81', marginLeft: 4 }} />
        )}
      </span>
    </div>
  )
}

function FeedbackCard({
  borderColor,
  Icon,
  stars,
  text,
  author,
  date,
  companies,
  source,
  onDismiss,
  onSelect,
}: {
  borderColor: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>
  stars?: number
  text: string
  author: string
  date: string
  companies: string[]
  source?: string
  onDismiss: () => void
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; right: number } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    if (menuButtonRef.current) {
      const r = menuButtonRef.current.getBoundingClientRect()
      setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    }
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div
      className="w-full rounded-xl flex flex-col gap-2 p-5 transition-all duration-200 cursor-pointer"
      style={{ border: `2px solid ${borderColor}`, borderBottomWidth: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Card header */}
      <div className="flex items-center gap-2">
        <Icon css={{ width: 25, height: 25 }} />
        <span
          className="text-[12px] text-[#959AAC] leading-[1.5] whitespace-nowrap overflow-hidden"
          style={{
            maxWidth: hovered ? 120 : 0,
            opacity: hovered ? 1 : 0,
            transition: 'max-width 0.25s ease, opacity 0.2s ease',
          }}
        >
          {date}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button
            ref={menuButtonRef}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
          >
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <div
            className="relative"
            onMouseEnter={e => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
              setTooltipPos({ top: r.top - 4, right: window.innerWidth - r.right })
              setTooltipVisible(true)
            }}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <button
              onClick={e => { e.stopPropagation(); onDismiss() }}
              aria-label="Remove signal"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
            >
              <IconCross css={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Stars */}
      {stars && (
        <div className="flex gap-0.5">
          {Array.from({ length: stars }).map((_, i) => (
            <IconStarFilled key={i} css={{ width: 12, height: 12 }} />
          ))}
        </div>
      )}

      {/* Text */}
      <p
        className="text-[12px] text-[#222428] leading-[1.5] overflow-hidden"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          ...(!expanded && { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }),
        }}
      >
        {text}
      </p>
      <span
        className="text-[12px] text-[#222428] cursor-pointer hover:underline"
        onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
      >
        {expanded ? 'Show less' : 'Show more'}
      </span>

      {/* Author */}
      <p className="text-[14px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        {author}
      </p>

      {/* Source + company — slide in on hover */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: hovered ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="flex items-center gap-2 pt-1">
            {date && <span style={{ fontSize: 12, fontWeight: 400, color: '#3C3F4A', fontFamily: 'Open Sans, sans-serif', background: '#F1F2F5', borderRadius: 6, padding: '0 8px', height: 24, display: 'inline-flex', alignItems: 'center' }}>{date}</span>}
            {source && <SourceLogoChip source={source} />}
            {companies[0] && (
              <CompanyLogo name={companies[0]} size={24} />
            )}
          </div>
        </div>
      </div>

      {layoutOpen && layoutPos && createPortal(
        <div
          ref={layoutMenuRef}
          className="fixed z-[9999] bg-white flex flex-col rounded-[8px]"
          style={{ top: layoutPos.top, right: layoutPos.right, padding: '16px 12px', gap: 4, boxShadow: '0px 0px 12px rgba(34,36,40,0.04), 0px 2px 8px rgba(34,36,40,0.12)' }}
        >
          {(['Right', 'Center', 'Fullscreen'] as const).map(option => (
            <button
              key={option}
              className="flex items-center w-full rounded-[4px] hover:bg-[#F1F2F5] transition-colors text-left"
              style={{ padding: '0 8px 0 0', gap: 0, background: selectedLayout === option ? '#F1F2F5' : 'transparent' }}
              onClick={() => { setSelectedLayout(option); setLayoutOpen(false) }}
            >
              <span className="flex items-center justify-end shrink-0" style={{ padding: '12px 0 12px 8px' }}>
                {option === 'Right' && (
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="#222428" strokeWidth="1.2"/>
                    <rect x="7.5" y="2.5" width="4" height="7" rx="0.8" fill="#222428"/>
                  </svg>
                )}
                {option === 'Center' && (
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="#222428" strokeWidth="1.2"/>
                    <rect x="3.5" y="2.5" width="7" height="7" rx="0.8" fill="#222428"/>
                  </svg>
                )}
                {option === 'Fullscreen' && (
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.4" stroke="#222428" strokeWidth="1.2"/>
                    <rect x="1.5" y="1.5" width="11" height="9" rx="0.8" fill="#222428"/>
                  </svg>
                )}
              </span>
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, color: '#222428', paddingLeft: 8, paddingTop: 10, paddingBottom: 10, fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>{option}</span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {menuOpen && menuPos && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white flex flex-col gap-[4px] py-3 px-3 rounded-lg"
          style={{ top: menuPos.top, right: menuPos.right, width: 224, boxShadow: '0px 2px 8px rgba(34,36,40,0.12), 0px 0px 12px rgba(34,36,40,0.04)' }}
        >
          {[
            { icon: <IconBoard size="small" />, label: 'Add to board', onClick: () => setMenuOpen(false) },
            { icon: <IconSquaresTwoOverlap size="small" />, label: 'Copy', onClick: () => setMenuOpen(false) },
            { icon: <IconDocFormat size="small" />, label: 'View in transcript', onClick: () => setMenuOpen(false) },
          ].map(({ icon, label, onClick }) => (
            <button
              key={label}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded text-[14px] text-[#222428] hover:bg-[#F1F2F5] transition-colors text-left"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
              onClick={onClick}
            >
              <span className="text-[#656B81] flex items-center shrink-0">{icon}</span>
              {label}
            </button>
          ))}
        </div>,
        document.body
      )}

      {tooltipVisible && tooltipPos && createPortal(
        <div
          className="fixed pointer-events-none z-[9999] flex flex-col items-end whitespace-nowrap"
          style={{ top: tooltipPos.top, right: tooltipPos.right, transform: 'translateY(-100%)' }}
        >
          <div className="bg-[#2B2D33] text-white text-[12px] leading-none px-2 py-1.5 rounded-md" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Remove signal
          </div>
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #2B2D33', marginRight: 8 }} />
        </div>,
        document.body
      )}
    </div>
  )
}
