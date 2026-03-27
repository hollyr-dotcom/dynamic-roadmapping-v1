import { useState } from 'react'
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
  '1': '47 customers requested Jira custom fields in Q3, up 65% from the previous quarter. Feedback spans mid-market and enterprise accounts, with multiple sales calls flagging it as a direct evaluation criterion. Competitors lacking this capability are being eliminated at the shortlisting stage. The window for differentiation is narrowing as two competitors have this on their public roadmap.',
  '2': 'Active usage dropped 22% over 90 days despite a 14% increase in new signups — a clear signal that what we\'re shipping isn\'t aligning with how teams actually work. One feature stands out: it accounts for 38% of retained revenue and shows consistent week-over-week engagement. The evidence points to a need to double down on this pattern rather than continuing to fund adjacent bets with lower adoption.',
  '3': 'Facilitators across 60+ customer interviews cite AI sticky note clustering as the single highest time-saver we\'ve shipped — averaging over 40 minutes saved per session. The signal is particularly strong in retro and workshop workflows. FigJam shipped a near-identical feature last sprint, which means the competitive advantage is time-limited. Customers who have used both rate ours higher on accuracy, giving us a narrow window to expand and lock in preference.',
  '4': '12 enterprise accounts have explicitly named canvas lag as the primary blocker to broader team rollout. The issue surfaces in 34% of churn interviews this quarter — more than any other single factor. Performance degradation begins at 40–50 objects on a board and becomes critical above 80. Three Tier-1 accounts are on watch status, representing a combined $2.1M ARR at risk if the issue isn\'t addressed before their renewal window.',
  '5': 'Teams using async video on sticky notes are reporting 30% fewer sync meetings, the strongest meeting-reduction signal we\'ve seen from any feature. But 18 open support threads show the same users frustrated that the capability doesn\'t extend to shapes, connectors, or frames. The pattern is clear: the value is proven, and users are trying to expand it themselves via workarounds. Shipping native support across all object types is a direct path to deepening the existing behaviour.',
}

export { CARD_SUMMARIES as OVERVIEW_CARD_SUMMARIES }

type CardIcon = 'chart-line' | 'chart-progress' | 'sparks' | 'lightning' | 'chat'

const CARDS: {
  id: string
  icon: CardIcon
  tags: string[]
  title: string
  description: string
  arr: string
  confidence: string
  confidenceDelta: string
  likes: number
  comments?: number
  primaryAction: string
  secondaryAction: string
}[] = [
  {
    id: '1',
    icon: 'chart-line',
    tags: ['New', 'Customer', 'Market'],
    title: 'Jira custom fields demand surged +65% this quarter',
    description: '47 customers requested this in Q3 alone, up from 28 the quarter before. Competitors without this feature are losing mid-market deals at the evaluation stage.',
    arr: '$2.3 Million ARR',
    confidence: '99%',
    confidenceDelta: '+1%',
    likes: 1,
    comments: 1,
    primaryAction: 'Add to roadmap',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '2',
    icon: 'chart-progress',
    tags: ['New', 'Customer'],
    title: 'Adoption plateau signals mismatch between vision and usage',
    description: 'Active usage dropped 22% over 90 days despite growing signups, pointing to a gap between what we\'re building and how teams actually work. The one feature bucking this trend accounts for 38% of retained revenue.',
    arr: '$2.3 Million ARR',
    confidence: '88%',
    confidenceDelta: '+1%',
    likes: 3,
    primaryAction: 'Reprioritize',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '3',
    icon: 'sparks',
    tags: ['Urgent', 'Customer', 'Market'],
    title: 'AI sticky note clustering saves facilitators 40+ minutes per session',
    description: 'Facilitators running retros and workshops report saving over 40 minutes per session, the highest time-saving of any AI feature we\'ve shipped. FigJam launched a near-identical feature last sprint, narrowing our window.',
    arr: '$4.1 Million ARR',
    confidence: '94%',
    confidenceDelta: '+3%',
    likes: 7,
    comments: 3,
    primaryAction: 'Add to roadmap',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '4',
    icon: 'lightning',
    tags: ['Strengthening', 'Customer'],
    title: 'Real-time cursor lag on boards with 50+ objects drives session abandonment',
    description: '12 enterprise accounts named canvas lag as the primary blocker to rolling out across their full team. It appeared in 34% of churn interviews this quarter — the highest of any single issue.',
    arr: '$3.6 Million ARR',
    confidence: '91%',
    confidenceDelta: '+2%',
    likes: 5,
    comments: 2,
    primaryAction: 'Review evidence',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '5',
    icon: 'chat',
    tags: ['Urgent', 'Customer'],
    title: 'Async video comments reduce meeting load — users want it on every object',
    description: 'Teams using async video on sticky notes report 30% fewer sync meetings, but the same users are frustrated it doesn\'t work on shapes, connectors, or frames. This gap is appearing in 18 open support threads.',
    arr: '$2.7 Million ARR',
    confidence: '88%',
    confidenceDelta: '+4%',
    likes: 9,
    comments: 5,
    primaryAction: 'Add to roadmap',
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

export function OverviewPage({ onDiveDeeper }: { onDiveDeeper?: (cardId: string) => void }) {
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
            {/* Icon + confidence + close row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center shrink-0" style={{ color: '#222428' }}>
                  <CardIcon type={card.icon} />
                </div>
                <span
                  className="flex items-center gap-1 py-1 px-2.5 rounded-full text-[12px] text-[#222428]"
                  style={{ backgroundColor: '#F1F2F5', fontFamily: 'Open Sans, sans-serif' }}
                >
                  {card.confidence} confidence
                </span>
              </div>
              <button
                onClick={() => setDismissed(prev => new Set(prev).add(card.id))}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#9da3b4] hover:bg-[#F1F2F5] hover:text-[#222428] transition-colors"
              >
                <IconCross size="small" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-[17px] font-medium text-[#1a1b1e] leading-snug -mt-0.5" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] leading-relaxed line-clamp-2" style={{ fontFamily: 'Open Sans, sans-serif', color: '#656b81' }}>
              {card.description}
            </p>

          </div>

          {/* Hover-reveal actions */}
          <div className="absolute bottom-5 left-6 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-300 ease-out">
            <button
              className="h-9 px-5 rounded-[18px] text-[13px] font-medium text-white active:scale-[0.97] transition-transform hover:brightness-110"
              style={{ backgroundColor: '#1a1b1e', boxShadow: '0px 12px 32px rgba(34,36,40,0.2), 0px 0px 8px rgba(34,36,40,0.06)', fontFamily: 'Open Sans, sans-serif' }}
            >
              {card.primaryAction}
            </button>
            <button
              onClick={() => onDiveDeeper?.(card.id)}
              className="h-9 px-5 rounded-[18px] text-[13px] font-medium text-[#374151] border border-[#e0e2e8] bg-white hover:bg-[#f5f5f3] active:scale-[0.97] transition-[transform,background-color]"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {card.secondaryAction}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
