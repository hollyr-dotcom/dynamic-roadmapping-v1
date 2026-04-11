import React, { useState, useEffect, useRef } from 'react'
import avatarVihar from '../../assets/vihar.png'
import avatarSarah from '../../assets/sarah-chen.png'
import avatarKyra from '../../assets/kyra-osei.png'
import avatarMarcus from '../../assets/marcus-chen.png'
import avatarPriya from '../../assets/priya-sharma.png'
import avatarDaniel from '../../assets/daniel-park.png'
import avatarJordan from '../../assets/jordan-lee.png'
import { CARDS, MATCH_TAG_STYLE } from './overview-data'
import type { CardIcon } from './overview-data'
import {
  Button,
  IconDotsThreeVertical,
  DropdownMenu,
  IconSquaresTwoOverlap,
  IconBoard,
  IconEyeOpen,
  IconInsightsSearch,
  IconInformationMarkCircle,
  IconTasks,
  IconChartLine,
  IconChartProgress,
  IconSparks,
  IconLightning,
  IconChatTwo,
  IconArrowDown,
  IconCross,
  IconPlus,
  IconTimelineFormat,
  IconRocket,
  IconClusterAi,
  IconArticle,
  IconLink,
  IconClock,
} from '@mirohq/design-system'

const TAG_BG: Record<string, string> = {
  New: '#ADF0C7',
  Customer: '#FFF6B6',
  Market: '#C6DCFF',
  Urgent: '#FFD8F4',
  Strengthening: '#F8D3AF',
  Weakening: '#DEDAFF',
}

function IconThreeColumnsVertical() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="4" width="5" height="16" rx="1.5" fill="#3C3F4A" />
      <rect x="9.5" y="4" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="17" y="4" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function GiftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="7" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 7h14v2H1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 7V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 7C8 7 6 5.5 5.5 4.5C5 3.5 5.5 2 7 2C8 2 8 3.5 8 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 7C8 7 10 5.5 10.5 4.5C11 3.5 10.5 2 9 2C8 2 8 3.5 8 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function confidenceBorderColor(confidence: string): string {
  const pct = parseInt(confidence)
  if (pct >= 95) return '#ADF0C7'
  if (pct >= 88) return '#C6DCFF'
  if (pct >= 75) return '#FFF6B6'
  return '#F8D3AF'
}

function TagIcon({ label }: { label: string }) {
  if (label === 'New') return <GiftIcon />
  if (label === 'Customer') return <IconSmileyChat css={{ width: 13, height: 13 }} />
  if (label === 'Market') return <IconGlobe css={{ width: 13, height: 13 }} />
  if (label === 'Urgent') return <IconExclamationPointCircle css={{ width: 13, height: 13 }} />
  if (label === 'Strengthening') return <IconChartLine css={{ width: 13, height: 13 }} />
  if (label === 'Weakening') return <IconArrowDown css={{ width: 13, height: 13 }} />
  return null
}


// ── Demo feed data ────────────────────────────────────────────────────────────

const AI_BULLETS = [
  'C26 scope is locked: 3–5 cards, Miro + Glean data, EPD-only beta by end of May.',
  'Home evolution strategy landed on the middle path. Alpha feedback flagged card UX and signal quality as the main issues.',
  'Christian is splitting the agent architecture to fix the performance bottleneck. Demo for stakeholders is Thursday.',
]

const DEMO_POSTS = [
  {
    id: 'p1',
    author: 'Vihar',
    avatar: avatarVihar,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    title: 'C26 scope is finalized, here\'s where we landed',
    body: 'We\'re going with the middle path: a feed with 3–5 cards powered by Miro signals and Glean. Not a reskin, not the full new-Miro vision. Alpha feedback is in and card UX + signal quality are the main pain points. The card-disappearing bug is a blocker.\n\nChristian is splitting the agent architecture so retrieval and ranking aren\'t bottlenecked in one call. Demo for stakeholders is Thursday.',
  },
  {
    id: 'p2',
    author: 'Jordan Lee',
    avatar: avatarJordan,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Alpha is live, here\'s what we\'re learning',
    body: 'We shipped the internal alpha last Thursday to ~30 EPD users. Early signal relevance feedback is positive but the card UX is getting torn apart. Masha is pulling the feedback together and I\'ll triage it into Sprint 16.\n\nBig open question: should we ship the fan card layout or switch to the vertical stack that a few testers are asking for? Akshan is mocking up both options on the Feed Content Design board.',
  },
  {
    id: 'p3',
    author: 'Daniel Park',
    avatar: avatarDaniel,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Sprint 16 priorities are locked',
    body: 'Three items from alpha triage made it into Sprint 16:\n\n🔴 Card-disappearing bug (blocker)\n🟡 Signal accuracy improvements for Glean sources\n🟡 Card layout redesign\n\nEverything else is deferred to Sprint 17. Christian is leading the architecture split this sprint.',
  },
]

