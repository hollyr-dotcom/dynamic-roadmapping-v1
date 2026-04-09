import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import type { SpaceRow } from '@spaces/shared'
import { companyARR } from '@spaces/shared'
import { Button, IconDotsThreeVertical, DropdownMenu, IconSquaresTwoOverlap, IconBoard, IconEyeOpen, IconInsightsSearch, IconInformationMarkCircle, IconTasks } from '@mirohq/design-system'
import {
  IconSparksFilled,
  IconSmileyChat,
  IconGlobe,
  IconArrowDown,
  IconExclamationPointCircle,
  IconCross,
  IconPlus,
  IconTimelineFormat,
} from '@mirohq/design-system'

const TAG_BG: Record<string, string> = {
  New: '#ADF0C7',
  Customer: '#FFF6B6',
  Market: '#C6DCFF',
  Urgent: '#FFD8F4',
  Strengthening: '#F8D3AF',
  Weakening: '#DEDAFF',
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
  if (pct >= 95) return '#ADF0C7' // green — very high
  if (pct >= 88) return '#C6DCFF' // blue — high
  if (pct >= 75) return '#FFF6B6' // yellow — moderate
  return '#F8D3AF'                 // orange — low
}

export function confidenceTagStyle(confidence: string): { bg: string; text: string } {
  const pct = parseInt(confidence)
  if (pct >= 95) return { bg: '#DCFFF1', text: '#1C6B4A' } // green subtle
  if (pct >= 88) return { bg: '#DAEAFF', text: '#0055CC' } // blue subtle
  if (pct >= 80) return { bg: '#FFF8D6', text: '#7F5F01' } // yellow subtle
  return { bg: '#FFE2BD', text: '#A54800' }                 // orange subtle
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

export const CARD_SUMMARIES: Record<string, string> = {
  '1': 'This is the highest-volume theme with ~793 projected monthly mentions in March. Customers report board-wide lag, stuck loading spinners, frozen editing, and browser tab crashes when tables exceed 100–300 rows. This directly correlates with the existing roadmap item "I can work easily with large tables without significantly degrading the performance of my browser" (P0) and the item about going beyond 1000 rows and 50 fields. The volume and severity of this feedback — including total browser crashes and lost work — suggests this should remain a top priority and may need acceleration. The issue is compounded during collaborative sessions and large paste operations.',
  '2': 'Broken paste from Excel, Google Sheets, CSV, Word, and Confluence is a massive pain point with projected ~652 monthly mentions. The most critical sub-issue is that large pastes are silently truncated to 5 rows, forcing users to manually add rows and re-paste in chunks. Beyond truncation, data collapses into single cells, formatting is stripped, and rich text (bullets, links, bold) is flattened. No current roadmap item addresses paste/import fidelity. This is a foundational gap — customers cannot reliably get data into tables, which undermines adoption of all downstream table features.',
  '3': 'Cell formatting limitations are the highest-volume theme at ~874 projected monthly mentions in March. Customers consistently ask for bullets/numbered lists, bold text, and clickable links within cells. Current cells are essentially plain text, which breaks use cases like mini-specs, acceptance criteria, meeting notes, and workshop content. This is not covered by any existing roadmap item. The demand spans diverse user personas (PMs, facilitators, planners) and is strongly tied to paste fidelity issues — even if paste is fixed, cells need to support the rich content.',
  '4': 'Users are reporting that AI-generated tables appear instantly and unexpectedly overwrite their existing content without warning or preview. The lack of opt-in controls means mistakes are hard to reverse, eroding trust in the AI feature. Feedback consistently asks for a suggestion-only mode — where the AI proposes a table structure before inserting it — with a visible preview and explicit confirmation step before any changes are applied.',
}

export { CARD_SUMMARIES as OVERVIEW_CARD_SUMMARIES }

export const OVERVIEW_ROWS: Record<string, SpaceRow> = {
  '1': { id: 'ov1', title: 'Accelerate large-table performance improvements — boards become unusable at ~100+ rows', description: 'Customers report board-wide lag, stuck loading spinners, frozen editing, and browser tab crashes when tables exceed 100–300 rows.', mentions: 793, customers: 284, estRevenue: 4200, companies: ['Figma', 'Atlassian', 'Notion', 'Stripe'], priority: 'now' },
  '2': { id: 'ov2', title: 'Fix paste and CSV import fidelity — especially the 5-row truncation bug', description: 'Large pastes are silently truncated to 5 rows, forcing users to manually add rows and re-paste in chunks. Data collapses into single cells and formatting is stripped.', mentions: 652, customers: 198, estRevenue: 3100, companies: ['Google', 'Dropbox', 'Asana', 'Linear'], priority: 'now' },
  '3': { id: 'ov3', title: 'Add rich text editing inside table cells (bullets, bold, links)', description: 'Current cells are essentially plain text, breaking use cases like mini-specs, acceptance criteria, meeting notes, and workshop content.', mentions: 874, customers: 312, estRevenue: 3800, companies: ['Miro', 'Notion', 'Atlassian', 'Figma'], priority: 'now' },
  '4': { id: 'ov4', title: 'Rein in AI table creation — make it suggestion-only with preview and opt-in controls', description: 'AI-generated tables appear instantly and unexpectedly overwrite existing content without warning or preview, eroding trust in the AI feature.', mentions: 241, customers: 89, estRevenue: 1900, companies: ['Slack', 'Airbnb', 'Google', 'Spotify'], priority: 'now' },
}

// Register top-requester data for overview rows so buildFlow2 can render "Top requesters"
companyARR['ov1'] = [
  { company: 'Atlassian', arr: 240, contacts: 15 },
  { company: 'Stripe',    arr: 200, contacts: 8  },
  { company: 'Figma',     arr: 85,  contacts: 12 },
  { company: 'Notion',    arr: 48,  contacts: 6  },
]
companyARR['ov2'] = [
  { company: 'Google',   arr: 500, contacts: 22 },
  { company: 'Dropbox',  arr: 95,  contacts: 9  },
  { company: 'Asana',    arr: 62,  contacts: 7  },
  { company: 'Linear',   arr: 32,  contacts: 5  },
]
companyARR['ov3'] = [
  { company: 'Miro',      arr: 110, contacts: 18 },
  { company: 'Atlassian', arr: 240, contacts: 14 },
  { company: 'Notion',    arr: 48,  contacts: 11 },
  { company: 'Figma',     arr: 85,  contacts: 9  },
]
companyARR['ov4'] = [
  { company: 'Slack',   arr: 145, contacts: 10 },
  { company: 'Google',  arr: 500, contacts: 7  },
  { company: 'Airbnb',  arr: 120, contacts: 5  },
  { company: 'Spotify', arr: 175, contacts: 4  },
]

function TypewriterText({ text, speed = 55 }: { text: string; speed?: number }) {
  const words = text.split(' ')
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count >= words.length) return
    const t = setTimeout(() => setCount(c => c + 1), speed)
    return () => clearTimeout(t)
  }, [count, words.length, speed])
  return (
    <span style={{ position: 'relative', display: 'block' }}>
      {/* Invisible full text holds the final height from the start */}
      <span style={{ visibility: 'hidden', userSelect: 'none' }} aria-hidden="true">{text}</span>
      <span style={{ position: 'absolute', inset: 0 }}>{words.slice(0, count).join(' ')}</span>
    </span>
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
    <div className="flex flex-col items-center w-full h-full select-none pt-10">

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


    </div>
  )
}
