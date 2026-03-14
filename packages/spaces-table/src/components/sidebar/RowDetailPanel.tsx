import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { SpaceRow } from '@spaces/shared'
import {
  IconCross,
  IconDotsThreeVertical,
  IconWarning,
  Chip,
  IconHeart,
  IconFlag,
  IconExclamationPointCircle,
  IconStarFilled,
  IconChevronDown,
  IconSlidersY,
  IconArrowLeft,
  IconOffice,
  IconLink,
  IconGlobe,
  IconArrowUp,
  IconSlidersX,
  IconStickyNote,
  IconChevronRight,
  IconDotsThree,
  IconInsights,
} from '@mirohq/design-system'

interface RowDetailPanelProps {
  row: SpaceRow
  onClose: () => void
}

const PRIORITY_LABELS: Record<string, string> = {
  now:    'Now',
  next:   'Next',
  later:  'Later',
  triage: 'Triage',
  icebox: 'Icebox',
}

// Colors from Figma: Triage = #ffc6c6 / #600000; others extrapolated from design system
const PRIORITY_CHIP: Record<string, { bg: string; color: string }> = {
  now:    { bg: '#C6E9C6', color: '#003C00' },
  next:   { bg: '#C6D9FF', color: '#001E6B' },
  later:  { bg: '#FFE5C6', color: '#5C2D00' },
  triage: { bg: '#FFC6C6', color: '#600000' },
  icebox: { bg: '#E9EAEF', color: '#3C3F4A' },
}

const TABS = ['Details', 'Insights', 'Comments', 'Updates']