const DEMO_LINKS = [
  { id: 'l1', label: '#home-feed', icon: 'slack' as const },
  { id: 'l2', label: '#feed-alpha', icon: 'slack' as const },
  { id: 'l3', label: 'Feed Design', icon: 'figma' as const },
  { id: 'l4', label: 'FEED-Sprint 16', icon: 'jira' as const },
  { id: 'l5', label: 'Feed Content Design', icon: 'miro' as const },
]

const DEMO_RECENTLY_UPDATED = [
  { id: 'r1', emoji: '📋', title: 'Sprint Retrospective', by: 'Jamie Park', ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'r2', emoji: '📋', title: 'User Research Findings', by: 'Marcus Chen', ts: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'r3', emoji: '🗺️', title: 'Product Roadmap 2026', by: 'Sarah Chen', ts: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function updatedLabel(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 24) return 'Today'
  if (hrs < 48) return 'Yesterday'
  return relativeTime(ts)
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SlackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8.77 3C8.77 1.79 9.73 0.83 10.94 0.83C12.15 0.83 13.11 1.79 13.11 3V8.77C13.11 9.98 12.15 10.94 10.94 10.94C9.73 10.94 8.77 9.98 8.77 8.77V3Z" fill="#E01E5A"/>
      <path d="M3 13.06C1.79 13.06 0.83 12.1 0.83 10.89C0.83 9.68 1.79 8.72 3 8.72H8.77C9.98 8.72 10.94 9.68 10.94 10.89C10.94 12.1 9.98 13.06 8.77 13.06H3Z" fill="#36C5F0"/>
      <path d="M15.23 21C15.23 22.21 14.27 23.17 13.06 23.17C11.85 23.17 10.89 22.21 10.89 21V15.23C10.89 14.02 11.85 13.06 13.06 13.06C14.27 13.06 15.23 14.02 15.23 15.23V21Z" fill="#2EB67D"/>
      <path d="M21 10.89C22.21 10.89 23.17 11.85 23.17 13.06C23.17 14.27 22.21 15.23 21 15.23H15.23C14.02 15.23 13.06 14.27 13.06 13.06C13.06 11.85 14.02 10.89 15.23 10.89H21Z" fill="#ECB22E"/>
    </svg>
  )
}

type CardIcon = 'chart-line' | 'chart-progress' | 'sparks' | 'lightning' | 'chat' | 'timeline' | 'insights-search' | 'rocket' | 'three-columns'

type MatchTag = 'Growing evidence' | 'Fading evidence' | 'New evidence' | 'Missing in roadmap' | 'Weak evidence'

export const MATCH_TAG_STYLE: Record<MatchTag, { bg: string; text: string }> = {
  'Growing evidence':    { bg: '#EAFAEA', text: '#067429' },
  'Fading evidence':     { bg: '#EFE9FF', text: '#3D25A0' },
  'New evidence':        { bg: '#E7F0FF', text: '#0055CC' },
  'Missing in roadmap': { bg: '#FFE3FC', text: '#7B2F6E' },
  'Weak evidence':       { bg: '#FFF8D6', text: '#7F5F01' },
}

export const MATCH_TAG_EMOJI: Record<MatchTag, string> = {
  'Growing evidence':   '📈',
  'Fading evidence':    '📉',
  'New evidence':       '✨',
  'Missing in roadmap': '🗺️',
  'Weak evidence':      '💭',
}

