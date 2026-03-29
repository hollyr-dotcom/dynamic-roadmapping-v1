import { useState } from 'react'
import type { SpaceRow } from '@spaces/shared'
import { Button, Chip, IconDotsThreeVertical, DropdownMenu, IconSquaresTwoOverlap, IconBoard } from '@mirohq/design-system'
import {
  IconChartLine,
  IconChartProgress,
  IconSparks,
  IconLightning,
  IconChatTwo,
  IconSmileyChat,
  IconGlobe,
  IconArrowDown,
  IconExclamationPointCircle,
  IconCross,
  IconPlus,
  IconTimelineFormat,
  IconEyeOpen,
  IconArrowRight as _IconArrowRight,
} from '@mirohq/design-system'

export const TAG_BG: Record<string, string> = {
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

export function confidenceBorderColor(confidence: string): string {
  const pct = parseInt(confidence)
  if (pct >= 95) return '#ADF0C7' // green — very high
  if (pct >= 88) return '#C6DCFF' // blue — high
  if (pct >= 75) return '#FFF6B6' // yellow — moderate
  return '#F8D3AF'                 // orange — low
}

function confidenceTagStyle(confidence: string): { bg: string; text: string } {
  const pct = parseInt(confidence)
  if (pct >= 95) return { bg: '#DCFFF1', text: '#1C6B4A' } // green subtle
  if (pct >= 88) return { bg: '#C6DCFF', text: '#0055CC' } // blue subtle
  if (pct >= 80) return { bg: '#FFF0B3', text: '#7F5F01' } // yellow subtle
  return { bg: '#FFE2BD', text: '#A54800' }                 // orange subtle
}

export function TagIcon({ label }: { label: string }) {
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

type CardIcon = 'chart-line' | 'chart-progress' | 'sparks' | 'lightning' | 'chat'

type MatchTag = 'Demand change' | 'Priority mismatch' | 'Unmatched demand' | 'New evidence'

const MATCH_TAG_STYLE: Record<MatchTag, { bg: string; text: string }> = {
  'Demand change':    { bg: '#F8D3AF', text: '#A54800' },
  'Priority mismatch': { bg: '#FBBEEA', text: '#7B2F6E' },
  'Unmatched demand': { bg: '#EFE9FF', text: '#3D25A0' },
  'New evidence':     { bg: '#EAFAEA', text: '#067429' },
}

const CARDS: {
  id: string
  icon: CardIcon
  tags: string[]
  matchTag: MatchTag
  title: string
  description: string
  confidence: string
  primaryAction: string
  secondaryAction: string
}[] = [
  {
    id: '1',
    icon: 'lightning',
    tags: ['Urgent', 'Customer'],
    matchTag: 'Priority mismatch',
    title: 'Accelerate large-table performance improvements — boards become unusable at ~100+ rows',
    description: '~793 projected monthly mentions make this the highest-volume theme in March. It correlates directly to an existing P0 roadmap item that may need to be pulled forward.',
    confidence: '90%',
    primaryAction: 'Reprioritize',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '2',
    icon: 'chart-progress',
    tags: ['New', 'Customer'],
    matchTag: 'Unmatched demand',
    title: 'Fix paste and CSV import fidelity — especially the 5-row truncation bug',
    description: 'Paste from Excel, Google Sheets, CSV, and Confluence is broken for ~652 projected monthly mentions. This foundational gap isn\'t covered by any existing roadmap item.',
    confidence: '88%',
    primaryAction: 'Add to roadmap',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '3',
    icon: 'chart-line',
    tags: ['Customer', 'Market'],
    matchTag: 'Unmatched demand',
    title: 'Add rich text editing inside table cells (bullets, bold, links)',
    description: '~874 projected monthly mentions make rich text the single highest-volume theme in March. Current cells are plain text only, breaking use cases like mini-specs, meeting notes, and workshop content.',
    confidence: '85%',
    primaryAction: 'Add to roadmap',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '4',
    icon: 'sparks',
    tags: ['Urgent', 'Customer'],
    matchTag: 'New evidence',
    title: 'Rein in AI table creation — make it suggestion-only with preview and opt-in controls',
    description: 'AI-generated tables overwrite existing content with no preview or confirmation, and the pattern is emerging across multiple enterprise accounts. More evidence needed before scoping a fix.',
    confidence: '83%',
    primaryAction: 'Review evidence',
    secondaryAction: 'Dive deeper',
  },
]

function CardIcon({ type }: { type: CardIcon }) {
  const props = { css: { width: 24, height: 24 } }
  if (type === 'chart-line') return <IconChartLine {...props} />
  if (type === 'chart-progress') return <IconChartProgress {...props} />
  if (type === 'sparks') return <IconSparks {...props} />
  if (type === 'lightning') return <IconLightning {...props} />
  if (type === 'chat') return <IconChatTwo {...props} />
  return null
}

export function OverviewPage({ onDiveDeeper, onAddToRoadmap }: { onDiveDeeper?: (cardId: string) => void; onAddToRoadmap?: (cardId: string) => void }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  return (
    <div className="px-14 py-8 flex flex-col gap-6 max-w-[760px] mx-auto w-full">
      {CARDS.filter((card) => !dismissed.has(card.id)).map((card) => (
        <div
          key={card.id}
          className="group relative rounded-[24px] bg-white overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_24px_rgba(34,36,40,0.10)]"
          style={{ border: '0.5px solid #e0e2e8', paddingBottom: 80 }}
        >
          <div className="p-6 flex flex-col gap-3">
            {/* Icon + tags + close row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center shrink-0" style={{ color: '#222428' }}>
                  <CardIcon type={card.icon} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip removable={false} css={{ backgroundColor: MATCH_TAG_STYLE[card.matchTag].bg, color: MATCH_TAG_STYLE[card.matchTag].text, fontWeight: 700, borderRadius: 6, fontFamily: "'Roobert PRO', sans-serif", fontSize: 14 }}>{card.matchTag}</Chip>
                  <Chip removable={false} css={{ backgroundColor: confidenceTagStyle(card.confidence).bg, color: confidenceTagStyle(card.confidence).text, fontWeight: 700, borderRadius: 6, fontFamily: "'Roobert PRO', sans-serif", fontSize: 14 }}>{card.confidence} confidence</Chip>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full text-[#9da3b4] hover:bg-[#F1F2F5] hover:text-[#222428] transition-colors">
                      <IconDotsThreeVertical size="small" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
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
                <button
                  onClick={() => setDismissed(prev => new Set(prev).add(card.id))}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-[#9da3b4] hover:bg-[#F1F2F5] hover:text-[#222428] transition-colors"
                >
                  <IconCross size="small" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[17px] font-medium text-[#1a1b1e] leading-snug -mt-0.5" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif', color: '#656b81' }}>
              {card.description}
            </p>

          </div>

          {/* Hover-reveal actions */}
          <div className="absolute bottom-5 left-6 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-300 ease-out">
            <Button
              variant="primary"
              size="medium"
              onPress={() => { if (card.primaryAction === 'Add to roadmap') { onAddToRoadmap?.(card.id); setDismissed(prev => new Set(prev).add(card.id)) } }}
            >
              <Button.IconSlot>
                {card.primaryAction === 'Add to roadmap' ? <IconPlus /> : card.primaryAction === 'Reprioritize' ? <IconTimelineFormat /> : <IconEyeOpen />}
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
          </div>
        </div>
      ))}
    </div>
  )
}