const INSIGHT_SUMMARIES: Record<string, string> = {
  '1':  'Customer feedback strongly signals demand for personalised portfolio guidance, with 142 mentions across 4,853 accounts. Users report that generic recommendations erode trust and lead to disengagement — AI-driven risk-adjusted suggestions are cited as a key driver of retention and upsell potential, with an estimated $425K revenue impact.',
  'r1': 'Customer feedback strongly signals demand for personalised portfolio guidance, with 142 mentions across 4,853 accounts. Users report that generic recommendations erode trust and lead to disengagement — AI-driven risk-adjusted suggestions are cited as a key driver of retention and upsell potential, with an estimated $425K revenue impact.',
  '2':  'With 118 mentions from 9,873 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $917K in retained and expanded revenue.',
  'r2': 'With 118 mentions from 9,873 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $917K in retained and expanded revenue.',
  '3':  'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 2,957 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  'r3': 'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 2,957 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  '4':  'International customers report significant friction around currency management, with 98 mentions spanning 8,532 accounts. Feedback from Atlassian and Notion highlights that delayed FX conversion and hidden fees are the top reasons users switch to competitor products. Solving this unlocks an estimated $843K in expansion revenue.',
  'r4': 'International customers report significant friction around currency management, with 98 mentions spanning 8,532 accounts. Feedback from Atlassian and Notion highlights that delayed FX conversion and hidden fees are the top reasons users switch to competitor products. Solving this unlocks an estimated $843K in expansion revenue.',
  '5':  'Automated savings rules surface frequently in feedback from users who want the app to work proactively on their behalf. 64 mentions across 6,394 customers reflect strong interest in set-and-forget financial automation. Shopify and Linear accounts indicate this feature would directly influence renewal decisions, with $629K in projected impact.',
  'r5': 'Automated savings rules surface frequently in feedback from users who want the app to work proactively on their behalf. 64 mentions across 6,394 customers reflect strong interest in set-and-forget financial automation. Shopify and Linear accounts indicate this feature would directly influence renewal decisions, with $629K in projected impact.',
  '6':  'Natural language search is one of the most-requested power-user features, with 48 mentions across 7,583 accounts. Customers at Apple, Google, and Slack describe current search as a friction point that slows down reconciliation workflows. Enabling plain-English queries is estimated to contribute $748K in retained revenue by reducing churn among high-value users.',
  'r10': 'Natural language search is one of the most-requested power-user features, with 48 mentions across 7,583 accounts. Customers at Apple, Google, and Slack describe current search as a friction point that slows down reconciliation workflows. Enabling plain-English queries is estimated to contribute $748K in retained revenue by reducing churn among high-value users.',
  '7':  'Recurring investment automation is gaining traction with customers focused on long-term wealth building, appearing in 45 mentions across 3,578 accounts. Feedback from Asana and Linear teams points to dollar-cost averaging as a missing capability that drives users to third-party investment apps. Closing this gap is valued at $317K in incremental revenue.',
  'r6': 'Recurring investment automation is gaining traction with customers focused on long-term wealth building, appearing in 45 mentions across 3,578 accounts. Feedback from Asana and Linear teams points to dollar-cost averaging as a missing capability that drives users to third-party investment apps. Closing this gap is valued at $317K in incremental revenue.',
  '8':  'Fraud detection improvements are cited in 23 mentions from 5,789 accounts, with enterprise customers at Apple and Google raising concerns about high-value transfer risk. Feedback highlights that the current anomaly model generates too many false positives, eroding confidence. Upgrading to v2 scoring is tied to $538K in at-risk contracts pending security review.',
  'r11': 'Fraud detection improvements are cited in 23 mentions from 5,789 accounts, with enterprise customers at Apple and Google raising concerns about high-value transfer risk. Feedback highlights that the current anomaly model generates too many false positives, eroding confidence. Upgrading to v2 scoring is tied to $538K in at-risk contracts pending security review.',
  '9':  'Social investing features generate 21 mentions across 1,039 accounts, primarily from younger, engagement-driven users. Feedback centres on wanting to learn from top performers rather than rely solely on personal research. While the revenue impact ($101K) is modest, this feature is a key differentiator for driving organic growth and word-of-mouth referrals.',
  '10': 'Tax-loss harvesting is a high-stakes feature with only 16 mentions but an outsized $921K revenue impact across 9,283 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios.',
  'r7': 'Tax-loss harvesting is a high-stakes feature with only 16 mentions but an outsized $921K revenue impact across 9,283 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios.',
  '11': "Open Banking integration appears in 16 mentions from 4,759 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $415K in expansion opportunities.",
  'r8': "Open Banking integration appears in 16 mentions from 4,759 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $415K in expansion opportunities.",
  '12': 'The financial literacy hub surfaces in 12 mentions across 8,531 accounts, with feedback pointing to a gap between product capability and user confidence. Customers at Figma and Airbnb describe onboarding drop-off as closely tied to users not understanding core financial concepts. An in-app learning centre is projected to improve activation rates and contribute $823K in retained revenue.',
  'r14': 'The financial literacy hub surfaces in 12 mentions across 8,531 accounts, with feedback pointing to a gap between product capability and user confidence. Customers at Figma and Airbnb describe onboarding drop-off as closely tied to users not understanding core financial concepts. An in-app learning centre is projected to improve activation rates and contribute $823K in retained revenue.',
  '13': 'Accessibility gaps are flagged in 10 mentions across 2,649 accounts, often escalated by enterprise procurement and legal teams at Notion and Asana. Feedback indicates that non-compliance with WCAG 2.2 AA is a contractual blocker in several renewal negotiations. Resolving these issues is directly tied to $214K in contracts that are currently at risk.',
  'r13': 'Accessibility gaps are flagged in 10 mentions across 2,649 accounts, often escalated by enterprise procurement and legal teams at Notion and Asana. Feedback indicates that non-compliance with WCAG 2.2 AA is a contractual blocker in several renewal negotiations. Resolving these issues is directly tied to $214K in contracts that are currently at risk.',
  '14': 'Push notifications for price alerts appear in 10 mentions from 7,582 accounts, with strong signal from goal-oriented users at Asana and Google. Feedback highlights that without timely alerts, users miss key market moments and feel the app is passive rather than proactive. A well-executed notification engine is estimated to improve DAU by 18% and contribute $738K in retained revenue.',
  'r9': 'Push notifications for price alerts appear in 10 mentions from 7,582 accounts, with strong signal from goal-oriented users at Asana and Google. Feedback highlights that without timely alerts, users miss key market moments and feel the app is passive rather than proactive. A well-executed notification engine is estimated to improve DAU by 18% and contribute $738K in retained revenue.',
  '15': 'Crypto support generates 8 mentions across 3,214 accounts, primarily from digitally native users at Stripe. While feedback volume is low, sentiment is high-intensity — users who want crypto describe it as a dealbreaker for full adoption. The $156K revenue estimate is conservative; analyst feedback suggests crypto unlocks a new segment with 3–5x growth potential.',
  '16': 'The advisor marketplace is mentioned across 5,621 customer accounts, with demand coming from users who want personalised guidance beyond what the app provides autonomously. Figma and Slack teams describe this as a trust-building feature that would increase willingness to pay for premium tiers, representing $490K in estimated revenue impact.',
  '17': 'Dark mode surfaces in 6 mentions from 1,847 accounts — lower volume but consistent sentiment across Apple, Google, and Atlassian users. Feedback frames it as a quality-of-life expectation rather than a nice-to-have, with its absence noted as a signal of product immaturity. NPS data correlates dark mode delivery with a 12-point satisfaction improvement.',
  'r12': 'Dark mode surfaces in 6 mentions from 1,847 accounts — lower volume but consistent sentiment across Apple, Google, and Atlassian users. Feedback frames it as a quality-of-life expectation rather than a nice-to-have, with its absence noted as a signal of product immaturity. NPS data correlates dark mode delivery with a 12-point satisfaction improvement.',
  '18': 'Gamified savings challenges appear in 5 mentions from 982 accounts, driven by younger users at Shopify and Airbnb. Feedback describes the current savings experience as transactional and uninspiring — badges, streaks, and challenges are seen as motivators that could meaningfully improve goal completion rates, with $130K in projected revenue impact.',
}

// Per-card impact weights — must sum to 1.0
const CARD_WEIGHTS = [0.13, 0.12, 0.10, 0.09, 0.08, 0.08, 0.07, 0.07, 0.06, 0.05, 0.05, 0.04, 0.03, 0.02, 0.01]