export const CARDS: {
  id: string
  tags: string[]
  matchTag: MatchTag
  title: string
  description: string
  confidence: string
  primaryAction: string
  secondaryAction?: string
}[] = [
  {
    id: '1',
    tags: ['Customer'],
    matchTag: 'Growing evidence',
    title: 'Accelerate large-table performance improvements — boards become unusable at ~100+ rows',
    description: '~793 projected monthly mentions make this the highest-volume theme in March, up 23% month-over-month. It correlates directly to an existing P0 roadmap item that may need to be pulled forward.',
    confidence: '90%',
    primaryAction: 'Reprioritize',
  },
  {
    id: '2',
    tags: ['Customer'],
    matchTag: 'Missing in roadmap',
    title: 'Fix paste and CSV import fidelity — especially the 5-row truncation bug',
    description: 'Paste from Excel, Google Sheets, CSV, and Confluence is broken for ~652 projected monthly mentions. No existing roadmap item addresses paste or import fidelity.',
    confidence: '88%',
    primaryAction: 'Add to roadmap',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '3',
    tags: ['Customer'],
    matchTag: 'Growing evidence',
    title: 'Add rich text editing inside table cells (bullets, bold, links)',
    description: '~874 projected monthly mentions make rich text the single highest-volume theme in March, rising for three consecutive months. Current cells are plain text only, breaking use cases like mini-specs, meeting notes, and workshop content.',
    confidence: '85%',
    primaryAction: 'Reprioritize',
  },
  {
    id: '4',
    tags: ['Customer'],
    matchTag: 'Weak evidence',
    title: 'Rein in AI table creation — make it suggestion-only with preview and opt-in controls',
    description: 'Only ~241 mentions across 89 customers so far — low volume relative to other themes. Reports are scattered with no clear pattern yet. Not enough signal to scope work confidently.',
    confidence: '83%',
    primaryAction: 'Dive deeper',
  },
]


const CARD_W = 500
const CARD_H = 480
const CARD_GAP = 40