const CARD_STYLES = [
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 3, date: 'Aug 02' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Jul 18' },
  { borderColor: '#ffd4b2', Icon: IconExclamationPointCircle, date: 'Jun 30' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 5, date: 'Jun 12' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'May 28' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 4, date: 'May 14' },
  { borderColor: '#ffd4b2', Icon: IconExclamationPointCircle, date: 'Apr 29' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 5, date: 'Apr 11' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Mar 27' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 2, date: 'Mar 10' },
  { borderColor: '#ffd4b2', Icon: IconExclamationPointCircle, date: 'Feb 22' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 4, date: 'Feb 05' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Jan 20' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 5, date: 'Jan 08' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Dec 19' },
]

function generateFeedbackCards(row: SpaceRow) {
  const t = row.title
  const d = row.description ?? t

  const texts = [
    `Our team has been requesting ${t.toLowerCase()} for several quarters. ${d} This would directly reduce the manual overhead our finance team deals with every sprint.`,
    `"${t}" keeps coming up in our quarterly planning sessions. Without it, we're stuck maintaining brittle workarounds. Fixing this would unblock at least three downstream initiatives.`,
    `We've escalated this internally multiple times. ${d} The lack of this capability is one of the top reasons our power users are evaluating alternatives.`,
    `Positive early signal from our pilot group on ${t.toLowerCase()}. Users describe it as intuitive and well-scoped. A few noted edge cases around data freshness that would be worth addressing before GA.`,
    `This came up in our last exec review as a gap we need to close. ${d} Shipping this would meaningfully strengthen our renewal conversations this quarter.`,
    `We trialled ${t.toLowerCase()} with a subset of our enterprise accounts last month. The reception was genuinely enthusiastic — several customers flagged it as the most impactful update we've shipped this year.`,
    `${d} Our support team is fielding this question weekly. The workaround we've documented is fragile and regularly breaks after updates, creating ongoing noise for both customers and engineering.`,
    `I've been waiting for ${t.toLowerCase()} since we first onboarded. It fills a gap that's been blocking a whole category of workflows. When this ships, it'll be one of the first things I demo to new team members.`,
    `We raised ${t.toLowerCase()} in our last business review as a critical gap. Customers in our mid-market segment are particularly affected — two accounts have explicitly tied their renewal decision to progress here.`,
    `The concept is sound but the current implementation doesn't go far enough. ${d} We need finer-grained control before we can roll this out to our full user base without risking data integrity issues.`,
    `We've had three separate enterprise prospects mention ${t.toLowerCase()} during sales calls this quarter. It's consistently coming up as a competitive differentiator that we can't credibly respond to right now.`,
    `Rolled out ${t.toLowerCase()} to our power users last sprint and the feedback loop has been really positive. Usage is already higher than we expected at this stage — retention metrics are trending up meaningfully.`,
    `${d} This is the kind of foundational capability that unlocks a lot of downstream value. Without it, we're asking teams to do things manually that should be automated, which erodes trust in the platform over time.`,
    `Honestly, ${t.toLowerCase()} exceeded my expectations in the beta. It's fast, the UX is clean, and it integrates well with our existing setup. My main ask would be better documentation before the general rollout.`,
    `${d} We keep deprioritising this but the hidden cost is real. Every sprint we don't ship this, someone on our ops team is spending hours compensating. It's become a quiet tax on the whole organisation.`,
  ]

  const authors = [
    'Sarah Kim, VP of Product',
    'Marcus Osei, Head of Growth',
    'Priya Nair, Chief Product Officer',
    'Tom Hauser, Director of Product',
    'Lena Vogel, Product Lead',
    'James Whitfield, Senior PM',
    'Aiko Tanaka, Head of Customer Success',
    'David Reyes, Principal Product Manager',
    'Nina Patel, VP of Engineering',
    'Connor Walsh, Product Manager',
    'Mei Lin, Director of Partnerships',
    'Rafi Goldstein, Head of Product',
    'Simone Dubois, VP of Customer Experience',
    'Ben Okafor, Product Lead',
    'Tariq Hassan, Chief Operating Officer',
  ]

  return CARD_STYLES.map((style, i) => ({
    ...style,
    text: texts[i],
    author: authors[i],
    companies: row.companies.slice(0, 2),
  }))
}

export function RowDetailPanel({ row, onClose }: RowDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Details')
  const [insightDismissed, setInsightDismissed] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [dismissedCards, setDismissedCards] = useState<Set<number>>(new Set())
  const [promptCards, setPromptCards] = useState<Set<number>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastExiting, setToastExiting] = useState(false)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [showFeedbackToast, setShowFeedbackToast] = useState(false)
  const [feedbackToastExiting, setFeedbackToastExiting] = useState(false)

  const dismissToast = () => {
    setToastExiting(true)
    setTimeout(() => { setShowToast(false); setToastExiting(false) }, 300)
  }

  const dismissFeedbackToast = () => {
    setFeedbackToastExiting(true)
    setTimeout(() => { setShowFeedbackToast(false); setFeedbackToastExiting(false) }, 300)
  }

  const handleDismissCard = (index: number) => {
    setPromptCards(prev => new Set([...prev, index]))
    setToastExiting(false)
    setShowToast(true)
    if (toastTimer) clearTimeout(toastTimer)
    const t = setTimeout(() => dismissToast(), 2000)
    setToastTimer(t)
  }

  const handlePromptClose = (index: number) => {
    setPromptCards(prev => { const s = new Set(prev); s.delete(index); return s })
    setDismissedCards(prev => new Set([...prev, index]))
  }

  const handlePromptSubmit = (index: number) => {
    handlePromptClose(index)
    setShowFeedbackToast(true)
    setTimeout(() => dismissFeedbackToast(), 2000)
  }

  const handleUndo = () => {
    setDismissedCards(prev => {
      const arr = [...prev]
      arr.pop()
      return new Set(arr)
    })
    setPromptCards(prev => {
      const arr = [...prev]
      arr.pop()
      return new Set(arr)
    })
    dismissToast()
  }

  const chip = PRIORITY_CHIP[row.priority] ?? PRIORITY_CHIP.icebox
  const priorityLabel = PRIORITY_LABELS[row.priority] ?? row.priority

  const remainingFraction = CARD_WEIGHTS.reduce((sum, w, i) => dismissedCards.has(i) ? sum : sum + w, 0)
  const adjMentions = Math.round(row.mentions * remainingFraction)
  const adjCustomers = Math.round(row.customers * remainingFraction)
  const adjRevenue = Math.round(row.estRevenue * remainingFraction)

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden" style={{ width: 476, fontFamily: 'Open Sans, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 h-12 pl-4 pr-3 shrink-0" style={{ display: selectedPrompt ? 'none' : undefined }}>
        <p
          className="flex-1 min-w-0 truncate text-[#222428] leading-[1.5]"
          style={{
            fontFamily: "'Roobert PRO', sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            fontFeatureSettings: "'ss01' 1",
          }}
          title={row.title}
        >
          {row.title}
        </p>
        <div className="flex items-center shrink-0">
          <button aria-label="More options" className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <button aria-label="Close panel" className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors" onClick={onClose}>
            <IconCross css={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* 4px spacer */}
      {!selectedPrompt && <div className="h-1 shrink-0" />}

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="flex pl-4 pr-4 shrink-0 pb-4 pt-2" style={{ display: selectedPrompt ? 'none' : undefined }}>
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
      {!selectedPrompt && <div className="h-1 shrink-0" />}

      {/* ── Content (sliding panels) ─────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
      <div
        className="flex absolute inset-y-0 left-0"
        style={{
          width: 1428,
          transform: selectedPrompt ? 'translateX(-952px)' : selectedCompany ? 'translateX(-476px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
      {/* ── Main panel ─── */}
      <div className="h-full overflow-y-auto panel-scroll pl-4 pr-4 pt-2 flex flex-col gap-2 shrink-0" style={{ width: 476, overflowAnchor: 'none' }}>

        {activeTab === 'Details' && (
          <>
            {/* Title */}
            <FieldRow label="Title" alignStart>
              <div className="bg-white rounded px-2 py-1 w-full">
                <p className="text-[14px] font-bold text-[#222428] leading-[1.4]">{row.title}</p>
              </div>
            </FieldRow>

            {/* Description */}
            <FieldRow label="Description" alignStart>
              <div className="bg-white rounded px-2 py-1 w-full" style={{ minHeight: 88 }}>
                <p className="text-[14px] text-[#222428] leading-[1.4]">
                  {row.description ?? '—'}
                </p>
              </div>
            </FieldRow>

            {/* Status */}
            <FieldRow label="Status">
              <div
                className="inline-flex items-center rounded-[6px] px-2"
                style={{ backgroundColor: chip.bg, color: chip.color, height: 28 }}
              >
                <span className="text-[14px] leading-[20px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {priorityLabel}
                </span>
              </div>
            </FieldRow>

            {/* Start date */}
            <FieldRow label="Start date">
              <Chip removable={false} css={{ fontSize: 14 }}>02-Aug-2026</Chip>
            </FieldRow>

            {/* End date */}
            <FieldRow label="End date">
              <Chip removable={false} css={{ fontSize: 14 }}>08-Aug-2026</Chip>
            </FieldRow>

            {/* Blocking */}
            <FieldRow label="Blocking">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">—</span>
            </FieldRow>

            {/* Companies */}
            <FieldRow label="Companies" alignStart>
              <div className="flex flex-wrap gap-2 py-1">
                {row.companies.map((name) => (
                  <span key={name} onClick={() => setSelectedCompany(name)} style={{ cursor: 'pointer' }}>
                    <Chip removable={false} css={{ fontSize: 14 }}>{name}</Chip>
                  </span>
                ))}
              </div>
            </FieldRow>

            {/* Low-confidence Insights callout */}
            {!insightDismissed && (
              <div
                className="mt-2 mb-4 w-full rounded-lg p-4 flex flex-col gap-2 relative"
                style={{ backgroundColor: '#FFFBEB', border: '1px solid #F59E0B' }}
              >
                <button
                  onClick={() => setInsightDismissed(true)}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded text-[#92400E] hover:bg-[#FEF3C7] transition-colors"
                  aria-label="Dismiss"
                >
                  <IconCross css={{ width: 14, height: 14 }} />
                </button>
                <IconWarning size="medium" color="icon-neutrals-dark" />
                <p className="text-[16px] text-[#3C3F4A] leading-[1.4] pr-7" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
                  Low-confidence Insights
                </p>
                <p className="text-[14px] text-[#3C3F4A] leading-[1.5] w-full">
                  The title or description may be too brief to reliably match to customer feedback. Improving context will increase matching accuracy.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'Insights' && (
          <div className="flex flex-col gap-8 pb-6">

            {/* Summary */}
            <InsightSection label="Summary">
              <p className="text-[14px] text-[#656B81] leading-[1.4]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {INSIGHT_SUMMARIES[row.id] ?? row.description ?? row.title}
              </p>
            </InsightSection>

            {/* Top impacted customers */}
            <InsightSection label="Top impacted customers">
              <div className="flex flex-wrap gap-2 mt-2">
                {row.companies.map(name => (
                  <span key={name} onClick={() => setSelectedCompany(name)} style={{ cursor: 'pointer' }}>
                    <Chip removable={false} css={{ fontSize: 13 }}>{name}</Chip>
                  </span>
                ))}
              </div>
            </InsightSection>

            {/* Impact estimates */}
            <InsightSection label="Impact estimates">
              <div className="flex flex-col gap-0 w-full">
                <div className="flex gap-3">
                  <StatBox value={adjMentions} format={n => String(n)} label="Total Mentions" />
                  <StatBox value={adjCustomers} format={n => n.toLocaleString()} label="Unique Customers" />
                </div>
                <div className="flex gap-3">
                  <StatBox value={adjCustomers} format={n => n.toLocaleString()} label="Total Users" />
                  <StatBox value={adjRevenue} format={n => n > 0 ? `$${n}K` : '—'} label="Est. Revenue Impact" />
                </div>
              </div>
            </InsightSection>

            {/* Feedback */}
            <div className="flex flex-col gap-3 -mt-1">
              {/* Feedback header row */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#222428] leading-[1]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
                  Feedback
                </span>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] text-[#222428] hover:bg-[#F1F2F5] transition-colors">
                    Latest
                    <IconChevronDown size="small" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#222428] hover:bg-[#F1F2F5] transition-colors">
                    <IconSlidersY size="small" />
                  </button>
                </div>
              </div>

              {/* Feedback cards */}
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
                    {promptCards.has(i)
                      ? <FeedbackPrompt onSubmit={() => handlePromptSubmit(i)} onClose={() => handlePromptClose(i)} />
                      : <FeedbackCard {...card} onDismiss={() => handleDismissCard(i)} />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Details' && activeTab !== 'Insights' && (
          <div className="flex-1 flex items-center justify-center py-16">
            <p className="text-[14px] text-[#AEB2C0]">{activeTab} coming soon</p>
          </div>
        )}
      </div>
      {/* ── Company panel ─── */}
      <div className="h-full overflow-y-auto panel-scroll pl-4 pr-4 pt-3 flex flex-col shrink-0" style={{ width: 476 }}>
        {selectedCompany && (
          <CompanyDetailView
            company={selectedCompany}
            rowTitle={row.title}
            onBack={() => setSelectedCompany(null)}
            onPromptSelect={(prompt) => setSelectedPrompt(prompt)}
          />
        )}
      </div>
      {/* ── Chat panel ─── */}
      <div className="flex flex-col shrink-0 h-full" style={{ width: 476 }}>
        {selectedPrompt && (
          <PromptChatView
            prompt={selectedPrompt}
            company={selectedCompany ?? ''}
            onBack={() => setSelectedPrompt(null)}
            onClose={onClose}
          />
        )}
      </div>
      </div>{/* end slider */}
      </div>{/* end overflow wrapper */}
      {/* Toast — rendered via portal to escape panel's CSS transform */}
      {showToast && createPortal(
        <div
          className="fixed bottom-6 left-6 z-[9999] flex items-start gap-3 rounded-lg"
          style={{
            backgroundColor: '#2B2D33',
            boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
            width: 280,
            padding: '16px 40px 16px 16px',
            animation: toastExiting ? 'toastSlideDown 0.3s ease forwards' : 'toastSlideUp 0.25s ease',
          }}
        >
          <div className="flex flex-col gap-0 flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#FAFAFC] leading-[1.4] truncate" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>Feedback removed</p>
            <p className="text-[12px] text-[#C7CAD5] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>This will remove feedback from insights and impact metrics.</p>
            <div className="pt-3">
              <button onClick={handleUndo} className="text-[14px] text-[#FAFAFC] underline hover:opacity-80 transition-opacity">Undo</button>
            </div>
          </div>
          <button
            onClick={() => dismissToast()}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-[#FAFAFC] hover:bg-white/10 transition-colors"
          >
            <IconCross css={{ width: 14, height: 14 }} />
          </button>
        </div>,
        document.body
      )}
      {/* Feedback received toast */}
      {showFeedbackToast && createPortal(
        <div
          className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3 rounded-lg"
          style={{
            backgroundColor: '#2B2D33',
            boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
            width: 280,
            padding: '16px 40px 16px 16px',
            animation: feedbackToastExiting ? 'toastSlideDown 0.3s ease forwards' : 'toastSlideUp 0.25s ease',
          }}
        >
          <div className="flex flex-col gap-0 flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#FAFAFC] leading-[1.4]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>Feedback received!</p>
            <p className="text-[12px] text-[#C7CAD5] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>We really appreciate your feedback.</p>
          </div>
          <button
            onClick={() => dismissFeedbackToast()}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-[#FAFAFC] hover:bg-white/10 transition-colors"
          >
            <IconCross css={{ width: 14, height: 14 }} />
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}

const COMPANY_INFO: Record<string, { domain: string; stage: string; dealValue: string; source: string }> = {
  Figma:     { domain: 'figma.com',          stage: 'Enterprise', dealValue: '$85K',  source: 'Salesforce' },
  Airbnb:    { domain: 'airbnb.com',         stage: 'Enterprise', dealValue: '$120K', source: 'Salesforce' },
  Stripe:    { domain: 'stripe.com',         stage: 'Enterprise', dealValue: '$200K', source: 'Salesforce' },
  Notion:    { domain: 'notion.so',          stage: 'Growth',     dealValue: '$48K',  source: 'HubSpot' },
  Spotify:   { domain: 'spotify.com',        stage: 'Enterprise', dealValue: '$175K', source: 'Salesforce' },
  Linear:    { domain: 'linear.app',         stage: 'Growth',     dealValue: '$32K',  source: 'HubSpot' },
  Shopify:   { domain: 'shopify.com',        stage: 'Enterprise', dealValue: '$160K', source: 'Salesforce' },
  Dropbox:   { domain: 'dropbox.com',        stage: 'Enterprise', dealValue: '$95K',  source: 'Salesforce' },
  Atlassian: { domain: 'atlassian.com',      stage: 'Enterprise', dealValue: '$240K', source: 'Salesforce' },
  Miro:      { domain: 'miro.com',           stage: 'Enterprise', dealValue: '$110K', source: 'Salesforce' },
  Apple:     { domain: 'apple.com',          stage: 'Enterprise', dealValue: '$500K', source: 'Salesforce' },
  Google:    { domain: 'google.com',         stage: 'Enterprise', dealValue: '$500K', source: 'Salesforce' },
  Slack:     { domain: 'slack.com',          stage: 'Enterprise', dealValue: '$145K', source: 'Salesforce' },
  Asana:     { domain: 'asana.com',          stage: 'Growth',     dealValue: '$62K',  source: 'HubSpot' },
  ZenDesk:   { domain: 'zendesk.com',        stage: 'Enterprise', dealValue: '$88K',  source: 'Salesforce' },
  Jira:      { domain: 'jira.atlassian.com', stage: 'Enterprise', dealValue: '$240K', source: 'Salesforce' },
}

type AiItem = { title: string; stats: string; description: string }
type AiMessage = { role: 'user'; text: string } | { role: 'ai'; intro: string; items: AiItem[] }

function generateAiResponse(prompt: string, company: string): { intro: string; items: AiItem[] } {
  if (prompt.startsWith('Top 3 issues')) return {
    intro: `Here are the top 3 issues from ${company} the last 14 days, based on feedback count and company impact:`,
    items: [
      { title: 'Difficulty Managing Teams and Sub-Accounts', stats: '8 feedback, 6 companies, $277,298', description: `Users report it's "hard to keep track of teams and sub-accounts," leading to confusion and inefficiency.` },
      { title: 'Limited Section-Level Access Control in Spaces', stats: '6 feedback, 6 companies, $1,017,654', description: `Customers say, "We need more granular access controls within Spaces," highlighting security and collaboration concerns.` },
      { title: 'Cumbersome Addition and Arrangement of New Elements', stats: '4 feedback, 3 companies, $525,001', description: `Feedback includes, "Adding new elements is too complicated and disrupts workflow."` },
    ],
  }
  if (prompt.startsWith('Top five key insights')) return {
    intro: `Here are the five key insights for ${company} based on recent feedback:`,
    items: [
      { title: 'Renewal risk tied to feature gaps', stats: '14 mentions, 8 companies, $842,000', description: `Multiple stakeholders have flagged missing capabilities as a direct factor in renewal decisions.` },
      { title: 'Power users most impacted', stats: '11 mentions, 6 companies, $614,500', description: `Advanced workflows are disproportionately affected, increasing churn risk among high-value users.` },
      { title: 'Manual workarounds are widespread', stats: '9 mentions, 5 companies, $390,200', description: `Teams have built brittle internal processes to compensate, adding ongoing maintenance overhead.` },
      { title: 'Competitive alternatives being evaluated', stats: '7 mentions, 4 companies, $512,000', description: `At least two contacts have mentioned evaluating competing tools in the past quarter.` },
      { title: 'Exec-level escalation is high', stats: '5 mentions, 3 companies, $725,000', description: `This has been escalated to VP and C-suite stakeholders, making it a priority for account health.` },
    ],
  }
  return {
    intro: `Here's what I found about ${company} based on available feedback and account data:`,
    items: [
      { title: 'Enterprise-tier account with high engagement', stats: '42 total feedback signals', description: `${company} is an active feedback contributor across multiple product areas, with signals spanning 6+ internal teams.` },
      { title: 'Top requested capabilities', stats: '18 mentions in last 30 days', description: `Automation, reporting, and third-party integrations are the most consistently requested improvements.` },
      { title: 'Renewal timeline context', stats: 'Contract review in Q3', description: `Based on deal data, ${company}'s renewal window aligns with Q3 — making current feature gaps time-sensitive.` },
    ],
  }
}

function PromptChatView({ prompt, company, onBack, onClose }: { prompt: string; company: string; onBack: () => void; onClose: () => void }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{ role: 'user', text: prompt }])
    setThinking(true)
    const t = setTimeout(() => {
      setThinking(false)
      setMessages(m => [...m, { role: 'ai', ...generateAiResponse(prompt, company) }])
    }, 1400)
    return () => clearTimeout(t)
  }, [prompt, company])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setMessages(m => [...m, { role: 'ai', intro: `Based on available data for ${company}:`, items: [
        { title: 'Follow-up context', stats: 'Latest signals', description: `For "${userMsg}" — the most relevant feedback points to workflow friction and integration gaps as root causes. Would you like me to filter by a specific time range or team?` },
      ] }])
    }, 1400)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center h-14 pl-3 pr-2 shrink-0 gap-1">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0">
          <IconChevronRight css={{ width: 16, height: 16, transform: 'rotate(180deg)' }} />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-[16px] text-[#222428] leading-[1.5] font-semibold truncate" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
            Miro Insights
          </span>
          <span className="shrink-0 px-1.5 py-0.5 rounded text-[11px] font-semibold text-[#3C3F4A] bg-[#E9EAEF] leading-none" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Beta
          </span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0">
          <IconDotsThree css={{ width: 16, height: 16 }} />
        </button>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0">
          <IconCross css={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll px-6 pt-2 pb-3 flex flex-col gap-4">
        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[75%] rounded-lg px-4 py-3 text-[14px] leading-[1.57] text-[#3C3F4A]" style={{ backgroundColor: '#F1F2F5', fontFamily: 'Open Sans, sans-serif' }}>
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-3">
              <p className="text-[14px] leading-[1.57] text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{msg.intro}</p>
              <ol className="flex flex-col gap-4 list-decimal list-inside" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {msg.items.map((item, j) => (
                  <li key={j} className="text-[14px] leading-[1.57] text-[#222428]" style={{ listStylePosition: 'outside', marginLeft: 16 }}>
                    <span className="font-semibold">{item.title}</span>
                    <br />
                    <span className="text-[#222428]">({item.stats}): </span>
                    <button className="inline-flex items-center justify-center w-5 h-5 rounded-md align-middle mx-0.5" style={{ backgroundColor: '#E8ECFC' }}>
                      <IconLink css={{ width: 10, height: 10, color: '#4262FF' }} />
                    </button>
                    <br />
                    <span className="text-[#656B81]">{item.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          )
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Thinking indicator — 16px above input */}
      {thinking && (
        <div className="shrink-0 flex items-center gap-2 px-6 text-[#656B81]" style={{ paddingBottom: 16, fontFamily: 'Open Sans, sans-serif' }}>
          <IconInsights css={{ width: 16, height: 16 }} />
          <span className="text-[13px]">Thinking…</span>
        </div>
      )}

      {/* Input card */}
      <div className="shrink-0 px-4 pb-4" style={{ paddingTop: thinking ? 0 : 8 }}>
        <div className="flex flex-col rounded-lg border border-[#EBEBEB] bg-white" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask anything..."
            rows={2}
            className="w-full px-4 pt-4 pb-2 text-[14px] text-[#222428] outline-none bg-transparent resize-none placeholder:text-[#7D8297] leading-[1.4]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconSlidersX size="small" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconStickyNote size="small" />
              </button>
            </div>
            <button
              onClick={send}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: input.trim() ? '#4262FF' : '#E9EAEF', color: input.trim() ? '#fff' : '#AEB2C0' }}
            >
              <IconArrowUp css={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompanyDetailView({ company, rowTitle: _rowTitle, onBack, onPromptSelect }: { company: string; rowTitle: string; onBack: () => void; onPromptSelect: (prompt: string) => void }) {
  const info = COMPANY_INFO[company] ?? { domain: `${company.toLowerCase()}.com`, stage: 'N/A', dealValue: 'N/A', source: 'N/A' }
  return (
    <div className="flex flex-col pb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 h-8 rounded-lg px-2 text-[14px] font-semibold text-[#656B81] hover:bg-[#F1F2F5] transition-colors self-start -ml-2 mb-2"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <IconArrowLeft size="small" />
        {company}
      </button>
      <p className="text-[16px] text-[#222428] leading-[1.5] mb-1" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>Details</p>
      <div className="flex flex-col">
        <CompanyFieldRow icon={<IconOffice size="small" />} label="Name"><Chip removable={false} css={{ fontSize: 13 }}>{company}</Chip></CompanyFieldRow>
        <CompanyFieldRow icon={<IconLink size="small" />} label="Domain"><Chip removable={false} css={{ fontSize: 13 }}>{info.domain}</Chip></CompanyFieldRow>
        <CompanyFieldRow icon={<span className="text-[13px] leading-none">◎</span>} label="Stage"><Chip removable={false} css={{ fontSize: 13 }}>{info.stage}</Chip></CompanyFieldRow>
        <CompanyFieldRow icon={<span className="text-[13px] font-semibold leading-none">$</span>} label="Deal Value"><span className="text-[14px] text-[#222428] px-1">{info.dealValue}</span></CompanyFieldRow>
        <CompanyFieldRow icon={<IconGlobe size="small" />} label="Source"><Chip removable={false} css={{ fontSize: 13 }}>{info.source}</Chip></CompanyFieldRow>
      </div>
      <p className="text-[16px] text-[#222428] leading-[1.5] mt-6 mb-3" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>Discover more about {company}</p>
      <div className="flex flex-col gap-3">
        {[`Top five key insights`, `Learn more about ${company}`, `Top 3 issues from ${company}`].map(label => (
          <button key={label} onClick={() => onPromptSelect(label)} className="flex items-center h-8 px-3 rounded-xl text-[14px] text-[#222428] bg-white border border-[#E9EAEF] hover:border-[#C2C5D3] transition-colors self-start whitespace-nowrap" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function CompanyFieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 min-h-[40px]">
      <div className="w-[120px] shrink-0 flex items-center gap-2 text-[#656B81]">
        <span className="flex items-center shrink-0">{icon}</span>
        <span className="text-[14px] leading-[1.4]">{label}</span>
      </div>
      <div className="flex-1 flex items-center">{children}</div>
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
  const [displayed, setDisplayed] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    if (from === to) return
    let startTs: number | null = null
    const animate = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplayed(Math.round(from + (to - from) * eased))
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

function StatBox({ value, format, label }: { value: number; format: (n: number) => string; label: string }) {
  const animated = useAnimatedNumber(value)
  return (
    <div className="flex-1 flex flex-col gap-1 pb-3">
      <span className="text-[32px] text-[#222428] leading-[1.2]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1", display: 'block' }}>
        {format(animated)}
      </span>
      <span className="text-[14px] text-[#656B81] leading-[1.4]">{label}</span>
    </div>
  )
}

function FeedbackPrompt({ onSubmit, onClose }: { onSubmit: () => void; onClose: () => void }) {
  const [value, setValue] = useState('')

  return (
    <div
      className="w-full rounded-xl p-4 flex flex-col gap-3 relative"
      style={{ backgroundColor: '#F2F4FC' }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#E2E6F7] transition-colors"
        aria-label="Close"
      >
        <IconCross css={{ width: 14, height: 14 }} />
      </button>

      <p className="text-[16px] text-[#222428] pr-8 leading-[1.5]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
        Share your feedback?
      </p>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Tell us why you're removing this..."
        rows={3}
        className="w-full rounded-lg px-3 py-2 text-[14px] text-[#222428] leading-[1.5] resize-none outline-none border border-[#C2C5D3] focus:border-[#4262FF] bg-white placeholder:text-[#AEB2C0] transition-colors"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onSubmit}
          className="px-4 h-8 rounded-lg text-[14px] font-semibold text-white transition-colors"
          style={{ backgroundColor: '#4262FF', fontFamily: 'Open Sans, sans-serif' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2D4FE0')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4262FF')}
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="px-4 h-8 rounded-lg text-[14px] font-semibold text-[#222428] hover:bg-[#E2E6F7] transition-colors"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          Cancel
        </button>
      </div>
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
  onDismiss,
}: {
  borderColor: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>
  stars?: number
  text: string
  author: string
  date: string
  companies: string[]
  onDismiss: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="w-full rounded-xl flex flex-col gap-2 p-5 transition-all duration-200"
      style={{ border: `2px solid ${borderColor}`, borderBottomWidth: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card header: icon + date (on hover) + actions */}
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
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <button onClick={onDismiss} aria-label="Remove signal" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
            <IconCross css={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Stars (optional) */}
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
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? 'Show less' : 'Show more'}
      </span>

      {/* Author */}
      <p className="text-[12px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        {author}
      </p>

      {/* Company chips — smooth slide-in on hover using CSS grid trick */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: hovered ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="flex flex-wrap gap-2 pt-1">
            {companies.map(name => (
              <Chip key={name} removable={false} css={{ fontSize: 14 }}>{name}</Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldRow({
  label,
  children,
  alignStart,
}: {
  label: string
  children: React.ReactNode
  alignStart?: boolean
}) {
  return (
    <div className={`flex gap-2 min-h-[40px] py-1 ${alignStart ? 'items-start' : 'items-center'}`}>
      <div className="w-[100px] shrink-0 flex items-center">
        <span className="text-[14px] text-[#656B81] leading-[1.4]">{label}</span>
      </div>
      <div className="flex-1 min-w-0 flex items-center flex-wrap">
        {children}
      </div>
    </div>
  )
}