export function OverviewPage({ onDiveDeeper, onAddToRoadmap, onReprioritize, onGoToBacklog }: { onDiveDeeper?: (cardId: string) => void; onAddToRoadmap?: (cardId: string) => void; onReprioritize?: (cardId: string) => void; onGoToBacklog?: () => void }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [activeIndex, setActiveIndex] = useState(0)
  const [descKey, setDescKey] = useState(0)
  const [trackHeight, setTrackHeight] = useState(700)
  const [activeCardH, setActiveCardH] = useState(CARD_H)
  const trackRef = useRef<HTMLDivElement>(null)
  // Measured height of an inactive (collapsed) card — used as the scroll step between snap points.
  // When card i is active all other cards are inactive, so the distance between consecutive
  // snap centers = inactiveH + CARD_GAP (not CARD_H + CARD_GAP).
  const inactiveHRef = useRef(128)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Refs to animated DOM nodes — updated every render, read in scroll handler without stale closure
  const iconWrapperRefs = useRef<(HTMLDivElement | null)[]>([])
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const expandRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const tagsRefs = useRef<(HTMLDivElement | null)[]>([])
  const actionsRefs = useRef<(HTMLDivElement | null)[]>([])
  const closeRefs = useRef<(HTMLDivElement | null)[]>([])
  // Keep card count + card list current synchronously so the scroll handler never reads stale data
  const visibleCardsLenRef = useRef(0)
  const visibleCardsRef = useRef<typeof CARDS>([])

  const visibleCards = CARDS.filter((card) => !dismissed.has(card.id))
  const safeIndex = Math.min(activeIndex, Math.max(0, visibleCards.length - 1))

  // Update synchronously during render (before effects/handlers can fire)
  visibleCardsLenRef.current = visibleCards.length
  visibleCardsRef.current = visibleCards

  // Kept current every render so stable effects can read without stale closures
  const activeIndexRef = useRef(0)
  activeIndexRef.current = safeIndex

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, visibleCards.length - 1))
    setActiveIndex(clamped)
    if (trackRef.current) {
      trackRef.current.scrollTo({ top: clamped * (inactiveHRef.current + CARD_GAP), behavior: 'smooth' })
    }
  }, [visibleCards.length])

  // Stable function — only reads refs, never stale
  const applyProgress = useCallback((st: number) => {
    const offset = st / (inactiveHRef.current + CARD_GAP)
    const len = visibleCardsLenRef.current
    for (let i = 0; i < len; i++) {
      const progress = Math.max(0, 1 - Math.abs(offset - i))
      if (cardRefs.current[i]) cardRefs.current[i]!.style.alignSelf = 'auto'
      if (iconWrapperRefs.current[i]) iconWrapperRefs.current[i]!.style.gridTemplateRows = `${progress}fr`
      if (iconRefs.current[i]) iconRefs.current[i]!.style.opacity = `${Math.max(0, (progress - 0.4) / 0.6)}`
      if (expandRefs.current[i]) expandRefs.current[i]!.style.gridTemplateRows = `${progress}fr`
      if (titleRefs.current[i]) {
        titleRefs.current[i]!.style.fontSize = `${17 + 11 * progress}px`
        titleRefs.current[i]!.style.fontWeight = progress > 0.5 ? '400' : '600'
      }
      if (tagsRefs.current[i]) tagsRefs.current[i]!.style.opacity = `${Math.max(0, (progress - 0.6) / 0.4)}`
      if (actionsRefs.current[i]) actionsRefs.current[i]!.style.opacity = `${Math.max(0, (progress - 0.75) / 0.25)}`
      if (closeRefs.current[i]) {
        const closeOpacity = Math.max(0, (progress - 0.75) / 0.25)
        closeRefs.current[i]!.style.opacity = `${closeOpacity}`
        closeRefs.current[i]!.style.pointerEvents = closeOpacity > 0 ? 'auto' : 'none'
      }
    }

  }, [])

  useLayoutEffect(() => {
    if (cardRefs.current[1]) inactiveHRef.current = cardRefs.current[1].offsetHeight
  }, [])

  // Measure the active card's actual rendered height once at mount.
  // Card 0 is always active on first render (isActive=true → gridTemplateRows:'1fr') so its
  // offsetHeight already reflects the fully-expanded size. Re-measuring on every render would
  // change snapPad mid-scroll, interrupting the smooth animation.
  useLayoutEffect(() => {
    const card = cardRefs.current[0]
    if (card) {
      const h = card.offsetHeight
      if (h > 0) setActiveCardH(h)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After every React render, re-apply scroll-driven styles before paint.
  useLayoutEffect(() => {
    if (trackRef.current) applyProgress(trackRef.current.scrollTop)
  })

  // Attach scroll listeners
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => applyProgress(track.scrollTop)
    const onScrollEnd = () => {
      applyProgress(track.scrollTop)
      const step = inactiveHRef.current + CARD_GAP
      const rawIdx = track.scrollTop / step
      const next = Math.max(0, Math.min(Math.round(rawIdx), visibleCardsLenRef.current - 1))
      setActiveIndex(prev => (prev === next ? prev : next))
      setDescKey(k => k + 1)
      const snapTo = next * step
      if (Math.abs(track.scrollTop - snapTo) > 2) {
        track.scrollTo({ top: snapTo, behavior: 'smooth' })
      }
    }

    // Intercept wheel/trackpad to advance exactly one card per gesture
    let busy = false
    let accumY = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (busy) return
      accumY += e.deltaY
      if (Math.abs(accumY) < 40) return
      const dir = accumY > 0 ? 1 : -1
      accumY = 0
      busy = true
      const len = visibleCardsLenRef.current
      setActiveIndex(prev => {
        const next = Math.max(0, Math.min(prev + dir, len - 1))
        if (next !== prev) {
          track.scrollTo({ top: next * (inactiveHRef.current + CARD_GAP), behavior: 'smooth' })
        }
        return next
      })
      setTimeout(() => { busy = false; accumY = 0 }, 500)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('scrollend', onScrollEnd)
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('scrollend', onScrollEnd)
      track.removeEventListener('wheel', onWheel)
    }
  }, [applyProgress])

  // Arrow key navigation — uses refs so this effect never needs to re-attach
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const len = visibleCardsLenRef.current
      const dir = e.key === 'ArrowDown' ? 1 : -1
      const next = Math.max(0, Math.min(activeIndexRef.current + dir, len - 1))
      if (trackRef.current) {
        trackRef.current.scrollTo({ top: next * (inactiveHRef.current + CARD_GAP), behavior: 'smooth' })
      }
      setActiveIndex(next)
      setDescKey(k => k + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Measure track height so snapPad keeps first/last cards snap-centered on all screen sizes
  useEffect(() => {
    if (visibleCards.length === 0) return
    const track = trackRef.current
    if (!track) return
    setTrackHeight(track.clientHeight)
    const ro = new ResizeObserver(() => setTrackHeight(track.clientHeight))
    ro.observe(track)
    return () => ro.disconnect()
  }, [visibleCards.length])

  // Measure an inactive card's height after mount — card 1 is always inactive at startup
  useEffect(() => {
    if (visibleCards.length < 2) return
    const card = cardRefs.current[1]
    if (card) inactiveHRef.current = card.offsetHeight
  }, [visibleCards.length])

  // snapPad = (trackHeight - activeCardH) / 2 centers the active card in the viewport.
  // Using the measured activeCardH (not the CARD_H constant) ensures the last card can
  // always reach its snap position and reach progress = 1.0.
  const snapPad = Math.max(20, Math.round((trackHeight - activeCardH) / 2))



  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 24C10.21 24 12 22.21 12 20V16H8C5.79 16 4 17.79 4 20C4 22.21 5.79 24 8 24Z" fill="#0ACF83"/>
      <path d="M4 12C4 9.79 5.79 8 8 8H12V16H8C5.79 16 4 14.21 4 12Z" fill="#A259FF"/>
      <path d="M4 4C4 1.79 5.79 0 8 0H12V8H8C5.79 8 4 6.21 4 4Z" fill="#F24E1E"/>
      <path d="M12 0H16C18.21 0 20 1.79 20 4C20 6.21 18.21 8 16 8H12V0Z" fill="#FF7262"/>
      <path d="M20 12C20 14.21 18.21 16 16 16C13.79 16 12 14.21 12 12C12 9.79 13.79 8 16 8C18.21 8 20 9.79 20 12Z" fill="#1ABCFE"/>
    </svg>
  )
}

      {/* Carousel viewport */}
      <div className="relative w-full" style={{ minHeight: 340, overflow: 'clip', overflowClipMargin: '40px' }}>

        {/* Track */}
        <div
          className="flex items-stretch"
          style={{
            gap: CARD_GAP,
            transform: `translateX(calc(50% - ${CARD_W / 2}px - ${safeIndex * (CARD_W + CARD_GAP)}px))`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="p-7 flex flex-col gap-2">
            {/* Title + close row */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[20px] font-medium text-[#1a1b1e] leading-snug" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
                {card.title}
              </h3>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                <button
                  onClick={() => setDismissed(prev => new Set(prev).add(card.id))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
                >
                  <IconCross size="small" />
                </button>
              </div>
            </div>

            {/* Description — expands on hover via grid-rows trick for smooth height transition */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="overflow-hidden">
                <p className="text-[14px] leading-relaxed pb-1" style={{ fontFamily: 'Open Sans, sans-serif', color: '#656b81' }}>
                  {card.description}
                </p>
              </div>
            </div>

            {/* Chips */}
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <Chip removable={false} css={{ backgroundColor: MATCH_TAG_STYLE[card.matchTag].bg, color: MATCH_TAG_STYLE[card.matchTag].text, fontWeight: 700, borderRadius: 6, fontFamily: "'Roobert PRO', sans-serif", fontSize: 12 }}>{card.matchTag}</Chip>
              <Chip removable={false} css={{ backgroundColor: confidenceTagStyle(card.confidence).bg, color: confidenceTagStyle(card.confidence).text, fontWeight: 700, borderRadius: 6, fontFamily: "'Roobert PRO', sans-serif", fontSize: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                  {card.confidence} confidence
                  <IconInformationMarkCircle css={{ width: 16, height: 16, flexShrink: 0 }} />
                </span>
              </Chip>
            </div>

                  {/* Close button — fades in with the card via applyProgress */}
                  <div
                    ref={el => { closeRefs.current[idx] = el }}
                    className="absolute top-5 right-5"
                    style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); setDismissed(prev => new Set(prev).add(card.id)); goTo(Math.min(safeIndex, visibleCards.length - 2)) }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
                    >
                      <IconCross size="small" />
                    </button>
                  </div>

                  {/* Card icon — collapses to 0 height when inactive, no layout impact */}
                  <div
                    ref={el => { iconWrapperRefs.current[idx] = el }}
                    style={{ display: 'grid', gridTemplateRows: isActive ? '1fr' : '0fr' }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        ref={el => { iconRefs.current[idx] = el }}
                        style={{ paddingBottom: 4, opacity: isActive ? 1 : 0 }}
                      >
                        <span style={{ fontSize: 28, lineHeight: 1 }}>{MATCH_TAG_EMOJI[card.matchTag]}</span>
                      </div>
                    </div>
                  </div>

          {/* Hover-reveal actions */}
          <div className="absolute bottom-7 left-7 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-300 ease-out">
            <Button
              variant="primary"
              size="medium"
              onPress={() => { if (card.primaryAction === 'Add to roadmap') { onAddToRoadmap?.(card.id); setDismissed(prev => new Set(prev).add(card.id)) } else if (card.primaryAction === 'Reprioritize') { onReprioritize?.(card.id) } else if (card.primaryAction === 'Dive deeper') { onDiveDeeper?.(card.id) } }}
            >
              <Button.IconSlot>
                {card.primaryAction === 'Add to roadmap' ? <IconPlus /> : card.primaryAction === 'Reprioritize' ? <IconTimelineFormat /> : card.primaryAction === 'Dive deeper' ? <IconEyeOpen /> : <IconEyeOpen />}
              </Button.IconSlot>
              <Button.Label>{card.primaryAction}</Button.Label>
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onPress={() => onDiveDeeper?.(card.id)}
            >
              <Button.Label>{card.secondaryAction}</Button.Label>
            </Button>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#E8E9EF] transition-colors">
                  <IconDotsThreeVertical size="small" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start">
                <DropdownMenu.Item onSelect={() => {}}>
                  <DropdownMenu.IconSlot><IconSquaresTwoOverlap /></DropdownMenu.IconSlot>
                  Copy
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => {}}>
                  <DropdownMenu.IconSlot><IconBoard /></DropdownMenu.IconSlot>
                  Add to board
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>

        {/* Left chevron */}
        {safeIndex > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{ left: `calc(50% - ${CARD_W / 2}px - 48px)` }}
          >
            <IconButton
              aria-label="Previous"
              variant="ghost"
              size="medium"
              onPress={() => goTo(safeIndex - 1)}
              css={{ color: '#3C3F4A', background: '#fff', border: '1px solid #eaecf0', boxShadow: '0 2px 8px rgba(34,36,40,0.08)', transition: 'background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease', '&:hover': { background: '#F1F2F5', boxShadow: '0 6px 20px rgba(34,36,40,0.14)', transform: 'scale(1.08)' } }}
            >
              <IconChevronLeft />
            </IconButton>
          </div>
        )}

        {/* Right chevron */}
        {safeIndex < visibleCards.length - 1 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{ left: `calc(50% + ${CARD_W / 2}px + 12px)` }}
          >
            <IconButton
              aria-label="Next"
              variant="ghost"
              size="medium"
              onPress={() => goTo(safeIndex + 1)}
              css={{ color: '#3C3F4A', background: '#fff', border: '1px solid #eaecf0', boxShadow: '0 2px 8px rgba(34,36,40,0.08)', transition: 'background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease', '&:hover': { background: '#F1F2F5', boxShadow: '0 6px 20px rgba(34,36,40,0.14)', transform: 'scale(1.08)' } }}
            >
              <IconChevronRight />
            </IconButton>
          </div>
        )}
      </div>

      {/* Body */}
      <p style={{ fontFamily: BODY_FONT, fontSize: 14, color: TEXT_SECONDARY, margin: 0, lineHeight: 1.5 }}>
        {card.description}
      </p>

      {/* Actions — visible on hover */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, visibility: hovered ? 'visible' : 'hidden' }}>
        <button
          onClick={onPrimaryAction}
          style={{ height: 32, padding: '0 12px', fontSize: 14, fontFamily: BODY_FONT, fontWeight: 600, borderRadius: 8, border: 'none', backgroundColor: '#EEEEEB', color: TEXT_PRIMARY, cursor: 'pointer' }}
        >
          {card.primaryAction}
        </button>
        {card.secondaryAction && (
          <button
            onClick={onSecondaryAction}
            style={{ height: 32, padding: '0 12px', fontSize: 14, fontFamily: BODY_FONT, fontWeight: 600, borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer' }}
          >
            {card.secondaryAction}
          </button>
        )}
      </div>
    </div>
  )
}

function PostItem({ post, index = 0 }: { post: typeof DEMO_POSTS[number]; index?: number }) {
  const [hovered, setHovered] = useState(false)
  const fadeRef = useFadeIn(index * 80)
  return (
    <div ref={fadeRef}
      style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: hovered ? CARD_SHADOW : 'none', transition: 'box-shadow 0.15s ease, opacity 0.4s ease, transform 0.4s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 36 }}>
        <img src={post.avatar} alt={post.author} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: BODY_FONT, fontWeight: 600, fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.4 }}>{post.author}</div>
          <div style={{ fontFamily: BODY_FONT, fontSize: 10, color: TEXT_MUTED, lineHeight: 1.5 }}>{relativeTime(post.timestamp)}</div>
        </div>
      </div>
      {/* Title */}
      {post.title && (
        <h5 style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 16, color: TEXT_PRIMARY, margin: 0, lineHeight: 1.5, fontFeatureSettings: "'ss01'" }}>
          {post.title}
        </h5>
      )}
      {/* Body */}
      <p style={{ fontFamily: BODY_FONT, fontSize: 14, color: TEXT_SECONDARY, margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
        {post.body}
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function OverviewPage({ onDiveDeeper, onAddToRoadmap, onReprioritize, onBgColorChange, onGoToBacklog, bgRef }: { onDiveDeeper?: (cardId: string) => void; onAddToRoadmap?: (cardId: string) => void; onReprioritize?: (cardId: string) => void; onBgColorChange?: (color: string) => void; onGoToBacklog?: () => void; bgRef?: React.RefObject<HTMLElement> }) {
  const [feedTab, setFeedTab] = useState<'all' | 'posts' | 'signals'>('all')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visibleSignals = CARDS.filter(c => !dismissed.has(c.id))

  useEffect(() => {
    onBgColorChange?.('#FBFAF7')
    if (bgRef?.current) {
      bgRef.current.style.backgroundImage = 'none'
      bgRef.current.style.backgroundSize = ''
      bgRef.current.style.backgroundPosition = ''
    }
  }, [onBgColorChange, bgRef])

  const tabBtn = (tab: 'all' | 'posts' | 'signals'): React.CSSProperties => ({
    height: 32, padding: '0 12px', fontSize: 14, fontFamily: BODY_FONT, fontWeight: 600,
    borderRadius: 8, border: 'none', cursor: 'pointer',
    backgroundColor: feedTab === tab ? '#222428' : 'transparent',
    color: feedTab === tab ? '#fff' : TEXT_SECONDARY,
    transition: 'background-color 0.12s ease, color 0.12s ease',
  })

  const MEMBERS = [avatarVihar, avatarSarah, avatarKyra, avatarMarcus, avatarPriya]

  return (
    <div style={{ width: '100%', padding: '40px 80px 80px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 980 }}>

      {/* ── Space header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Left: emoji + title + description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(34,36,40,0.04), 0 2px 8px rgba(34,36,40,0.12)', flexShrink: 0 }}
            >
              <span style={{ fontSize: 38, lineHeight: 1 }}>🚀</span>
            </button>
            <div style={{ fontFamily: HEADING_FONT, fontWeight: 500, fontSize: 52, color: TEXT_PRIMARY, letterSpacing: '-2px', lineHeight: 1.2, fontFeatureSettings: "'ss01'" }}>
              Project Galaxy
            </div>
            <div style={{ fontFamily: BODY_FONT, fontSize: 18, color: TEXT_SECONDARY, lineHeight: 1.5 }}>
              Next-gen product roadmap, backlog management, and cross-team planning
            </div>
          </div>
          {/* Right: Share + Create */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingTop: 8 }}>
            <button
              style={{ height: 40, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 8, fontSize: 16, fontFamily: BODY_FONT, fontWeight: 600, border: '1px solid rgba(255,255,255,0)', backgroundColor: '#EEEEEB', color: TEXT_PRIMARY, cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Share
            </button>
            <button
              style={{ height: 40, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, fontFamily: BODY_FONT, fontWeight: 600, borderRadius: 8, border: 'none', backgroundColor: '#2A2923', color: '#fff', cursor: 'pointer' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Create
            </button>
          </div>
        </div>
        {/* Member avatars */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {MEMBERS.map((src, i) => (
            <img
              key={src} src={src} alt=""
              style={{ width: 32, height: 32, borderRadius: '9999px', objectFit: 'cover', border: '2px solid #FBFAF7', marginLeft: i > 0 ? -8 : 0, position: 'relative', zIndex: MEMBERS.length - i, flexShrink: 0 }}
            />
          ))}
          <span style={{ fontFamily: BODY_FONT, fontSize: 12, fontWeight: 500, color: TEXT_SECONDARY, marginLeft: 6 }}>+6</span>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Left column (644px) */}
        <div style={{ width: 644, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Summary widget */}
          <div style={{ backgroundColor: WIDGET_BG, borderRadius: 24, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <IconClusterAi css={{ width: 20, height: 20, color: TEXT_SECONDARY, flexShrink: 0 }} />
              <h4 style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 16, color: TEXT_PRIMARY, margin: 0, fontFeatureSettings: "'ss01'" }}>
                Here's what's happening
              </h4>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {AI_BULLETS.map((b, i) => (
                <li key={i} style={{ fontFamily: BODY_FONT, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.5 }}>{b}</li>
              ))}
            </ul>
          </div>

          {/* Feed widget */}
          <div style={{ backgroundColor: WIDGET_BG, borderRadius: 24, padding: 24 }}>
            {/* Heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <IconArticle css={{ width: 20, height: 20, color: TEXT_SECONDARY, flexShrink: 0 }} />
              <h4 style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 16, color: TEXT_PRIMARY, margin: 0, fontFeatureSettings: "'ss01'" }}>Feed</h4>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
              {(['all', 'posts', 'signals'] as const).map(tab => (
                <button key={tab} style={tabBtn(tab)} onClick={() => setFeedTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {(feedTab === 'all' || feedTab === 'signals') && visibleSignals.map((card, i) => (
                <SignalItem
                  key={card.id}
                  card={card}
                  index={i}
                  onDismiss={() => setDismissed(prev => new Set(prev).add(card.id))}
                  onPrimaryAction={() => {
                    if (card.primaryAction === 'Add to roadmap') { onAddToRoadmap?.(card.id); setDismissed(prev => new Set(prev).add(card.id)) }
                    else if (card.primaryAction === 'Reprioritize') onReprioritize?.(card.id)
                    else if (card.primaryAction === 'Dive deeper') onDiveDeeper?.(card.id)
                  }}
                  onSecondaryAction={card.secondaryAction ? () => onDiveDeeper?.(card.id) : undefined}
                />
              ))}
              {(feedTab === 'all' || feedTab === 'posts') && DEMO_POSTS.map((post, i) => (
                <PostItem key={post.id} post={post} index={visibleSignals.length + i} />
              ))}
              {feedTab === 'signals' && visibleSignals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontFamily: BODY_FONT, fontSize: 14, color: TEXT_SECONDARY, margin: 0 }}>All signals reviewed</p>
                  <button onClick={() => onGoToBacklog?.()} style={{ marginTop: 12, fontFamily: BODY_FONT, fontSize: 14, fontWeight: 600, color: '#4262ff', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Go to ideas →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column (hug content) */}
        <div style={{ flex: '0 0 auto', width: 280, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Links widget */}
          <div style={{ backgroundColor: WIDGET_BG, borderRadius: 24, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <IconLink css={{ width: 20, height: 20, color: TEXT_SECONDARY, flexShrink: 0 }} />
              <h4 style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 16, color: TEXT_PRIMARY, margin: 0, fontFeatureSettings: "'ss01'" }}>Links</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {DEMO_LINKS.map(link => (
                <a key={link.id} href="#" onClick={e => e.preventDefault()}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8, textDecoration: 'none', color: TEXT_SECONDARY, fontFamily: BODY_FONT, fontSize: 12 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = HOVER_BG }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  <LinkIcon type={link.icon} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recently Updated widget */}
          <div style={{ backgroundColor: WIDGET_BG, borderRadius: 24, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <IconClock css={{ width: 20, height: 20, color: TEXT_SECONDARY, flexShrink: 0 }} />
              <h4 style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 16, color: TEXT_PRIMARY, margin: 0, fontFeatureSettings: "'ss01'" }}>Recently updated</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {DEMO_RECENTLY_UPDATED.map(item => (
                <div key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px', borderRadius: 8, cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = HOVER_BG }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: BODY_FONT, fontSize: 14, color: TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    <div style={{ fontFamily: BODY_FONT, fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{updatedLabel(item.ts)} by {item.by}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  )
}
